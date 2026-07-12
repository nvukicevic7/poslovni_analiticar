import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ALL_INSTRUMENTS, type CalendarResponse, type Instrument } from "../src/types/index";
import { fetchCalendarFromClaude } from "./_lib/claude";
import { getMockCalendar } from "./_lib/mockData";

function parseInstruments(query: VercelRequest["query"]): Instrument[] {
  const raw = query.instruments;
  const list = Array.isArray(raw) ? raw.join(",") : raw;
  if (!list) return ALL_INSTRUMENTS;
  const valid = list
    .split(",")
    .map((v) => v.trim())
    .filter((v): v is Instrument => (ALL_INSTRUMENTS as string[]).includes(v));
  return valid.length > 0 ? valid : ALL_INSTRUMENTS;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // Every branch below funnels through this single try/catch, so any
  // unexpected failure (bad query, a broken import, an SDK error) still
  // yields a graceful mock JSON response instead of an opaque 500 that
  // breaks the frontend fetch entirely.
  let instruments: Instrument[] = ALL_INSTRUMENTS;
  try {
    instruments = parseInstruments(req.query);

    if (!process.env.ANTHROPIC_API_KEY) {
      const response: CalendarResponse = {
        events: getMockCalendar(instruments),
        generatedAt: new Date().toISOString(),
        isMock: true,
        note: "ANTHROPIC_API_KEY nije podešen na serveru — prikazani su demo podaci.",
      };
      res.status(200).json(response);
      return;
    }

    const events = await fetchCalendarFromClaude(instruments);
    const response: CalendarResponse = { events, generatedAt: new Date().toISOString(), isMock: false };
    res.status(200).json(response);
  } catch (err) {
    console.error("Greška pri dohvatanju kalendara preko Claude API-ja:", err);
    const response: CalendarResponse = {
      events: getMockCalendar(instruments),
      generatedAt: new Date().toISOString(),
      isMock: true,
      note: "Greška pri pozivu Claude API-ja — prikazani su demo podaci.",
    };
    res.status(200).json(response);
  }
}

export const config = { maxDuration: 60 };
