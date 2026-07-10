import type { Overview } from "../types";
import { formatCompactCurrency, formatPercent, formatNumber, formatDate } from "../lib/format";

interface OverviewCardsProps {
  overview: Overview;
}

export function OverviewCards({ overview }: OverviewCardsProps) {
  const isProfitable = overview.totalProfit >= 0;

  const cards = [
    {
      label: "Ukupan prihod",
      value: formatCompactCurrency(overview.totalRevenue),
      accent: "text-navy-900",
    },
    {
      label: "Ukupni troškovi",
      value: formatCompactCurrency(overview.totalCost),
      accent: "text-slate-700",
    },
    {
      label: "Profit",
      value: formatCompactCurrency(overview.totalProfit),
      accent: isProfitable ? "text-good" : "text-critical",
      sub: `Marža: ${formatPercent(overview.profitMargin)}`,
    },
    {
      label: "Broj transakcija",
      value: formatNumber(overview.transactionCount),
      accent: "text-navy-900",
      sub:
        overview.avgTransactionValue > 0
          ? `Prosečno: ${formatCompactCurrency(overview.avgTransactionValue)}`
          : undefined,
    },
  ];

  return (
    <div>
      {overview.periodStart && overview.periodEnd && (
        <p className="mb-3 text-sm text-slate-500">
          Period: {formatDate(overview.periodStart)} — {formatDate(overview.periodEnd)}
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">{card.label}</p>
            <p className={`mt-2 text-2xl font-semibold tracking-tight ${card.accent}`}>
              {card.value}
            </p>
            {card.sub && <p className="mt-1 text-xs text-slate-400">{card.sub}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
