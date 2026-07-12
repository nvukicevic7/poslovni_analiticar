import { useCallback, useEffect, useState } from "react";
import { InstrumentSelector } from "./components/InstrumentSelector.tsx";
import { NewsCard } from "./components/NewsCard.tsx";
import { EconomicCalendar } from "./components/EconomicCalendar.tsx";
import { fetchCalendar, fetchNews } from "./lib/api.ts";
import { ALL_INSTRUMENTS, type CalendarEvent, type Instrument, type NewsItem } from "./types/index.ts";

function Header() {
  return (
    <header className="border-b border-border-700 bg-bg-900">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500/15">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5l4.5-4.5 4 4L21 4.5M21 4.5H15M21 4.5v6M3 20.25h18" />
          </svg>
        </div>
        <div>
          <p className="text-base font-semibold leading-tight text-text-100">AI Trading Vesti Sažetak</p>
          <p className="text-xs leading-tight text-text-500">Makro vesti i kalendar za forex i indekse</p>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const [selected, setSelected] = useState<Instrument[]>(ALL_INSTRUMENTS);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [newsNote, setNewsNote] = useState<string | null>(null);
  const [calendarNote, setCalendarNote] = useState<string | null>(null);
  const [newsUpdatedAt, setNewsUpdatedAt] = useState<string | null>(null);
  const [loadingNews, setLoadingNews] = useState(false);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCalendar = useCallback(async (instruments: Instrument[]) => {
    setLoadingCalendar(true);
    try {
      const res = await fetchCalendar(instruments);
      setEvents(res.events);
      setCalendarNote(res.note ?? null);
    } catch (err) {
      console.error("Greška pri učitavanju kalendara:", err);
      const detail = err instanceof Error ? err.message : "";
      setCalendarNote(`Nije moguće učitati ekonomski kalendar.${detail ? ` (${detail})` : ""}`);
    } finally {
      setLoadingCalendar(false);
    }
  }, []);

  const loadNews = useCallback(async (instruments: Instrument[]) => {
    if (instruments.length === 0) {
      setNews([]);
      setError("Izaberite bar jedan instrument.");
      return;
    }
    setLoadingNews(true);
    setError(null);
    try {
      const res = await fetchNews(instruments);
      setNews(res.items);
      setNewsNote(res.note ?? null);
      setNewsUpdatedAt(res.generatedAt);
    } catch (err) {
      console.error("Greška pri učitavanju vesti:", err);
      const detail = err instanceof Error ? err.message : "";
      setError(`Nije moguće učitati vesti.${detail ? ` (${detail})` : ""}`);
    } finally {
      setLoadingNews(false);
    }
  }, []);

  useEffect(() => {
    loadNews(ALL_INSTRUMENTS);
    loadCalendar(ALL_INSTRUMENTS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-bg-950">
      <Header />

      <main className="mx-auto max-w-6xl space-y-8 px-6 py-8">
        <section className="rounded-xl border border-border-700 bg-bg-900 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <InstrumentSelector selected={selected} onChange={setSelected} />
            <button
              type="button"
              onClick={() => {
                loadNews(selected);
                loadCalendar(selected);
              }}
              disabled={loadingNews}
              className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingNews ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              )}
              Osveži vesti
            </button>
          </div>
          {newsNote && <p className="mt-3 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-400">{newsNote}</p>}
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-100">Najnovije vesti</h2>
            {newsUpdatedAt && (
              <span className="text-xs text-text-500">
                Ažurirano: {new Date(newsUpdatedAt).toLocaleTimeString("sr-RS", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </div>

          {error && <p className="rounded-xl border border-bearish-500/30 bg-bearish-500/10 p-4 text-sm text-bearish-400">{error}</p>}

          {!error && loadingNews && news.length === 0 && (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-32 animate-pulse rounded-xl border border-border-700 bg-bg-850" />
              ))}
            </div>
          )}

          {!error && !loadingNews && news.length === 0 && (
            <p className="rounded-xl border border-border-700 bg-bg-850 p-5 text-sm text-text-500">
              Nema vesti za prikaz. Izaberite instrumente i kliknite „Osveži vesti“.
            </p>
          )}

          <div className="space-y-3">
            {news.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-text-100">Ekonomski kalendar — predstojeći događaji</h2>
          {calendarNote && <p className="mb-3 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-400">{calendarNote}</p>}
          {loadingCalendar && events.length === 0 ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl border border-border-700 bg-bg-850" />
              ))}
            </div>
          ) : (
            <EconomicCalendar events={events} />
          )}
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-6 pb-10 pt-4 text-center text-xs text-text-500">
        AI Trading Vesti Sažetak — vesti i sažeci generisani su pomoću AI-ja i ne predstavljaju finansijski savet.
      </footer>
    </div>
  );
}
