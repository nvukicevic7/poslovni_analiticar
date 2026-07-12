import type { NewsItem } from "../types/index.ts";
import { formatRelativeTime } from "../lib/format.ts";
import { SentimentBadge } from "./SentimentBadge.tsx";

export function NewsCard({ item }: { item: NewsItem }) {
  const timeLabel = formatRelativeTime(item.publishedAt);

  return (
    <article className="rounded-xl border border-border-700 bg-bg-850 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-snug text-text-100">
          {item.url ? (
            <a href={item.url} target="_blank" rel="noreferrer" className="hover:text-accent-400 hover:underline">
              {item.title}
            </a>
          ) : (
            item.title
          )}
        </h3>
      </div>

      <div className="mt-1 flex items-center gap-2 text-xs text-text-500">
        <span className="font-medium text-text-300">{item.source}</span>
        {timeLabel && (
          <>
            <span aria-hidden>•</span>
            <span>{timeLabel}</span>
          </>
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-text-300">{item.summary}</p>

      {item.impacts.length > 0 && (
        <div className="mt-4 space-y-2 border-t border-border-700 pt-3">
          {item.impacts.map((impact) => (
            <div key={impact.instrument} className="flex flex-wrap items-start gap-2 text-sm">
              <span className="min-w-[4.5rem] shrink-0 font-mono text-xs font-semibold text-text-300">
                {impact.instrument}
              </span>
              <SentimentBadge sentiment={impact.sentiment} />
              <span className="text-xs text-text-500">{impact.reasoning}</span>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
