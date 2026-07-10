const currencyFormatter = new Intl.NumberFormat("sr-RS", {
  maximumFractionDigits: 0,
});

const compactFormatter = new Intl.NumberFormat("sr-RS", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCurrency(n: number): string {
  return `${currencyFormatter.format(Math.round(n))} RSD`;
}

export function formatCompactCurrency(n: number): string {
  return `${compactFormatter.format(n)} RSD`;
}

export function formatNumber(n: number): string {
  return currencyFormatter.format(n);
}

export function formatPercent(n: number, signed = false): string {
  const sign = signed && n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}

const dateFormatter = new Intl.DateTimeFormat("sr-RS", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function formatDate(d: Date): string {
  return dateFormatter.format(d);
}
