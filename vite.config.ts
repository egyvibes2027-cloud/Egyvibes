import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const ALLOWED_CITIES = new Set([
  'cairo-giza',
  'luxor',
  'aswan',
  'sharm-el-sheikh',
  'hurghada',
  'alexandria',
  'siwa',
  'fayoum',
  'white-desert',
]);

const ALLOWED_LANDMARKS = new Set([
  'giza-pyramids',
  'grand-egyptian-museum',
  'valley-of-kings',
  'karnak-temple',
  'luxor-temple',
  'abu-simbel',
  'philae-temple',
  'citadel-saladin',
  'saqqara',
  'khan-el-khalili',
  'wadi-el-hitan',
  'siwa-salt-lakes',
  'white-desert-reserve',
  'dendera-temple',
  'abydos-temple',
  'wadi-el-wishwash',
  'wadi-el-gemal',
  'medinet-habu',
  'tunis-village',
  'dahshur-pyramids',
  'qaitbay-citadel',
  'nubian-village',
]);

const ALLOWED_AIRPORTS = new Set(['CAI', 'SPX', 'LXR', 'ASW', 'HRG', 'SSH', 'HBE']);

// Ordered by real latency benchmark: gemini-3.5-flash-lite with MINIMAL thinking responds in ~0.70s TTFB
const GEMINI_FALLBACK_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-3-flash-preview',
];

const META_START = '<<<META>>>';
const META_END = '<<<END>>>';

const EGYVIBES_SYSTEM_INSTRUCTION = `You are the EGYVIBES AI Egypt Travel Concierge for tourists visiting Egypt.
Speak warmly, naturally, and concisely in the EXACT language & dialect of the user's latest message (for casual Egyptian Arabic greetings like "صباح الخير ايه الدنيا", reply warmly in friendly Egyptian Arabic in 1–2 short sentences and invite them to pick destinations or ask prices—do NOT dump an itinerary unless asked!).

Key 2026 Egypt Facts (1 USD ≈ 50 EGP):
- Payment Policy: Strictly USD — 25% on arrival in Egypt, 75% on departure. 48-hour partner & small-group check. Zero markups.
- 2026 Foreign Tickets: Giza Pyramids (700 EGP / $14), Grand Egyptian Museum (1,830 EGP / $37, online pre-book), Valley of Kings (750 EGP / $15), Karnak (600 EGP / $12), Luxor Temple (500 EGP / $10), Abu Simbel (822 EGP / $16), Philae (550 EGP / $11), Citadel (550 EGP / $11), Saqqara (600 EGP / $12), Khan El-Khalili (Free). Card only (Visa/Mastercard); 50% off with Student ID (<30).
- Hidden Gems: Wadi El-Hitan ($10), Tunis Village (Free), Siwa Salt Lakes ($4), White Desert ($5), Dendera ($6), Abydos ($5), Wadi El-Wishwash ($5), Wadi El-Gemal ($5), Medinet Habu, Dahshur, Qaitbay Citadel, Nubian Village.
- Hotels (/night): 3★ Value $25–40 | 4★ Comfort $45–75 | 5★ Luxury $85–160 | 7★ Royal $290–370 (St. Regis Cairo, Old Cataract Aswan, Winter Palace Luxor).
- Airports: CAI, SPX, LXR, ASW, HRG, SSH, HBE.

Response Rules:
- Keep answers scannable with short paragraphs or • bullet points and **bold** highlights. Never mention internal IDs or output raw JSON in your main reply.
- At the very end of EVERY response, append a single hidden metadata line wrapped strictly in <<<META>>> and <<<END>>>:
  <<<META>>>{"followUps":["short clickable suggestion 1","short clickable suggestion 2"],"plan":{"label":"Apply Luxor & Aswan 5★ Plan →","citySlugs":["luxor","aswan"],"landmarkIds":["valley-of-kings","karnak-temple","philae-temple"],"airportCode":"LXR","nights":5,"starTier":5,"travelMode":"private"}}<<<END>>>
- Rules for metadata:
  - "followUps": ALWAYS include 2 or 3 crisp, creative, contextual next-step questions/actions in the same language (under 42 chars each).
  - "plan": Include ONLY when recommending or pricing a specific trip/city/hotel plan; omit for greetings or general Q&A.
  - Valid citySlugs: cairo-giza, luxor, aswan, sharm-el-sheikh, hurghada, alexandria, siwa, fayoum, white-desert.
  - Valid landmarkIds: giza-pyramids, grand-egyptian-museum, valley-of-kings, karnak-temple, luxor-temple, abu-simbel, philae-temple, citadel-saladin, saqqara, khan-el-khalili, wadi-el-hitan, siwa-salt-lakes, white-desert-reserve, dendera-temple, abydos-temple, wadi-el-wishwash, wadi-el-gemal, medinet-habu, tunis-village, dahshur-pyramids, qaitbay-citadel, nubian-village.`;

