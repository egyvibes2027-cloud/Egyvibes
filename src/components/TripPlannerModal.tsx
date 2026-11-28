import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Car,
  Check,
  ChevronDown,
  Compass,
  Copy,
  Crown,
  Minus,
  Palmtree,
  Plane,
  Plus,
  Send,
  SlidersHorizontal,
  Star,
  Sun,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import {
  BANK_TRANSFER_PLACEHOLDER,
  EGYPT_AIRPORTS,
  EGYPT_CITIES,
  EGYPTIAN_FOODS,
  egpToUsd,
  HIDDEN_GEMS,
  MOMENTS_AVATARS,
  PARTNER_HOTELS,
  TOP_10_LANDMARKS,
} from '../data/egyptData';
import { useLanguage } from '../context/LanguageContext';
import { localizeCityName, type AirportCode, type LanguageCode } from '../i18n/translations';
import { streamEgyptAiConcierge, type AiChatMessage } from '../services/aiConcierge';
import { AiStarIcon, NileWayLogo } from './Icons';

interface TripPlannerModalProps {
  initialMode?: 'manual' | 'ai';
  initialAiPrompt?: string;
  initialCities?: string[];
  initialLandmarks?: string[];
  initialStarredIds?: string[];
  onToggleStarGlobal?: (id: string) => void;
  onClose: () => void;
}

const TOTAL_STEPS = 7; // Steps 0..6 + Confirmation screen

function renderFormattedText(text: string): React.ReactNode {
  const renderInline = (lineText: string) => {
    const parts = lineText.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return <strong key={pIdx}>{part.slice(1, -1)}</strong>;
      }
      return <React.Fragment key={pIdx}>{part}</React.Fragment>;
    });
  };

  return text.split('\n').map((rawLine, lineIdx) => {
    const trimmed = rawLine.trim();
    if (/^-{3,}$/.test(trimmed)) {
      return (
        <hr
          key={lineIdx}
          style={{
            border: 'none',
            borderTop: '1px solid var(--color-outline-variant)',
            margin: '8px 0',
          }}
        />
      );
    }
    const headingMatch = trimmed.match(/^#{1,4}\s+(.+)$/);
    if (headingMatch) {
      return (
        <div key={lineIdx} style={{ fontWeight: 700, color: 'var(--color-primary)', marginTop: lineIdx > 0 ? 8 : 0, marginBottom: 2 }}>
          {renderInline(headingMatch[1])}
        </div>
      );
    }
    const bulletMatch = trimmed.match(/^(?:[-*•])\s+(.+)$/);
    if (bulletMatch) {
      return (
        <div key={lineIdx} style={{ paddingInlineStart: 12, textIndent: -10 }}>
          {'• '}
          {renderInline(bulletMatch[1])}
        </div>
      );
    }
    return (
      <React.Fragment key={lineIdx}>
        {lineIdx > 0 && <br />}
        {renderInline(rawLine)}
      </React.Fragment>
    );
  });
}

interface StarterCard {
  id: string;
  title: string;
  subtitle: string;
  prompt: string;
  icon: 'pharaoh' | 'oasis' | 'sea' | 'royal';
}

function getStarterCards(lang: LanguageCode, t: ReturnType<typeof useLanguage>['t']): StarterCard[] {
  if (lang === 'ar') {
    return [
      {
        id: 'pharaohs',
        icon: 'pharaoh',
        title: 'الكلاسيكيات الخالدة',
        subtitle: 'الأهرامات، المتحف الكبير، والأقصر وأسوان',
        prompt: 'خطط لي رحلة 6 ليالٍ كلاسيكية بين القاهرة والأقصر وأسوان تشمل أهرامات الجيزة والمتحف الكبير ومعبد الكرنك مع التفاصيل بالدولار',
      },
      {
        id: 'oases',
        icon: 'oasis',
        title: 'أسرار سيوة والصحراء البيضاء',
        subtitle: 'بحيرات الملح، سفاري وتخييم تحت النجوم',
        prompt: 'عايز برنامج 4 ليالٍ للكنوز المخفية في واحة سيوة والصحراء البيضاء والفيوم بعيداً عن الزحام بالسعر بالدولار',
      },
      {
        id: 'sea',
        icon: 'sea',
        title: 'البحر الأحمر ودهب',
        subtitle: 'شعاب مرجانية، وادي الوشواش وغروب سيناء',
        prompt: 'رشح لي رحلة 5 ليالٍ في شرم الشيخ ودهب والغردقة للغوص والاسترخاء بفندق 4 أو 5 نجوم بالدولار',
      },
      {
        id: 'royal',
        icon: 'royal',
        title: 'تجربة مصر الملكية 7★',
        subtitle: 'سانت ريجيس، أولد كتراكت ومرشد خاص',
        prompt: 'صمم لي برنامج VIP ملكي 7 نجوم لمدة 7 ليالٍ بين القاهرة والأقصر وأسوان بسيارة خاصة ومرشد أثري مرخص',
      },
    ];
  }

  return [
    {
      id: 'pharaohs',
      icon: 'pharaoh',
      title: `${t.cityNames['cairo-giza']} & ${t.cityNames.luxor}`,
      subtitle: 'Pyramids, GEM Museum & Nile temples',
      prompt: 'Plan a 6-night classic Egypt route covering Cairo & Giza, Luxor, and Aswan with official 2026 USD breakdown.',
    },
    {
      id: 'oases',
      icon: 'oasis',
      title: `${t.cityNames.siwa} & ${t.cityNames['white-desert']}`,
      subtitle: 'Salt lakes, dunes & Sahara stargazing',
      prompt: 'Create a 4-night uncrowded hidden gems trip to Siwa Oasis, Wadi El-Hitan Fayoum, and White Desert in USD.',
    },
    {
      id: 'sea',
      icon: 'sea',
      title: `${t.cityNames['sharm-el-sheikh']} & ${t.cityNames.hurghada}`,
      subtitle: 'Coral reefs, Dahab canyons & beaches',
      prompt: 'Design a 5-night Red Sea escape in Sharm El Sheikh, Dahab, and Hurghada with airport pickup and transparent USD pricing.',
    },
    {
      id: 'royal',
      icon: 'royal',
      title: t.plannerTiers.t7,
      subtitle: 'Old Cataract, St. Regis & private Egyptologist',
      prompt: 'Curate a 7-night ultra-luxury 7-star Egypt itinerary in Cairo, Luxor, and Aswan with private car and licensed Egyptologist.',
    },
  ];
}

