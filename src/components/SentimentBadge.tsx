import type { Sentiment } from "../types/index.ts";

const CONFIG: Record<Sentiment, { label: string; classes: string; icon: string }> = {
  bullish: {
    label: "Bullish",
    classes: "bg-bullish-500/15 text-bullish-400 ring-1 ring-inset ring-bullish-500/30",
    icon: "▲",
  },
  bearish: {
    label: "Bearish",
    classes: "bg-bearish-500/15 text-bearish-400 ring-1 ring-inset ring-bearish-500/30",
    icon: "▼",
  },
  neutral: {
    label: "Neutralno",
    classes: "bg-neutral-500/15 text-neutral-400 ring-1 ring-inset ring-neutral-500/30",
    icon: "●",
  },
};

export function SentimentBadge({ sentiment }: { sentiment: Sentiment }) {
  const cfg = CONFIG[sentiment];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${cfg.classes}`}>
      <span aria-hidden>{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}