function sanitizePlan(raw: unknown) {
  if (!raw || typeof raw !== 'object') return undefined;
  const obj = raw as Record<string, unknown>;
  const citySlugs = Array.isArray(obj.citySlugs)
    ? obj.citySlugs.filter((s): s is string => typeof s === 'string' && ALLOWED_CITIES.has(s))
    : [];
  const landmarkIds = Array.isArray(obj.landmarkIds)
    ? obj.landmarkIds.filter((s): s is string => typeof s === 'string' && ALLOWED_LANDMARKS.has(s))
    : undefined;
  const airportCode =
    typeof obj.airportCode === 'string' && ALLOWED_AIRPORTS.has(obj.airportCode)
      ? obj.airportCode
      : undefined;
  const nights =
    typeof obj.nights === 'number' && Number.isFinite(obj.nights)
      ? Math.max(2, Math.min(25, Math.round(obj.nights)))
      : undefined;
  const starTier =
    obj.starTier === 3 || obj.starTier === 4 || obj.starTier === 5 || obj.starTier === 7
      ? obj.starTier
      : undefined;
  const travelMode =
    obj.travelMode === 'group' || obj.travelMode === 'private' ? obj.travelMode : undefined;

  if (citySlugs.length === 0 && (!landmarkIds || landmarkIds.length === 0)) {
    return undefined;
  }

  return {
    label: typeof obj.label === 'string' && obj.label.trim() ? obj.label.trim() : 'Apply Trip Plan →',
    citySlugs: citySlugs.length > 0 ? citySlugs : ['cairo-giza'],
    ...(landmarkIds && landmarkIds.length > 0 ? { landmarkIds } : {}),
    ...(airportCode ? { airportCode } : {}),
    ...(nights ? { nights } : {}),
    ...(starTier ? { starTier } : {}),
    ...(travelMode ? { travelMode } : {}),
  };
}

function extractMetaBlock(fullText: string) {
  const startIdx = fullText.indexOf(META_START);
  if (startIdx === -1) {
    return {
      visibleText: fullText.trim(),
      suggestedPlan: undefined,
      followUps: undefined as string[] | undefined,
    };
  }
  const visibleText = fullText.slice(0, startIdx).trim();
  const afterStart = fullText.slice(startIdx + META_START.length);
  const endIdx = afterStart.indexOf(META_END);
  const jsonSlice = (endIdx === -1 ? afterStart : afterStart.slice(0, endIdx)).trim();

  let suggestedPlan: ReturnType<typeof sanitizePlan>;
  let followUps: string[] | undefined;

  try {
    const parsed = JSON.parse(jsonSlice);
    suggestedPlan = sanitizePlan(parsed.plan ?? parsed.suggestedPlan);
    if (Array.isArray(parsed.followUps)) {
      const cleaned = parsed.followUps
        .filter((x: unknown): x is string => typeof x === 'string' && x.trim().length > 0)
        .map((x: string) => x.trim())
        .slice(0, 3);
      if (cleaned.length > 0) followUps = cleaned;
    }
  } catch {
    // Ignore malformed trailing metadata cleanly
  }

  return { visibleText, suggestedPlan, followUps };
}

function safeVisibleEnd(text: string): number {
  const fullIdx = text.indexOf(META_START);
  if (fullIdx !== -1) return fullIdx;
  // Hold back only if text currently ends with a partial prefix of "<<<META>>>"
  const maxCheck = Math.min(text.length, META_START.length - 1);
  for (let len = maxCheck; len >= 1; len--) {
    if (text.endsWith(META_START.slice(0, len))) {
      return text.length - len;
    }
  }
  return text.length;
}

