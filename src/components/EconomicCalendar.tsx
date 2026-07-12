import type { CalendarEvent, CalendarImportance } from "../types/index.ts";
import { formatEventDate } from "../lib/format.ts";

const IMPORTANCE_CONFIG: Record<CalendarImportance, { label: string; classes: string }> = {
  high: { label: "Visok značaj", classes: "bg-importance-high/15 text-red-400 ring-1 ring-inset ring-importance-high/40" },
  medium: {
    label: "Srednji značaj",
    classes: "bg-importance-medium/15 text-amber-400 ring-1 ring-inset ring-importance-medium/40",
  },
  low: { label: "Nizak značaj", classes: "bg-importance-low/15 text-slate-400 ring-1 ring-inset ring-importance-low/40" },
};

export function EconomicCalendar({ events }: { events: CalendarEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="rounded-xl border border-border-700 bg-bg-850 p-5 text-sm text-text-500">
        Nema predstojećih događaja za izabrane instrumente.
      </p>
    );
  }

  return (
    <ol className="space-y-2">
      {events.map((event) => (
        <li
          key={event.id}
          className="flex flex-col gap-2 rounded-xl border border-border-700 bg-bg-850 p-4 sm:flex-row sm:items-center sm:gap-4"
        >
          <div className="flex shrink-0 flex-col items-start sm:w-36">
            <span className="text-sm font-semibold text-text-100">{formatEventDate(event.date)}</span>
            {event.time && <span className="font-mono text-xs text-text-500">{event.time} UTC</span>}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-semibold text-text-100">{event.title}</h4>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${IMPORTANCE_CONFIG[event.importance].classes}`}>
                {IMPORTANCE_CONFIG[event.importance].label}
              </span>
            </div>
            <p className="mt-1 text-xs text-text-500">{event.description}</p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-1.5 sm:w-40 sm:justify-end">
            {event.instruments.map((instrument) => (
              <span key={instrument} className="rounded-md bg-bg-700 px-1.5 py-0.5 font-mono text-[11px] text-text-300">
                {instrument}
              </span>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}
