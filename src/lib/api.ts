import type { CalendarResponse, Instrument, NewsResponse } from "../types/index.ts";

async function parseJsonOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`Server je vratio grešku (${res.status}).`);
  }
  return (await res.json()) as T;
}

export async function fetchNews(instruments: Instrument[]): Promise<NewsResponse> {
  const res = await fetch("/api/news", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ instruments }),
  });
  return parseJsonOrThrow<NewsResponse>(res);
}

export async function fetchCalendar(instruments: Instrument[]): Promise<CalendarResponse> {
  const params = new URLSearchParams({ instruments: instruments.join(",") });
  const res = await fetch(`/api/calendar?${params.toString()}`);
  return parseJsonOrThrow<CalendarResponse>(res);
}