export const TripPlannerModal: React.FC<TripPlannerModalProps> = ({
  initialMode = 'manual',
  initialAiPrompt,
  initialCities = ['cairo-giza'],
  initialLandmarks = ['giza-pyramids', 'grand-egyptian-museum'],
  initialStarredIds = [],
  onToggleStarGlobal,
  onClose,
}) => {
  const { lang, t } = useLanguage();
  const [panelMode, setPanelMode] = useState<'manual' | 'ai'>(initialMode);
  const [step, setStep] = useState(0);

  // Embedded AI Concierge State
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [aiMessages, setAiMessages] = useState<AiChatMessage[]>([]);
  const starterCards = useMemo(() => getStarterCards(lang, t), [lang, t]);

  const aiScrollRef = useRef<HTMLDivElement>(null);
  const aiInputRef = useRef<HTMLInputElement>(null);
  const sentInitialPromptRef = useRef<string | undefined>(undefined);

  // Step 0: Arrival Airport & Multi-City Selection
  const [airportCode, setAirportCode] = useState('CAI');
  const [airportMenuOpen, setAirportMenuOpen] = useState(false);
  const airportMenuRef = useRef<HTMLDivElement>(null);
  const [selectedCities, setSelectedCities] = useState<string[]>(
    initialCities.length > 0 ? initialCities : ['cairo-giza']
  );

  // Step 1: Arrival Date, Nights & Travelers
  const [arrivalDate, setArrivalDate] = useState('2026-12-15');
  const [nights, setNights] = useState(7);
  const [adults, setAdults] = useState(2);
  const [students, setStudents] = useState(0);
  const [children, setChildren] = useState(0);
  const [toddlers, setToddlers] = useState(0);

  // Step 2: Landmarks, Hidden Gems & Starred Priorities
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>(initialLandmarks);
  const [starredIds, setStarredIds] = useState<string[]>(initialStarredIds);
  const [showAllEgyptPlaces, setShowAllEgyptPlaces] = useState(false);

  // Step 3: Authentic Egyptian Foods
  const [selectedFoods, setSelectedFoods] = useState<string[]>(['koshary', 'molokhia-pigeon', 'tea-sweets']);

  // Step 4: Hotel Star Tier (3★, 4★, 5★, 7★) & Partner Hotels
  const [starTier, setStarTier] = useState<3 | 4 | 5 | 7>(5);
  const [selectedHotelIds, setSelectedHotelIds] = useState<string[]>(['cai-5', 'lxr-5']);

  // Step 5: Group vs Solo, Licensed Guide, Private Car
  const [travelMode, setTravelMode] = useState<'group' | 'private'>('private');
  const [wantGuide, setWantGuide] = useState<boolean>(true);
  const [wantCar, setWantCar] = useState<boolean>(true);

  // Step 6: Contact Details & Final Confirmation
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [nationality, setNationality] = useState('');
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [bookingRef] = useState(() => `EV-${Math.floor(100000 + Math.random() * 900000)}`);
  const [copiedIban, setCopiedIban] = useState(false);

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (airportMenuRef.current && !airportMenuRef.current.contains(e.target as Node)) {
        setAirportMenuOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAirportMenuOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  useEffect(() => {
    if (aiScrollRef.current && panelMode === 'ai') {
      aiScrollRef.current.scrollTop = aiScrollRef.current.scrollHeight;
    }
  }, [aiMessages, streamingText, aiLoading, panelMode]);

  useEffect(() => {
    if (panelMode === 'ai') {
      setTimeout(() => aiInputRef.current?.focus(), 60);
    }
  }, [panelMode]);

  const handleAiSend = async (textOverride?: string) => {
    const q = (textOverride ?? aiInput).trim();
    if (!q || aiLoading) return;
    const userMsg: AiChatMessage = { id: `u-${Date.now()}`, role: 'user', text: q };
    const nextHistory = [...aiMessages, userMsg];
    setAiMessages(nextHistory);
    if (!textOverride) setAiInput('');
    setStreamingText('');
    setAiLoading(true);
    const reply = await streamEgyptAiConcierge(q, nextHistory, lang, (chunk) => {
      setStreamingText((prev) => prev + chunk);
    });
    setStreamingText('');
    setAiMessages((prev) => [
      ...prev,
      {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: reply.text,
        suggestedPlan: reply.suggestedPlan,
        followUps: reply.followUps,
        provider: reply.provider ?? 'offline',
        model: reply.model,
      },
    ]);
    setAiLoading(false);
  };

  useEffect(() => {
    const clean = initialAiPrompt?.trim();
    if (clean && sentInitialPromptRef.current !== clean) {
      sentInitialPromptRef.current = clean;
      handleAiSend(clean);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAiPrompt]);

  const selectedAirport = useMemo(
    () => EGYPT_AIRPORTS.find((a) => a.code === airportCode) ?? EGYPT_AIRPORTS[0],
    [airportCode]
  );

  const allPlaces = useMemo(() => [...TOP_10_LANDMARKS, ...HIDDEN_GEMS], []);

  const visiblePlaces = useMemo(() => {
    if (showAllEgyptPlaces) return allPlaces;
    const filtered = allPlaces.filter((p) => selectedCities.includes(p.citySlug));
    return filtered.length > 0 ? filtered : allPlaces;
  }, [allPlaces, selectedCities, showAllEgyptPlaces]);

  const matchingHotels = useMemo(() => {
    const byCityAndStars = PARTNER_HOTELS.filter(
      (h) => selectedCities.includes(h.citySlug) && h.stars === starTier
    );
    if (byCityAndStars.length > 0) return byCityAndStars;
    const byCity = PARTNER_HOTELS.filter((h) => selectedCities.includes(h.citySlug));
    return byCity.length > 0 ? byCity : PARTNER_HOTELS.filter((h) => h.stars === starTier);
  }, [selectedCities, starTier]);

  // Transparent USD Calculation
  const pricing = useMemo(() => {
    const payingAdults = adults;
    const payingStudents = students;
    const payingChildren = children;
    const rooms = Math.max(1, Math.ceil((adults + students + children) / 2));

    // Tickets USD
    const ticketsUsd = selectedPlaces.reduce((sum, id) => {
      const p = allPlaces.find((x) => x.id === id);
      if (!p) return sum;
      const adultUsd = egpToUsd(p.adultEgp);
      const studentUsd = p.studentEgp !== null ? egpToUsd(p.studentEgp) : Math.round(adultUsd * 0.5);
      return sum + payingAdults * adultUsd + (payingStudents + payingChildren) * studentUsd;
    }, 0);

    // Partner Hotels USD (average of chosen hotels or benchmark for chosen cities + starTier)
    const chosenHotels = PARTNER_HOTELS.filter((h) => selectedHotelIds.includes(h.id));
    const avgNightUsd =
      chosenHotels.length > 0
        ? Math.round(chosenHotels.reduce((s, h) => s + h.pricePerNightUsd, 0) / chosenHotels.length)
        : starTier === 3
        ? 42
        : starTier === 4
        ? 85
        : starTier === 5
        ? 118
        : 325;
    const hotelsUsd = avgNightUsd * nights * rooms;

    // Dining USD
    const guestCount = Math.max(1, adults + students + children);
    const foodsUsd = selectedFoods.reduce((sum, id) => {
      const f = EGYPTIAN_FOODS.find((x) => x.id === id);
      return sum + (f ? f.estimatedUsd * guestCount : 0);
    }, 0);

    // Logistics: Airport pickup included + Guide ($45/day or $20/day group) + Private Car ($55/day or $25/day group)
    const guideDaily = wantGuide ? (travelMode === 'group' ? 20 : 45) : 0;
    const carDaily = wantCar ? (travelMode === 'group' ? 25 : 55) : 12; // $12/day covers airport round-trip allocation
    const logisticsUsd = (guideDaily + carDaily) * nights;

    const subtotal = ticketsUsd + hotelsUsd + foodsUsd + logisticsUsd;
    const groupSavings = travelMode === 'group' ? Math.round(subtotal * 0.12) : 0;
    const totalUsd = Math.max(150, subtotal - groupSavings);
    const arrival25Usd = Math.round(totalUsd * 0.25);
    const departure75Usd = totalUsd - arrival25Usd;

    return {
      ticketsUsd,
      hotelsUsd,
      foodsUsd,
      logisticsUsd,
      groupSavings,
      totalUsd,
      arrival25Usd,
      departure75Usd,
      rooms,
      avgNightUsd,
    };
  }, [
    adults,
    students,
    children,
    selectedPlaces,
    allPlaces,
    selectedHotelIds,
    starTier,
    nights,
    selectedFoods,
    wantGuide,
    wantCar,
    travelMode,
  ]);

  const heroVisual = useMemo(() => {
    const firstCity = EGYPT_CITIES.find((c) => c.slug === selectedCities[0]);
    return firstCity?.imageUrl ?? '/assets/egypt/giza-pyramids.jpg';
  }, [selectedCities]);

  const toggleCity = (slug: string) => {
    setSelectedCities((prev) => {
      if (prev.includes(slug)) {
        return prev.length > 1 ? prev.filter((c) => c !== slug) : prev;
      }
      return [...prev, slug];
    });
  };

  const togglePlace = (id: string) => {
    setSelectedPlaces((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleStar = (id: string) => {
    setStarredIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    if (onToggleStarGlobal) onToggleStarGlobal(id);
  };

  const toggleFood = (id: string) => {
    setSelectedFoods((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleHotel = (id: string) => {
    setSelectedHotelIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    } else {
      setConfirmed(true);
    }
  };

  const copyIban = async () => {
    try {
      await navigator.clipboard.writeText(BANK_TRANSFER_PLACEHOLDER.iban);
    } catch {
      /* ignore */
    }
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2000);
  };

  const progressPct = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <div className="funnel-overlay" role="dialog" aria-modal="true" aria-label="Egypt Trip Planner">
      {/* Top Bar */}
      <div className="bf-bar">
        <div className="bf-bar-inner">
          <span>{t.topBannerPrefix}</span>
          <strong>{t.topBannerLink}</strong>
        </div>
      </div>

      <div className="funnel-body">
        {/* Left Clear Photo Visual + Live Transparent USD Estimate Card */}
        <div className="funnel-left-visual">
          <img
            src={heroVisual}
            alt="Selected Egypt route"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 170,
              background: 'linear-gradient(to top, rgba(27, 28, 23, 0.38) 0%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Compact Translucent Frost Corner Price Card */}
          <div
            style={{
              position: 'absolute',
              bottom: 20,
              insetInlineStart: 20,
              maxWidth: 340,
              width: 'calc(100% - 40px)',
              background: 'rgba(24, 21, 17, 0.76)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              color: '#ffffff',
              borderRadius: 16,
              padding: '14px 18px',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              boxShadow: '0 8px 28px rgba(0, 0, 0, 0.28)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div className="tl-label-sm" style={{ color: '#e6c17a', letterSpacing: '0.4px' }}>
                {t.plannerLiveEstimate}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                <div className="tl-title-lg" style={{ color: '#ffffff', fontSize: 22 }}>
                  <bdi dir="ltr">${pricing.totalUsd.toLocaleString()} USD</bdi>
                </div>
                <div style={{ textAlign: 'end', fontSize: 11.5, lineHeight: '16px', color: 'rgba(255, 255, 255, 0.85)' }}>
                  <div>
                    {t.plannerArrivalShort}: <strong style={{ color: '#fff' }}><bdi dir="ltr">${pricing.arrival25Usd.toLocaleString()}</bdi></strong>
                  </div>
                  <div>
                    {t.plannerExitShort}: <strong style={{ color: '#fff' }}><bdi dir="ltr">${pricing.departure75Usd.toLocaleString()}</bdi></strong>
                  </div>
                </div>
              </div>
              <div
                className="tl-body-sm"
                style={{
                  color: 'rgba(255, 255, 255, 0.78)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.14)',
                  paddingTop: 6,
                }}
              >
                <bdi dir="ltr">{selectedCities.length}</bdi>{' '}
                {selectedCities.length === 1 ? t.plannerCitySingular : t.plannerCityPlural} ·{' '}
                <bdi dir="ltr">{nights}</bdi> {t.plannerNightsUnit} ·{' '}
                <bdi dir="ltr">{selectedPlaces.length}</bdi> {t.plannerSitesUnit} ·{' '}
                <bdi dir="ltr">{starTier}★</bdi> {t.plannerStayUnit} (
                {travelMode === 'group' ? t.plannerGroupShort : t.plannerPrivateShort})
              </div>
            </div>
          </div>
        </div>

        {/* Right Interactive Wizard Card */}
        <div className="funnel-right-card">
          <div
            style={{
              padding: '16px 24px',
              borderBottom: '1px solid var(--color-outline-variant)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <span style={{ color: 'var(--color-primary)', display: 'inline-flex' }}>
              <NileWayLogo />
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="planner-mode-switch" role="tablist" aria-label="Planner mode">
                <button
                  type="button"
                  role="tab"
                  aria-selected={panelMode === 'ai'}
                  className={`planner-mode-tab ${panelMode === 'ai' ? 'active' : ''}`}
                  onClick={() => setPanelMode('ai')}
                >
                  <AiStarIcon size={14} />
                  <span>{t.plannerAskAi}</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={panelMode === 'manual'}
                  className={`planner-mode-tab ${panelMode === 'manual' ? 'active' : ''}`}
                  onClick={() => setPanelMode('manual')}
                >
                  <SlidersHorizontal size={14} />
                  <span>{t.plannerManualMode}</span>
                </button>
              </div>
              <button
                type="button"
                aria-label={t.modalClose}
                onClick={onClose}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--color-outline-variant)',
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {panelMode === 'ai' ? (
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <div
                ref={aiScrollRef}
                style={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: 'auto',
                  padding: '20px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                {aiMessages.length === 0 && !aiLoading && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 4 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--color-primary)' }}>
                        <span
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: '50%',
                            background: 'var(--color-secondary-container)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <AiStarIcon size={16} />
                        </span>
                        <span className="tl-title-md">{t.aiConciergeBtn}</span>
                      </div>
                      <p className="tl-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
                        {t.aiWelcomeMessage}
                      </p>
                    </div>

                    <div className="ai-starter-grid">
                      {starterCards.map((card) => (
                        <button
                          key={card.id}
                          type="button"
                          className="ai-starter-card"
                          onClick={() => handleAiSend(card.prompt)}
                        >
                          <span className="ai-starter-icon">
                            {card.icon === 'pharaoh' && <Compass size={16} />}
                            {card.icon === 'oasis' && <Sun size={16} />}
                            {card.icon === 'sea' && <Palmtree size={16} />}
                            {card.icon === 'royal' && <Crown size={16} />}
                          </span>
                          <div>
                            <div className="tl-title-sm">{card.title}</div>
                            <div
                              className="tl-body-sm"
                              style={{ color: 'var(--color-on-surface-variant)', marginTop: 2 }}
                            >
                              {card.subtitle}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {aiMessages.map((msg, idx) => {
                  const isLastAssistant =
                    msg.role === 'assistant' && idx === aiMessages.length - 1 && !aiLoading;
                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <div className={`ai-msg-bubble ${msg.role}`} dir="auto">
                        <div>{renderFormattedText(msg.text)}</div>
                        {msg.suggestedPlan && (
                          <button
                            type="button"
                            className="tl-btn-primary"
                            style={{ marginTop: 10, height: 36, padding: '0 16px', fontSize: 13 }}
                            onClick={() => {
                              const plan = msg.suggestedPlan!;
                              const nextCities = plan.citySlugs.length > 0 ? plan.citySlugs : selectedCities;
                              if (plan.citySlugs.length > 0) {
                                setSelectedCities(nextCities);
                              }
                              if (plan.landmarkIds && plan.landmarkIds.length > 0) {
                                setSelectedPlaces(plan.landmarkIds);
                              }
                              if (plan.airportCode) {
                                setAirportCode(plan.airportCode);
                              }
                              if (typeof plan.nights === 'number') {
                                setNights(Math.max(2, Math.min(25, Math.round(plan.nights))));
                              }
                              if (plan.starTier) {
                                setStarTier(plan.starTier);
                                const autoHotels = PARTNER_HOTELS.filter(
                                  (h) => nextCities.includes(h.citySlug) && h.stars === plan.starTier
                                ).map((h) => h.id);
                                if (autoHotels.length > 0) {
                                  setSelectedHotelIds(autoHotels);
                                }
                              }
                              if (plan.travelMode) {
                                setTravelMode(plan.travelMode);
                              }
                              setConfirmed(false);
                              setStep(0);
                              setPanelMode('manual');
                            }}
                          >
                            {msg.suggestedPlan.label}
                          </button>
                        )}
                      </div>
                      {isLastAssistant && msg.followUps && msg.followUps.length > 0 && (
                        <div className="ai-followup-row">
                          {msg.followUps.map((qText) => (
                            <button
                              key={qText}
                              type="button"
                              className="ai-followup-chip"
                              onClick={() => handleAiSend(qText)}
                            >
                              {qText}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {aiLoading && (
                  <div className="ai-msg-bubble assistant" dir="auto">
                    {streamingText ? (
                      <div>{renderFormattedText(streamingText)}</div>
                    ) : (
                      <div className="ai-typing-dots" aria-label={t.aiThinking}>
                        <span />
                        <span />
                        <span />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAiSend();
                }}
                style={{
                  padding: '12px 24px 16px',
                  borderTop: '1px solid var(--color-outline-variant)',
                  display: 'flex',
                  gap: 10,
                  background: '#ffffff',
                }}
              >
                <input
                  ref={aiInputRef}
                  type="text"
                  className="funnel-input"
                  placeholder={t.aiInputPlaceholder}
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  style={{ flex: 1, borderRadius: 9999, padding: '0 18px', height: 44 }}
                />
                <button
                  type="submit"
                  className="tl-btn-primary"
                  aria-label={t.aiConciergeBtn}
                  disabled={aiLoading || !aiInput.trim()}
                  style={{ width: 44, height: 44, padding: 0, flexShrink: 0 }}
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          ) : (
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px 16px', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
            {confirmed ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'var(--color-secondary-container)',
                      color: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Check size={26} />
                  </div>
                  <div>
                    <span className="tl-label-sm" style={{ color: 'var(--color-primary)' }}>
                      {t.confirmationRefLabel} <bdi dir="ltr">{bookingRef}</bdi>
                    </span>
                    <h2 className="tl-display-sm" style={{ fontSize: 28, lineHeight: '34px' }}>
                      {t.confirmationTitle}
                    </h2>
                  </div>
                </div>

                <p className="tl-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
                  {t.confirmationNotice}
                </p>

                {/* 3 Explicit Payment Terms */}
                <div
                  style={{
                    background: 'var(--color-surface-container-low)',
                    border: '1px solid var(--color-outline-variant)',
                    borderRadius: 14,
                    padding: '16px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <div className="tl-title-sm" style={{ color: 'var(--color-primary)' }}>
                    {t.confirmationScheduleTitle} <bdi dir="ltr">${pricing.totalUsd.toLocaleString()} USD</bdi>
                  </div>
                  <ol style={{ listStyle: 'decimal', paddingInlineStart: 20, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14 }}>
                    <li><strong>{t.paymentRule1}</strong></li>
                    <li><strong>{t.paymentRule2}</strong> <bdi dir="ltr">(${pricing.arrival25Usd.toLocaleString()} USD)</bdi></li>
                    <li><strong>{t.paymentRule3}</strong> <bdi dir="ltr">(${pricing.departure75Usd.toLocaleString()} USD)</bdi></li>
                  </ol>
                </div>

                {/* USD Bank Transfer Placeholder */}
                <div
                  style={{
                    padding: '14px 16px',
                    borderRadius: 14,
                    border: '1px dashed var(--color-primary)',
                    background: 'var(--color-surface-container)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div className="tl-label-sm" style={{ color: 'var(--color-primary)' }}>
                    {t.confirmationBankTitle}
                  </div>
                  <div className="tl-body-sm">
                    <strong>{t.confirmationBankLabel}</strong> {BANK_TRANSFER_PLACEHOLDER.bankName}
                  </div>
                  <div className="tl-body-sm">
                    <strong>{t.confirmationAccountLabel}</strong> {BANK_TRANSFER_PLACEHOLDER.accountName} · <strong>SWIFT:</strong> <bdi dir="ltr">{BANK_TRANSFER_PLACEHOLDER.swiftCode}</bdi>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 4 }}>
                    <code style={{ fontSize: 13, fontWeight: 600 }}><bdi dir="ltr">{BANK_TRANSFER_PLACEHOLDER.iban}</bdi></code>
                    <button type="button" className="tl-btn-outline" style={{ height: 32, padding: '0 12px', fontSize: 12 }} onClick={copyIban}>
                      {copiedIban ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedIban ? t.confirmationCopied : t.confirmationCopyIban}</span>
                    </button>
                  </div>
                </div>

                <div className="tl-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                  {t.confirmationFollowup
                    .replace('{name}', fullName || '—')
                    .replace('{phone}', whatsapp || '—')
                    .replace('{email}', email || '—')}
                </div>

                <button type="button" className="tl-btn-primary" onClick={onClose} style={{ width: '100%' }}>
                  {t.plannerReturnHome}
                </button>
              </div>
            ) : (
              <>
                <div style={{ textAlign: 'center' }}>
                  <div className="tl-label-sm" style={{ color: 'var(--color-primary)' }}>
                    {t.plannerStepLabel
                      .replace('{step}', String(step + 1))
                      .replace('{total}', String(TOTAL_STEPS))}{' '}
                    · {t.plannerEstLabel}: <bdi dir="ltr">${pricing.totalUsd.toLocaleString()} USD</bdi>
                  </div>
                  <h2 className="tl-display-sm" style={{ marginTop: 4 }}>
                    {t.plannerStepTitles[step]}
                  </h2>
                </div>

                {/* STEP 0: Custom White Airport Dropdown & Full-Grid Cities */}
                {step === 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label className="tl-title-sm" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <Plane size={16} />
                        <span>{t.plannerAirportLabel}</span>
                      </label>
                      <div className="custom-select-wrap" ref={airportMenuRef}>
                        <button
                          type="button"
                          className="custom-select-trigger"
                          aria-expanded={airportMenuOpen}
                          aria-haspopup="listbox"
                          onClick={() => setAirportMenuOpen((o) => !o)}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                            <span
                              style={{
                                padding: '2px 8px',
                                borderRadius: 6,
                                background: 'var(--color-secondary-container)',
                                color: 'var(--color-primary)',
                                fontWeight: 600,
                                fontSize: 12,
                              }}
                            >
                              {selectedAirport.code}
                            </span>
                            <span style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {t.airportNames[selectedAirport.code as AirportCode]?.name ?? selectedAirport.name}
                            </span>
                          </span>
                          <ChevronDown size={16} style={{ flexShrink: 0, color: 'var(--color-on-surface-variant)' }} />
                        </button>

                        {airportMenuOpen && (
                          <div className="custom-select-menu" role="listbox" aria-label={t.plannerAirportLabel}>
                            {EGYPT_AIRPORTS.map((ap) => {
                              const active = ap.code === airportCode;
                              const apLoc = t.airportNames[ap.code as AirportCode];
                              return (
                                <button
                                  key={ap.code}
                                  type="button"
                                  role="option"
                                  aria-selected={active}
                                  className={`custom-select-option ${active ? 'active' : ''}`}
                                  onClick={() => {
                                    setAirportCode(ap.code);
                                    setAirportMenuOpen(false);
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span
                                      style={{
                                        padding: '2px 8px',
                                        borderRadius: 6,
                                        background: active ? 'var(--color-primary)' : 'var(--color-surface-container)',
                                        color: active ? '#fff' : 'var(--color-primary)',
                                        fontWeight: 600,
                                        fontSize: 12,
                                      }}
                                    >
                                      {ap.code}
                                    </span>
                                    <div>
                                      <div className="tl-title-sm">{apLoc?.name ?? ap.name}</div>
                                      <div className="tl-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                                        {apLoc?.city ?? ap.city}
                                      </div>
                                    </div>
                                  </div>
                                  {active && <Check size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="tl-title-sm" style={{ marginBottom: 8 }}>
                        {t.plannerCitiesPrompt} (<bdi dir="ltr">{selectedCities.length}</bdi> {t.plannerSelectedLabel})
                      </div>
                      <div className="funnel-city-grid">
                        {EGYPT_CITIES.map((city) => {
                          const active = selectedCities.includes(city.slug);
                          const localizedCity = localizeCityName(city.slug, city.name, t);
                          return (
                            <button
                              key={city.slug}
                              type="button"
                              className={`funnel-select-card ${active ? 'selected' : ''}`}
                              style={{ padding: 0, overflow: 'hidden' }}
                              onClick={() => toggleCity(city.slug)}
                            >
                              <img
                                src={city.imageUrl}
                                alt={localizedCity}
                                style={{ width: '100%', height: 84, objectFit: 'cover', display: 'block', flexShrink: 0 }}
                              />
                              <div style={{ padding: '10px 12px', width: '100%' }}>
                                <div className="tl-title-sm">{localizedCity}</div>
                                <div className="tl-body-sm" style={{ color: 'var(--color-on-surface-variant)', marginTop: 2 }}>
                                  {active ? t.plannerCityIncluded : t.plannerCityAdd}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 1: Dates, Nights, Travelers */}
                {step === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <label className="tl-title-sm" style={{ display: 'block', marginBottom: 6 }}>
                          {t.plannerArrivalDateLabel}
                        </label>
                        <input
                          type="date"
                          className="funnel-input"
                          value={arrivalDate}
                          onChange={(e) => setArrivalDate(e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="funnel-stepper-box" style={{ padding: '4px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div className="tl-title-sm">{t.plannerNightsLabel}</div>
                          <div className="tl-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                            <bdi dir="ltr">{nights}</bdi> {t.plannerNightsUnit}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <button type="button" className="funnel-circle-btn" style={{ width: 30, height: 30 }} onClick={() => setNights((n) => Math.max(2, n - 1))}>
                            <Minus size={14} />
                          </button>
                          <button type="button" className="funnel-circle-btn" style={{ width: 30, height: 30 }} onClick={() => setNights((n) => Math.min(25, n + 1))}>
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="funnel-stepper-box">
                      {[
                        { label: t.plannerAdults, sub: t.plannerAdultsSub, value: adults, set: setAdults, min: 1 },
                        { label: t.plannerStudents, sub: t.plannerStudentsSub, value: students, set: setStudents, min: 0 },
                        { label: t.plannerChildren, sub: t.plannerChildrenSub, value: children, set: setChildren, min: 0 },
                        { label: t.plannerToddlers, sub: t.plannerToddlersSub, value: toddlers, set: setToddlers, min: 0 },
                      ].map((row, idx) => (
                        <div
                          key={row.label}
                          className="funnel-stepper-row"
                          style={{ borderTop: idx > 0 ? '1px solid var(--color-outline-variant)' : 'none', padding: '10px 0' }}
                        >
                          <div>
                            <div className="tl-title-sm">{row.label}</div>
                            <div className="tl-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{row.sub}</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <button
                              type="button"
                              className="funnel-circle-btn"
                              disabled={row.value <= row.min}
                              onClick={() => row.set(Math.max(row.min, row.value - 1))}
                            >
                              <Minus size={15} />
                            </button>
                            <span style={{ minWidth: 18, textAlign: 'center', fontWeight: 500 }}>
                              <bdi dir="ltr">{row.value}</bdi>
                            </span>
                            <button type="button" className="funnel-circle-btn" onClick={() => row.set(row.value + 1)}>
                              <Plus size={15} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: Landmarks + Star Toggle */}
                {step === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                      <span className="tl-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                        {t.plannerPlacesHint} (<bdi dir="ltr">{selectedPlaces.length}</bdi> {t.plannerSelectedLabel})
                      </span>
                      <button
                        type="button"
                        className="tl-label-sm"
                        style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}
                        onClick={() => setShowAllEgyptPlaces((p) => !p)}
                      >
                        {showAllEgyptPlaces ? t.plannerFilterMyCities : t.plannerShowAllSites}
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
                      {visiblePlaces.map((place) => {
                        const checked = selectedPlaces.includes(place.id);
                        const starred = starredIds.includes(place.id);
                        const localizedCity = localizeCityName(place.citySlug, place.city, t);
                        return (
                          <div
                            key={place.id}
                            className={`funnel-select-card ${checked ? 'selected' : ''}`}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10 }}
                            onClick={() => togglePlace(place.id)}
                          >
                            <img src={place.imageUrl} alt={place.name} style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div className="tl-title-sm" dir="auto">{place.name}</div>
                              <div className="tl-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                                {localizedCity} ·{' '}
                                {place.adultEgp === 0 ? (
                                  t.plannerFreeLabel
                                ) : (
                                  <bdi dir="ltr">${egpToUsd(place.adultEgp)} ({place.adultEgp} EGP)</bdi>
                                )}
                              </div>
                            </div>
                            <button
                              type="button"
                              className={`star-fav-btn ${starred ? 'starred' : ''}`}
                              aria-label={`Star ${place.name}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStar(place.id);
                              }}
                            >
                              <Star size={15} fill={starred ? 'currentColor' : 'none'} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 3: Egyptian Food */}
                {step === 3 && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
                    {EGYPTIAN_FOODS.map((food) => {
                      const active = selectedFoods.includes(food.id);
                      return (
                        <button
                          key={food.id}
                          type="button"
                          className={`funnel-select-card ${active ? 'selected' : ''}`}
                          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10 }}
                          onClick={() => toggleFood(food.id)}
                        >
                          <img src={food.imageUrl} alt={food.name} style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="tl-title-sm">
                              {food.name}{' '}
                              <span style={{ color: 'var(--color-primary)' }}>
                                · <bdi dir="ltr">~${food.estimatedUsd}</bdi>{t.plannerPerPerson}
                              </span>
                            </div>
                            <div className="tl-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                              {food.partnerVenue} — {food.description}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* STEP 4: Hotel Star Tier & Partner Hotels */}
                {step === 4 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                      {([3, 4, 5, 7] as const).map((tier) => (
                        <button
                          key={tier}
                          type="button"
                          className={`funnel-select-card ${starTier === tier ? 'selected' : ''}`}
                          style={{ textAlign: 'center', padding: '10px 6px' }}
                          onClick={() => {
                            setStarTier(tier);
                            const auto = PARTNER_HOTELS.filter(
                              (h) => selectedCities.includes(h.citySlug) && h.stars === tier
                            ).map((h) => h.id);
                            if (auto.length > 0) setSelectedHotelIds(auto);
                          }}
                        >
                          <div className="tl-title-md"><bdi dir="ltr">{tier}★</bdi></div>
                          <div className="tl-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                            {tier === 3 && t.plannerTiers.t3}
                            {tier === 4 && t.plannerTiers.t4}
                            {tier === 5 && t.plannerTiers.t5}
                            {tier === 7 && t.plannerTiers.t7}
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="tl-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                      {t.plannerHotelsHint} (<bdi dir="ltr">{starTier}★</bdi>)
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {matchingHotels.map((hotel) => {
                        const active = selectedHotelIds.includes(hotel.id);
                        const localizedCity = localizeCityName(hotel.citySlug, hotel.cityName, t);
                        return (
                          <button
                            key={hotel.id}
                            type="button"
                            className={`funnel-select-card ${active ? 'selected' : ''}`}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10 }}
                            onClick={() => toggleHotel(hotel.id)}
                          >
                            <Building2 size={20} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div className="tl-title-sm">{hotel.name}</div>
                              <div className="tl-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                                {localizedCity} · {hotel.badge}
                              </div>
                            </div>
                            <div style={{ textAlign: 'end', flexShrink: 0 }}>
                              <div className="tl-title-sm" style={{ color: 'var(--color-primary)' }}>
                                <bdi dir="ltr">${hotel.pricePerNightUsd}</bdi>{t.plannerPerNight}
                              </div>
                              <div className="tl-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                                <bdi dir="ltr">{hotel.pricePerNightEgp.toLocaleString()} EGP</bdi>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 5: Group vs Private, Guide, Car */}
                {step === 5 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <button
                        type="button"
                        className={`funnel-select-card ${travelMode === 'group' ? 'selected' : ''}`}
                        onClick={() => setTravelMode('group')}
                      >
                        <Users size={20} style={{ color: 'var(--color-primary)', marginBottom: 6 }} />
                        <div className="tl-title-sm">{t.plannerGroupTitle}</div>
                        <div className="tl-body-sm" style={{ color: 'var(--color-on-surface-variant)', marginTop: 2 }}>
                          {t.plannerGroupDesc}
                        </div>
                      </button>

                      <button
                        type="button"
                        className={`funnel-select-card ${travelMode === 'private' ? 'selected' : ''}`}
                        onClick={() => setTravelMode('private')}
                      >
                        <UserCheck size={20} style={{ color: 'var(--color-primary)', marginBottom: 6 }} />
                        <div className="tl-title-sm">{t.plannerPrivateTitle}</div>
                        <div className="tl-body-sm" style={{ color: 'var(--color-on-surface-variant)', marginTop: 2 }}>
                          {t.plannerPrivateDesc}
                        </div>
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <button
                        type="button"
                        className={`funnel-select-card ${wantGuide ? 'selected' : ''}`}
                        onClick={() => setWantGuide((p) => !p)}
                      >
                        <UserCheck size={20} style={{ color: 'var(--color-primary)', marginBottom: 6 }} />
                        <div className="tl-title-sm">{t.plannerGuideTitle}</div>
                        <div className="tl-body-sm" style={{ color: 'var(--color-on-surface-variant)', marginTop: 2 }}>
                          {wantGuide ? t.plannerGuideIncluded : t.plannerGuideExcluded}
                        </div>
                      </button>

                      <button
                        type="button"
                        className={`funnel-select-card ${wantCar ? 'selected' : ''}`}
                        onClick={() => setWantCar((p) => !p)}
                      >
                        <Car size={20} style={{ color: 'var(--color-primary)', marginBottom: 6 }} />
                        <div className="tl-title-sm">{t.plannerCarTitle}</div>
                        <div className="tl-body-sm" style={{ color: 'var(--color-on-surface-variant)', marginTop: 2 }}>
                          {wantCar ? t.plannerCarIncluded : t.plannerCarExcluded}
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 6: Summary + Contact */}
                {step === 6 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div
                      style={{
                        background: 'var(--color-surface-container-low)',
                        padding: '12px 16px',
                        borderRadius: 12,
                        border: '1px solid var(--color-outline-variant)',
                        fontSize: 13,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{t.plannerSummaryTickets} (<bdi dir="ltr">{selectedPlaces.length}</bdi> {t.plannerSitesUnit})</span>
                        <strong><bdi dir="ltr">${pricing.ticketsUsd}</bdi></strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{t.plannerSummaryHotels} (<bdi dir="ltr">{starTier}★ · {nights}</bdi> {t.plannerNightsUnit})</span>
                        <strong><bdi dir="ltr">${pricing.hotelsUsd}</bdi></strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{t.plannerSummaryMeals} (<bdi dir="ltr">{selectedFoods.length}</bdi>)</span>
                        <strong><bdi dir="ltr">${pricing.foodsUsd}</bdi></strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{t.plannerSummaryLogistics}</span>
                        <strong><bdi dir="ltr">${pricing.logisticsUsd}</bdi></strong>
                      </div>
                      {pricing.groupSavings > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-primary)' }}>
                          <span>{t.plannerSummaryDiscount}</span>
                          <strong><bdi dir="ltr">-${pricing.groupSavings}</bdi></strong>
                        </div>
                      )}
                      <div style={{ borderTop: '1px solid var(--color-outline-variant)', paddingTop: 6, marginTop: 4, display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 600 }}>
                        <span>
                          {t.plannerSummaryTotal} ({t.plannerArrivalShort}: <bdi dir="ltr">${pricing.arrival25Usd}</bdi> / {t.plannerExitShort}: <bdi dir="ltr">${pricing.departure75Usd}</bdi>)
                        </span>
                        <span style={{ color: 'var(--color-primary)' }}><bdi dir="ltr">${pricing.totalUsd} USD</bdi></span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <input
                        type="text"
                        className="funnel-input"
                        placeholder={t.plannerFullName}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                      <input
                        type="text"
                        className="funnel-input"
                        placeholder={t.plannerNationality}
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <input
                        type="email"
                        className="funnel-input"
                        placeholder={t.plannerEmail}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <input
                        type="tel"
                        className="funnel-input"
                        placeholder={t.plannerWhatsapp}
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                      />
                    </div>
                    <textarea
                      rows={2}
                      className="funnel-input"
                      placeholder={t.plannerNotes}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      style={{ height: 'auto', padding: '10px 12px', fontSize: 13, resize: 'none' }}
                    />
                  </div>
                )}

              </>
            )}
            </div>

            {!confirmed && (
              <div
                style={{
                  flexShrink: 0,
                  padding: '12px 24px 14px',
                  borderTop: '1px solid var(--color-outline-variant)',
                  background: 'var(--color-surface)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div className="moments-avatars-row">
                  <div className="moments-avatar-stack">
                    {MOMENTS_AVATARS.map((src, i) => (
                      <img
                        key={src}
                        src={src}
                        alt={`Guest ${i + 1}`}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          border: '1px solid #fff',
                          objectFit: 'cover',
                          marginInlineStart: i > 0 ? -5 : 0,
                        }}
                      />
                    ))}
                  </div>
                  <span className="tl-title-sm">{t.plannerBottomPayBanner}</span>
                </div>

                <div style={{ width: '100%', height: 3, background: 'var(--color-surface-container-highest)', borderRadius: 9999, overflow: 'hidden' }}>
                  <div style={{ width: `${progressPct}%`, height: '100%', background: 'var(--color-primary)', transition: 'width 0.25s ease' }} />
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  {step > 0 && (
                    <button type="button" className="tl-btn-outline" onClick={() => setStep((s) => s - 1)} style={{ height: 46 }}>
                      <ArrowLeft size={16} style={{ transform: lang === 'ar' ? 'scaleX(-1)' : undefined }} />
                      <span>{t.plannerBack}</span>
                    </button>
                  )}
                  <button type="button" className="tl-btn-primary" onClick={handleNext} style={{ flex: 1, height: 46 }}>
                    {step === TOTAL_STEPS - 1 ? t.plannerSubmit : t.plannerNext}
                  </button>
                </div>
              </div>
            )}
          </div>
          )}
        </div>
      </div>
    </div>
  );
};
