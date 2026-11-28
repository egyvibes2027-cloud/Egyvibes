import {
  EGYPT_AIRPORTS,
  EGYPT_CITIES,
  EGYPTIAN_FOODS,
  egpToUsd,
  HIDDEN_GEMS,
  TOP_10_LANDMARKS,
} from '../data/egyptData';
import { TRANSLATIONS, type AirportCode, type LanguageCode } from '../i18n/translations';

export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  provider?: 'gemini' | 'offline';
  model?: string;
  followUps?: string[];
  suggestedPlan?: {
    label: string;
    citySlugs: string[];
    landmarkIds?: string[];
    airportCode?: string;
    nights?: number;
    starTier?: 3 | 4 | 5 | 7;
    travelMode?: 'group' | 'private';
  };
}

/**
 * AI Concierge Adapter Configuration
 * Uses local Vite server middleware (`/api/concierge`) backed by GEMINI_API_KEY in `.env.local`,
 * or an optional external endpoint override via `VITE_AI_API_URL`.
 */
export const AI_CONCIERGE_CONFIG = {
  endpoint: import.meta.env.VITE_AI_API_URL || '/api/concierge',
  apiKey: import.meta.env.VITE_AI_API_KEY || '',
};

export async function streamEgyptAiConcierge(
  prompt: string,
  history: AiChatMessage[],
  lang: LanguageCode = 'en',
  onDelta: (delta: string) => void
): Promise<Omit<AiChatMessage, 'id' | 'role'>> {
  if (AI_CONCIERGE_CONFIG.endpoint) {
    try {
      const res = await fetch(AI_CONCIERGE_CONFIG.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(AI_CONCIERGE_CONFIG.apiKey
            ? { Authorization: `Bearer ${AI_CONCIERGE_CONFIG.apiKey}` }
            : {}),
        },
        body: JSON.stringify({
          message: prompt,
          language: lang,
          stream: true,
          history: history.slice(-8).map((m) => ({ role: m.role, content: m.text })),
          context: {
            currency: 'USD',
            paymentTerms: '25% on arrival, 75% on departure',
          },
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('text/event-stream') && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = '';
        let fullVisible = '';
        let finalMeta: Partial<Omit<AiChatMessage, 'id' | 'role'>> = { provider: 'gemini' };

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });

          const lines = buf.split('\n');
          buf = lines.pop() ?? '';

          for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line.startsWith('data:')) continue;
            const jsonStr = line.slice(5).trim();
            if (!jsonStr) continue;
            try {
              const ev = JSON.parse(jsonStr);
              if (typeof ev.delta === 'string' && ev.delta.length > 0) {
                fullVisible += ev.delta;
                onDelta(ev.delta);
              }
              if (ev.done) {
                finalMeta = {
                  text: typeof ev.reply === 'string' && ev.reply.trim() ? ev.reply.trim() : fullVisible,
                  suggestedPlan: ev.suggestedPlan,
                  followUps: Array.isArray(ev.followUps) ? ev.followUps : undefined,
                  provider: ev.provider || 'gemini',
                  model: ev.model,
                };
              }
            } catch {
              // ignore partial SSE chunk
            }
          }
        }

        return {
          text: finalMeta.text || fullVisible || TRANSLATIONS[lang].aiWelcomeMessage,
          suggestedPlan: finalMeta.suggestedPlan,
          followUps: finalMeta.followUps,
          provider: finalMeta.provider || 'gemini',
          model: finalMeta.model,
        };
      }

      if (res.ok) {
        const data = await res.json();
        const text = data.reply || data.text || data.message || TRANSLATIONS[lang].aiWelcomeMessage;
        onDelta(text);
        return {
          text,
          suggestedPlan: data.suggestedPlan,
          followUps: Array.isArray(data.followUps) ? data.followUps : undefined,
          provider: data.provider || 'gemini',
          model: data.model,
        };
      }
    } catch {
      // Fall back cleanly to offline dataset concierge
    }
  }

  return askEgyptAiConcierge(prompt, history, lang);
}

