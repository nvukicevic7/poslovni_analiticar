import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ALL_INSTRUMENTS, type Instrument, type NewsResponse } from "../src/types/index.ts";
import { fetchNewsFromClaude } from "./_lib/claude.ts";
import { getMockNews } from "./_lib/mockData.ts";

function parseInstruments(body: unknown): Instrument[] {
  const raw = (body as { instruments?: unknown } | null | undefined)?.instruments;
  if (!Array.isArray(raw)) return ALL_INSTRUMENTS;
  const valid = raw.filter((v): v is Instrument => (ALL_INSTRUMENTS as string[]).includes(v as string));
  return valid.length > 0 ? valid : ALL_INSTRUMENTS;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const instruments = parseInstruments(req.body);

  if (!process.env.ANTHROPIC_API_KEY) {
    const response: NewsResponse = {
      items: getMockNews(instruments),
      generatedAt: new Date().toISOString(),
      isMock: true,
      note: "ANTHROPIC_API_KEY nije podešen na serveru — prikazani su demo podaci.",
    };
    res.status(200).json(response);
    return;
  }

  try {
    const items = await fetchNewsFromClaude(instruments);
    const response: NewsResponse = { items, generatedAt: new Date().toISOString(), isMock: false };
    res.status(200).json(response);
  } catch (err) {
    console.error("Greška pri dohvatanju vesti preko Claude API-ja:", err);
    const response: NewsResponse = {
      items: getMockNews(instruments),
      generatedAt: new Date().toISOString(),
      isMock: true,
      note: "Greška pri pozivu Claude API-ja — prikazani su demo podaci.",
    };
    res.status(200).json(response);
  }
}

export const config = { maxDuration: 60 };