function egyvibesGeminiPlugin(apiKey: string): Plugin {
  const attachMiddleware = (middlewares: {
    use: (path: string, handler: (req: any, res: any, next: () => void) => void) => void;
  }) => {
    middlewares.use('/api/concierge', async (req, res, next) => {
      if (req.method !== 'POST') {
        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }
        next();
        return;
      }

      if (!apiKey) {
        res.statusCode = 503;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'GEMINI_API_KEY is not configured in .env.local' }));
        return;
      }

      try {
        const decoder = new TextDecoder();
        let bodyRaw = '';
        for await (const chunk of req) {
          bodyRaw += typeof chunk === 'string' ? chunk : decoder.decode(chunk, { stream: true });
        }
        bodyRaw += decoder.decode();
        const body = bodyRaw ? JSON.parse(bodyRaw) : {};
        const userMessage = typeof body.message === 'string' ? body.message.trim() : '';
        const language = typeof body.language === 'string' ? body.language : 'en';
        const history = Array.isArray(body.history) ? body.history : [];
        const wantsStream = Boolean(body.stream);

        if (!userMessage) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Missing message' }));
          return;
        }

        const contents = history
          .slice(-8)
          .filter(
            (m: any) =>
              m &&
              typeof m.content === 'string' &&
              m.content.trim() &&
              (m.role === 'user' || m.role === 'assistant')
          )
          .map((m: any) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content.trim() }],
          }));

        const last = contents[contents.length - 1];
        if (!last || last.role !== 'user' || last.parts[0]?.text !== userMessage) {
          contents.push({ role: 'user', parts: [{ text: userMessage }] });
        }

        const requestPayload = {
          systemInstruction: {
            parts: [
              {
                text: `${EGYVIBES_SYSTEM_INSTRUCTION}\n\nPreferred UI language fallback: ${language}`,
              },
            ],
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
            thinkingConfig: { thinkingLevel: 'MINIMAL' },
          },
        };

        let lastErrStatus = 502;
        let lastErrDetail = 'Upstream Gemini error';

        for (const model of GEMINI_FALLBACK_MODELS) {
          const action = wantsStream ? 'streamGenerateContent?alt=sse&' : 'generateContent?';
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:${action}key=${encodeURIComponent(apiKey)}`;
          const upstream = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestPayload),
          });

          if (!upstream.ok) {
            lastErrStatus = upstream.status;
            lastErrDetail = await upstream.text();
            if (upstream.status === 404 || upstream.status === 429 || upstream.status >= 500) {
              continue;
            }
            break;
          }

          if (wantsStream && upstream.body) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
            res.setHeader('Cache-Control', 'no-cache, no-transform');
            res.setHeader('Connection', 'keep-alive');

            const reader = upstream.body.getReader();
            const sseDecoder = new TextDecoder();
            let sseBuf = '';
            let fullText = '';
            let sentLen = 0;

            while (true) {
              const { value, done } = await reader.read();
              if (done) break;
              sseBuf += sseDecoder.decode(value, { stream: true });

              const lines = sseBuf.split('\n');
              sseBuf = lines.pop() ?? '';

              for (const rawLine of lines) {
                const line = rawLine.trim();
                if (!line.startsWith('data:')) continue;
                const jsonStr = line.slice(5).trim();
                if (!jsonStr || jsonStr === '[DONE]') continue;
                try {
                  const frame: any = JSON.parse(jsonStr);
                  const parts: any[] = frame?.candidates?.[0]?.content?.parts || [];
                  const chunkText = parts
                    .filter((p) => !p.thought && typeof p.text === 'string')
                    .map((p) => p.text)
                    .join('');
                  if (chunkText) {
                    fullText += chunkText;
                    const limit = safeVisibleEnd(fullText);
                    if (limit > sentLen && fullText.indexOf(META_START) === -1) {
                      const delta = fullText.slice(sentLen, limit);
                      sentLen = limit;
                      res.write(`data: ${JSON.stringify({ delta })}\n\n`);
                    } else if (fullText.indexOf(META_START) !== -1) {
                      const metaPos = fullText.indexOf(META_START);
                      if (metaPos > sentLen) {
                        const delta = fullText.slice(sentLen, metaPos);
                        sentLen = metaPos;
                        res.write(`data: ${JSON.stringify({ delta })}\n\n`);
                      }
                    }
                  }
                } catch {
                  // Ignore incomplete SSE line
                }
              }
            }

            const { visibleText, suggestedPlan, followUps } = extractMetaBlock(fullText);
            if (visibleText.length > sentLen && fullText.indexOf(META_START) === -1) {
              res.write(`data: ${JSON.stringify({ delta: visibleText.slice(sentLen) })}\n\n`);
            }
            res.write(
              `data: ${JSON.stringify({
                done: true,
                reply: visibleText,
                suggestedPlan,
                followUps,
                provider: 'gemini',
                model,
              })}\n\n`
            );
            res.end();
            return;
          }

          // Non-streaming JSON response
          const data: any = await upstream.json();
          const parts: any[] = data?.candidates?.[0]?.content?.parts || [];
          const fullText = parts
            .filter((p) => !p.thought && typeof p.text === 'string')
            .map((p) => p.text)
            .join('');

          if (!fullText.trim()) {
            lastErrDetail = 'Empty response from Gemini';
            continue;
          }

          const { visibleText, suggestedPlan, followUps } = extractMetaBlock(fullText);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              reply: visibleText,
              suggestedPlan,
              followUps,
              provider: 'gemini',
              model,
            })
          );
          return;
        }

        res.statusCode = lastErrStatus === 400 || lastErrStatus === 403 ? lastErrStatus : 502;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: lastErrDetail }));
      } catch (err: any) {
        if (!res.headersSent) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err?.message || 'Internal concierge error' }));
        } else {
          res.end();
        }
      }
    });
  };

  return {
    name: 'egyvibes-gemini-concierge',
    configureServer(server) {
      attachMiddleware(server.middlewares);
    },
    configurePreviewServer(server) {
      attachMiddleware(server.middlewares);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), egyvibesGeminiPlugin(env.GEMINI_API_KEY || '')],
  };
});
