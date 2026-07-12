// Type-only import: erased at compile time, so it never triggers loading the
// actual SDK module. The real (value) import happens lazily in getClient(),
// so a demo-mode request (no API key) never touches the SDK at all, and any
// import-time failure of the SDK itself can't break the mock fallback path.
import type Anthropic from "@anthropic-ai/sdk";
import { ALL_INSTRUMENTS, type CalendarEvent, type Instrument, type NewsItem } from "../../src/types/index";

const MODEL = "claude-opus-4-8";
const MAX_TOKENS = 8000;
const MAX_CONTINUATIONS = 1;

async function getClient(): Promise<InstanceType<typeof Anthropic>> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY nije podešen.");
  }
  const { default: AnthropicClient } = await import("@anthropic-ai/sdk");
  return new AnthropicClient({ apiKey });
}

async function runWithWebSearch(
  systemPrompt: string,
  userPrompt: string,
  schema: Record<string, unknown>,
): Promise<unknown> {
  const client = await getClient();
  let messages: Anthropic.MessageParam[] = [{ role: "user", content: userPrompt }];

  const requestParams = () => ({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: systemPrompt,
    tools: [{ type: "web_search_20260209" as const, name: "web_search" as const, max_uses: 4 }],
    output_config: {
      effort: "low" as const,
      format: { type: "json_schema" as const, schema },
    },
    messages,
  });

  let response = await client.messages.create(requestParams());

  let continuations = 0;
  while (response.stop_reason === "pause_turn" && continuations < MAX_CONTINUATIONS) {
    messages = [...messages, { role: "assistant", content: response.content }];
    response = await client.messages.create(requestParams());
    continuations++;
  }

  if (response.stop_reason === "refusal") {
    const details = response.stop_details ? ` (${JSON.stringify(response.stop_details)})` : "";
    throw new Error(`Claude je odbio zahtev${details}.`);
  }

  const textBlock = [...response.content].reverse().find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude nije vratio tekstualni odgovor.");
  }

  return JSON.parse(textBlock.text);
}

const INSTRUMENT_SCHEMA = { type: "string", enum: ALL_INSTRUMENTS } as const;

function newsSchema() {
  return {
    type: "object",
    properties: {
      items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string", description: "Originalni naslov vesti kako je objavljen (može biti na engleskom)" },
            source: { type: "string", description: "Naziv izvora/medija" },
            url: { anyOf: [{ type: "string" }, { type: "null" }], description: "URL izvora ako je poznat, inače null" },
            publishedAt: {
              anyOf: [{ type: "string" }, { type: "null" }],
              description: "Vreme objave u ISO 8601 formatu ako je poznato, inače null",
            },
            summary: {
              type: "string",
              description: "Sažetak u 2-3 rečenice na srpskom: šta se desilo i zašto je bitno za trgovce",
            },
            impacts: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  instrument: INSTRUMENT_SCHEMA,
                  sentiment: { type: "string", enum: ["bullish", "bearish", "neutral"] },
                  reasoning: { type: "string", description: "Kratko obrazloženje na srpskom (jedna rečenica)" },
                },
                required: ["instrument", "sentiment", "reasoning"],
                additionalProperties: false,
              },
            },
          },
          required: ["title", "source", "url", "publishedAt", "summary", "impacts"],
          additionalProperties: false,
        },
      },
    },
    required: ["items"],
    additionalProperties: false,
  };
}

function calendarSchema() {
  return {
    type: "object",
    properties: {
      events: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string", description: "Naziv događaja na srpskom" },
            date: { type: "string", description: "Datum u ISO 8601 formatu (GGGG-MM-DD)" },
            time: {
              anyOf: [{ type: "string" }, { type: "null" }],
              description: "Vreme u HH:MM (24h) formatu po UTC, ili null ako nije poznato",
            },
            importance: { type: "string", enum: ["high", "medium", "low"] },
            instruments: { type: "array", items: INSTRUMENT_SCHEMA },
            description: { type: "string", description: "Jedna rečenica na srpskom zašto je događaj bitan" },
          },
          required: ["title", "date", "time", "importance", "instruments", "description"],
          additionalProperties: false,
        },
      },
    },
    required: ["events"],
    additionalProperties: false,
  };
}