export async function askEgyptAiConcierge(
  prompt: string,
  history: AiChatMessage[],
  lang: LanguageCode = 'en'
): Promise<Omit<AiChatMessage, 'id' | 'role'>> {
  const t = TRANSLATIONS[lang];

  // 1. Call Gemini API middleware / configured backend endpoint
  if (AI_CONCIERGE_CONFIG.endpoint) {
    try {
      const res = await fetch(AI_CONCIERGE_CONFIG.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(AI_CONCIERGE_CONFIG.apiKey
            ? { Authorization: `Bearer ${AI_CONCIERGE_CONFIG.apiKey}` }
            : {}),
        },
        body: JSON.stringify({
          message: prompt,
          language: lang,
          history: history.slice(-8).map((m) => ({ role: m.role, content: m.text })),
          context: {
            currency: 'USD',
            paymentTerms: '25% on arrival, 75% on departure',
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          text: data.reply || data.text || data.message || t.aiWelcomeMessage,
          suggestedPlan: data.suggestedPlan,
          followUps: Array.isArray(data.followUps) ? data.followUps : undefined,
          provider: data.provider || 'gemini',
          model: data.model,
        };
      }
    } catch {
      // Fall back cleanly to offline dataset concierge if remote fails
    }
  }

  // 2. Smart local dataset concierge (works immediately in all 10 languages while API key is pending)
  const q = prompt.toLowerCase();
  const isArabic = lang === 'ar' || /[\u0600-\u06FF]/.test(prompt);

  if (
    q.includes('ticket') ||
    q.includes('price') ||
    q.includes('cost') ||
    q.includes('تذاكر') ||
    q.includes('سعر') ||
    q.includes('billet') ||
    q.includes('tarif') ||
    q.includes('preço') ||
    q.includes('precios') ||
    q.includes('prezzi') ||
    q.includes('ticketpreis') ||
    q.includes('билет') ||
    q.includes('门票') ||
    q.includes('入場料')
  ) {
    const gem = TOP_10_LANDMARKS.find((l) => l.id === 'grand-egyptian-museum')!;
    const giza = TOP_10_LANDMARKS.find((l) => l.id === 'giza-pyramids')!;
    const kings = TOP_10_LANDMARKS.find((l) => l.id === 'valley-of-kings')!;
    if (isArabic) {
      return {
        text: `أسعار التذاكر الرسمية لعام 2026 للزوار الأجانب (1 دولار ≈ 50 جنيه مصري):\n• أهرامات الجيزة وأبو الهول: ${giza.adultEgp} ج.م (~$${egpToUsd(giza.adultEgp)} USD) · للطلاب $${egpToUsd(giza.studentEgp!)}\n• المتحف المصري الكبير (GEM): ${gem.adultEgp} ج.م (~$${egpToUsd(gem.adultEgp)} USD · حجز إلكتروني مسبق)\n• وادي الملوك (الأقصر): ${kings.adultEgp} ج.م (~$${egpToUsd(kings.adultEgp)} USD)\nمعظم البوابات تقبل الدفع ببطاقات Visa وMastercard فقط.`,
        suggestedPlan: {
          label: `خطط رحلة ${t.cityNames['cairo-giza']} + ${t.cityNames.luxor} بالأسعار الرسمية ←`,
          citySlugs: ['cairo-giza', 'luxor'],
          landmarkIds: ['giza-pyramids', 'grand-egyptian-museum', 'valley-of-kings'],
        },
      };
    }
    const text =
      lang === 'en'
        ? `Here are official 2026 foreign visitor ticket rates (1 USD ≈ 50 EGP):\n• ${giza.name}: ${giza.adultEgp} EGP (~$${egpToUsd(giza.adultEgp)} USD) · Student $${egpToUsd(giza.studentEgp!)}\n• ${gem.name}: ${gem.adultEgp} EGP (~$${egpToUsd(gem.adultEgp)} USD, online booking required)\n• ${kings.name}: ${kings.adultEgp} EGP (~$${egpToUsd(kings.adultEgp)} USD)\nMost gates accept Visa/Mastercard only.`
        : `${t.ticketsSourceNote}\n• ${giza.name}: $${egpToUsd(giza.adultEgp)} USD (${giza.adultEgp} EGP) · ${t.ticketStudentLabel} $${egpToUsd(giza.studentEgp!)}\n• ${gem.name}: $${egpToUsd(gem.adultEgp)} USD (${gem.adultEgp} EGP)\n• ${kings.name}: $${egpToUsd(kings.adultEgp)} USD (${kings.adultEgp} EGP)`;
    return {
      text,
      suggestedPlan: {
        label:
          lang === 'en'
            ? 'Plan Cairo & Luxor with Official Rates →'
            : t.aiSuggestedClassicLabel,
        citySlugs: ['cairo-giza', 'luxor'],
        landmarkIds: ['giza-pyramids', 'grand-egyptian-museum', 'valley-of-kings'],
      },
    };
  }

  if (
    q.includes('siwa') ||
    q.includes('white desert') ||
    q.includes('hidden') ||
    q.includes('fayoum') ||
    q.includes('واحة') ||
    q.includes('مخفي') ||
    q.includes('كنوز') ||
    q.includes('cach') ||
    q.includes('geheim') ||
    q.includes('ocult') ||
    q.includes('nascost') ||
    q.includes('скрыт') ||
    q.includes('秘境') ||
    q.includes('小众') ||
    q.includes('secret')
  ) {
    if (isArabic) {
      return {
        text: `للاستمتاع بالكنوز المصرية المخفية بعيداً عن الزحام، أنصح بالجمع بين **واحة سيوة** (قلعة شالي وبحيرات الملح الكريستالية)، و**الفيوم** (وادي الحيتان المُدرج في اليونسكو وقرية تونس)، و**الصحراء البيضاء** بالفرافرة. نغطي جميع محافظات مصر الـ 27 بسيارات دفع رباعي مجهزة!`,
        suggestedPlan: {
          label: `بناء برنامج ${t.cityNames.fayoum} + ${t.cityNames.siwa} + ${t.cityNames['white-desert']} ←`,
          citySlugs: ['fayoum', 'siwa', 'white-desert'],
          landmarkIds: ['wadi-el-hitan', 'siwa-salt-lakes', 'white-desert-reserve'],
        },
      };
    }
    const text =
      lang === 'en'
        ? `For Egypt’s uncrowded hidden gems, I recommend combining **Siwa Oasis** (Shali Fortress & crystal salt lakes), **Fayoum** (UNESCO Wadi El-Hitan Whale Valley & Tunis Village), and the **White Desert** near Farafra. We cover all 27 Egyptian governorates with private 4x4 escorts!`
        : `${t.tabHiddenGems}: ${t.cityNames.siwa} · ${t.cityNames.fayoum} · ${t.cityNames['white-desert']} (27 Governorates).`;
    return {
      text,
      suggestedPlan: {
        label:
          lang === 'en'
            ? 'Build Siwa + White Desert Hidden Gems Trip →'
            : `${t.cityNames.fayoum} + ${t.cityNames.siwa} + ${t.cityNames['white-desert']} →`,
        citySlugs: ['fayoum', 'siwa', 'white-desert'],
        landmarkIds: ['wadi-el-hitan', 'siwa-salt-lakes', 'white-desert-reserve'],
      },
    };
  }

  if (
    q.includes('hotel') ||
    q.includes('star') ||
    q.includes('stay') ||
    q.includes('فندق') ||
    q.includes('فنادق') ||
    q.includes('نجوم') ||
    q.includes('hôtel') ||
    q.includes('hôtels') ||
    q.includes('hoteles') ||
    q.includes('alberghi') ||
    q.includes('отел') ||
    q.includes('酒店') ||
    q.includes('ホテル') ||
    q.includes('hotéis')
  ) {
    const cairo = EGYPT_CITIES.find((c) => c.slug === 'cairo-giza')!;
    const aswan = EGYPT_CITIES.find((c) => c.slug === 'aswan')!;
    if (isArabic) {
      return {
        text: `نتعاقد مع فنادق معتمدة ونظيفة عبر فئات **3★ و4★ و5★ و7★ الفاخرة**:\n• متوسط فنادق القاهرة والجيزة: ~$${egpToUsd(cairo.avgHotelEgp.star3)} (3★) · ~$${egpToUsd(cairo.avgHotelEgp.star4)} (4★) · ~$${egpToUsd(cairo.avgHotelEgp.star5)}–$85 (5★) وحتى $290/لليلة (7★ سانت ريجيس).\n• أسوان تبدأ من ~$${egpToUsd(aswan.avgHotelEgp.star3)} (3★) وحتى $370/لليلة (7★ أولد كتراكت).\nاختر فئة النجوم المناسبة في المخطط لعرض الشركاء!`,
        suggestedPlan: {
          label: `مقارنة فنادق ${t.cityNames['cairo-giza']} + ${t.cityNames.aswan} ←`,
          citySlugs: ['cairo-giza', 'aswan'],
        },
      };
    }
    const text =
      lang === 'en'
        ? `We partner with vetted hotels across **3★, 4★, 5★, and 7★ Ultra-Luxury** tiers:\n• Cairo & Giza averages ~$${egpToUsd(cairo.avgHotelEgp.star3)} (3★), ~$${egpToUsd(cairo.avgHotelEgp.star4)} (4★), ~$${egpToUsd(cairo.avgHotelEgp.star5)}–$85 (5★), up to $290/night (7★ St. Regis).\n• Aswan ranges ~$${egpToUsd(aswan.avgHotelEgp.star3)} (3★) to $370/night (7★ Old Cataract).\nChoose your preferred star tier inside the planner to see our contracted hotels!`
        : `${t.plannerHotelsHint}\n• ${t.cityNames['cairo-giza']}: ~$${egpToUsd(cairo.avgHotelEgp.star3)} (3★ ${t.plannerTiers.t3}) · ~$${egpToUsd(cairo.avgHotelEgp.star4)} (4★ ${t.plannerTiers.t4}) · ~$${egpToUsd(cairo.avgHotelEgp.star5)} (5★ ${t.plannerTiers.t5}) · $290${t.plannerPerNight} (7★ ${t.plannerTiers.t7})\n• ${t.cityNames.aswan}: ~$${egpToUsd(aswan.avgHotelEgp.star3)} – $370${t.plannerPerNight}`;
    return {
      text,
      suggestedPlan: {
        label:
          lang === 'en'
            ? 'Compare Partner Hotels in Planner →'
            : `${t.cityNames['cairo-giza']} + ${t.cityNames.aswan} →`,
        citySlugs: ['cairo-giza', 'aswan'],
      },
    };
  }

  if (
    q.includes('food') ||
    q.includes('eat') ||
    q.includes('restaurant') ||
    q.includes('أكل') ||
    q.includes('مطعم') ||
    q.includes('gastronom') ||
    q.includes('comida') ||
    q.includes('cibo') ||
    q.includes('küche') ||
    q.includes('кухн') ||
    q.includes('美食') ||
    q.includes('グルメ')
  ) {
    const list = EGYPTIAN_FOODS.slice(0, 4).map((f) => `• ${f.name} (~$${f.estimatedUsd} USD)`).join('\n');
    if (isArabic) {
      return {
        text: `في الخطوة 4 داخل المخطط يمكنك اختيار تجارب الطعام المصري الأصيل في مطاعمنا المعتمدة بأسعار محلية حقيقية:\n${list}`,
        suggestedPlan: {
          label: `خطط جولة طعام وتراث في ${t.cityNames['cairo-giza']} ←`,
          citySlugs: ['cairo-giza'],
          landmarkIds: ['khan-el-khalili', 'citadel-saladin'],
        },
      };
    }
    const text =
      lang === 'en'
        ? `You can choose your Egyptian culinary experiences inside Step 4 of our planner with vetted partner restaurants:\n${list}\nAll meals are priced transparently with zero tourist markups.`
        : `${t.plannerSummaryMeals}:\n${list}`;
    return {
      text,
      suggestedPlan: {
        label:
          lang === 'en'
            ? 'Plan Cairo Food & Heritage Tour →'
            : `${t.cityNames['cairo-giza']} (${t.styleNames.culinary}) →`,
        citySlugs: ['cairo-giza'],
        landmarkIds: ['khan-el-khalili', 'citadel-saladin'],
      },
    };
  }

  if (
    q.includes('pay') ||
    q.includes('dollar') ||
    q.includes('usd') ||
    q.includes('group') ||
    q.includes('دفع') ||
    q.includes('دولار') ||
    q.includes('paiement') ||
    q.includes('zahlung') ||
    q.includes('pago') ||
    q.includes('pagamento') ||
    q.includes('оплат') ||
    q.includes('美元') ||
    q.includes('ドル')
  ) {
    if (isArabic) {
      return {
        text: `قواعد السداد الرسمية لحماية المسافر:\n1. ${t.paymentRule1}\n2. ${t.paymentRule2}\n3. ${t.paymentRule3}\nبعد تقديم الطلب نراجع التوافر وننسق المجموعة إن وُجدت خلال 48 ساعة.`,
        suggestedPlan: {
          label: `${t.heroCta} ←`,
          citySlugs: ['cairo-giza', 'luxor'],
        },
      };
    }
    return {
      text: `1. ${t.paymentRule1}\n2. ${t.paymentRule2}\n3. ${t.paymentRule3}\n\n${t.confirmationNotice}`,
      suggestedPlan: {
        label: lang === 'en' ? 'Start Your Booking Request →' : `${t.heroCta} →`,
        citySlugs: ['cairo-giza', 'luxor'],
      },
    };
  }

  if (
    q.includes('airport') ||
    q.includes('sharm') ||
    q.includes('hurghada') ||
    q.includes('red sea') ||
    q.includes('مطار') ||
    q.includes('شرم')
  ) {
    const airports = EGYPT_AIRPORTS.map((a) => `${a.code} (${t.airportNames[a.code as AirportCode]?.city ?? a.city})`).join(', ');
    if (isArabic) {
      return {
        text: `نستقبلك من لحظة هبوط طائرتك في **${airports}** ونتولى كافة التنقلات حتى رحلة العودة. هل ترغب في إجازة بالبحر الأحمر بين شرم الشيخ ودهب أو الغردقة ومرسى علم؟`,
        suggestedPlan: {
          label: `خطط رحلة ${t.cityNames['sharm-el-sheikh']} + ${t.cityNames.hurghada} ←`,
          citySlugs: ['sharm-el-sheikh', 'hurghada'],
          landmarkIds: ['wadi-el-wishwash', 'wadi-el-gemal'],
        },
      };
    }
    return {
      text: `${airports}\n${t.cityNames['sharm-el-sheikh']} + ${t.cityNames.hurghada}`,
      suggestedPlan: {
        label:
          lang === 'en'
            ? 'Plan Red Sea & Sinai Escape →'
            : `${t.cityNames['sharm-el-sheikh']} + ${t.cityNames.hurghada} →`,
        citySlugs: ['sharm-el-sheikh', 'hurghada'],
        landmarkIds: ['wadi-el-wishwash', 'wadi-el-gemal'],
      },
    };
  }

  if (isArabic) {
    return {
      text: `أستطيع تصميم أي برنامج سياحي متعدد المدن عبر **${EGYPT_CITIES.length} مناطق رئيسية و27 محافظة مصرية** (${HIDDEN_GEMS.length} كنزاً مخفياً وأسعار تذاكر 2026 الرسمية وفنادق 3★–7★).\n\nجرّب سؤالي عن: **أسعار تذاكر 2026**، أو **واحة سيوة والصحراء البيضاء**، أو **فنادق 3★–7★**، أو **الدفع بالدولار**!`,
      suggestedPlan: {
        label: t.aiSuggestedClassicLabel,
        citySlugs: ['cairo-giza', 'luxor', 'aswan'],
        landmarkIds: ['giza-pyramids', 'grand-egyptian-museum', 'valley-of-kings', 'karnak-temple', 'philae-temple'],
      },
    };
  }

  return {
    text:
      lang === 'en'
        ? `I can help you plan any multi-city Egypt itinerary across **${EGYPT_CITIES.length} core regions & 27 governorates** (${HIDDEN_GEMS.length} curated hidden gems, official 2026 ticket prices, and 3★–7★ partner hotels).\n\nTry asking about **2026 ticket prices**, **Siwa & White Desert**, **Egyptian food**, **3★–7★ hotels**, or **USD payment rules**!`
        : `${t.aiWelcomeMessage}\n\n• ${t.paymentRule1}\n• ${t.paymentRule2}\n• ${t.paymentRule3}`,
    suggestedPlan: {
      label: t.aiSuggestedClassicLabel,
      citySlugs: ['cairo-giza', 'luxor', 'aswan'],
      landmarkIds: ['giza-pyramids', 'grand-egyptian-museum', 'valley-of-kings', 'karnak-temple', 'philae-temple'],
    },
  };
}
