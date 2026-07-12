// Kept in sync with src/types/index.ts. Duplicated (not imported from ../src/)
// because Vercel's Node.js function bundler scopes module resolution to the
// api/ directory — a relative import reaching outside it (e.g. ../src/...)
// fails at runtime with ERR_MODULE_NOT_FOUND even though it builds fine
// locally. Everything api/ functions need must live inside api/.

export type Instrument = "XAU/USD" | "GBP/USD" | "EUR/USD" | "GBP/JPY";

export const ALL_INSTRUMENTS: Instrument[] = ["XAU/USD", "GBP/USD", "EUR/USD", "GBP/JPY"];

export type Sentiment = "bullish" | "bearish" | "neutral";

export interface InstrumentImpact {
  instrument: Instrument;
  sentiment: Sentiment;
  reasoning: string;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string | null;
  publishedAt: string | null;
  summary: string;
  impacts: InstrumentImpact[];
}

export interface NewsResponse {
  items: NewsItem[];
  generatedAt: string;
  isMock: boolean;
  note?: string;
}

export type CalendarImportance = "high" | "medium" | "low";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string | null;
  importance: CalendarImportance;
  instruments: Instrument[];
  description: string;
}

export interface CalendarResponse {
  events: CalendarEvent[];
  generatedAt: string;
  isMock: boolean;
  note?: string;
}