const NEWS_SYSTEM_PROMPT = `Ti si finansijski analitičar specijalizovan za makroekonomske vesti relevantne za trgovanje na forex tržištu i berzanskim indeksima.

Koristi web pretragu da pronađeš najnovije, verodostojne vesti (iz poslednja 24-48 sata) o: odlukama Fed-a i drugih centralnih banaka, izjavama zvaničnika centralnih banaka, objavama makro podataka (PCE, CPI, GDP, NFP, kamatne stope) i značajnim geopolitičkim događajima koji utiču na navedene instrumente.

Za svaku vest:
- Odredi koji od navedenih instrumenata su njome najviše pogođeni.
- Za svaki pogođen instrument oceni da li je vest "bullish", "bearish" ili "neutral", uz kratko obrazloženje.
- Napiši sažetak u 2-3 rečenice objašnjavajući šta se desilo i zašto je bitno za trgovce.

Piši sažetke i obrazloženja isključivo na srpskom jeziku, jasno i koncizno, bez fraza koje najavljuju odgovor. Vrati između 4 i 8 najrelevantnijih i najsvežijih vesti. Ne izmišljaj vesti niti izvore — koristi isključivo ono što pronađeš pretragom. Ako ne pronađeš dovoljno svežih vesti, vrati manje stavki umesto izmišljenih.`;

const CALENDAR_SYSTEM_PROMPT = `Ti si finansijski analitičar. Koristi web pretragu da pronađeš najvažnije predstojeće makroekonomske događaje (od danas pa u narednih 7 dana) relevantne za forex trgovanje: sastanci centralnih banaka (Fed, ECB, BoE, BoJ), objave ključnih makro podataka (CPI, PCE, GDP, NFP, kamatne stope) i slično.

Za svaki događaj navedi tačan datum, vreme po UTC (ako je poznato), koji od navedenih instrumenata su njime najviše pogođeni, i kratak opis na srpskom zašto je važan. Vrati između 5 i 10 najvažnijih događaja, sortiranih hronološki počev od najbližeg. Ne izmišljaj događaje — koristi isključivo ono što pronađeš pretragom.`;

export async function fetchNewsFromClaude(instruments: Instrument[]): Promise<NewsItem[]> {
  const userPrompt = `Pronađi najnovije makro vesti relevantne za trgovanje sledećim instrumentima: ${instruments.join(", ")}. Fokusiraj se na Fed odluke, PCE/CPI/GDP podatke, kamatne stope, izjave centralnih banaka i geopolitičke događaje koji utiču na ove instrumente.`;

  const raw = (await runWithWebSearch(NEWS_SYSTEM_PROMPT, userPrompt, newsSchema())) as {
    items: Array<Omit<NewsItem, "id">>;
  };

  return raw.items.map((item, index) => ({
    id: `live-${Date.now()}-${index}`,
    ...item,
  }));
}

export async function fetchCalendarFromClaude(instruments: Instrument[]): Promise<CalendarEvent[]> {
  const today = new Date().toISOString().slice(0, 10);
  const userPrompt = `Napravi ekonomski kalendar najvažnijih predstojećih događaja relevantnih za: ${instruments.join(", ")}. Današnji datum je ${today}.`;

  const raw = (await runWithWebSearch(CALENDAR_SYSTEM_PROMPT, userPrompt, calendarSchema())) as {
    events: Array<Omit<CalendarEvent, "id">>;
  };

  return raw.events.map((event, index) => ({
    id: `live-${Date.now()}-${index}`,
    ...event,
  }));
}
