import type {
  Alert,
  AnalysisResult,
  CustomerSummary,
  MonthlyPoint,
  Overview,
  ProductSummary,
  Transaction,
} from "../types";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Maj",
  "Jun",
  "Jul",
  "Avg",
  "Sep",
  "Okt",
  "Nov",
  "Dec",
];

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(date: Date): string {
  return `${MONTH_LABELS[date.getMonth()]} ${date.getFullYear()}`;
}

export function computeOverview(transactions: Transaction[]): Overview {
  if (transactions.length === 0) {
    return {
      totalRevenue: 0,
      totalCost: 0,
      totalProfit: 0,
      profitMargin: 0,
      transactionCount: 0,
      periodStart: null,
      periodEnd: null,
      avgTransactionValue: 0,
    };
  }

  let totalRevenue = 0;
  let totalCost = 0;
  for (const t of transactions) {
    totalRevenue += t.revenue;
    totalCost += t.cost;
  }
  const totalProfit = totalRevenue - totalCost;

  return {
    totalRevenue,
    totalCost,
    totalProfit,
    profitMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
    transactionCount: transactions.length,
    periodStart: transactions[0].date,
    periodEnd: transactions[transactions.length - 1].date,
    avgTransactionValue: totalRevenue / transactions.length,
  };
}

export function computeMonthlyTrend(transactions: Transaction[]): MonthlyPoint[] {
  const map = new Map<string, MonthlyPoint>();

  for (const t of transactions) {
    const key = monthKey(t.date);
    let point = map.get(key);
    if (!point) {
      point = {
        monthKey: key,
        monthLabel: monthLabel(t.date),
        revenue: 0,
        cost: 0,
        profit: 0,
        transactionCount: 0,
      };
      map.set(key, point);
    }
    point.revenue += t.revenue;
    point.cost += t.cost;
    point.profit = point.revenue - point.cost;
    point.transactionCount += 1;
  }

  return Array.from(map.values()).sort((a, b) => a.monthKey.localeCompare(b.monthKey));
}

export function computeProductSummaries(transactions: Transaction[]): ProductSummary[] {
  const map = new Map<string, ProductSummary>();
  const totalRevenue = transactions.reduce((sum, t) => sum + t.revenue, 0);

  for (const t of transactions) {
    let entry = map.get(t.product);
    if (!entry) {
      entry = {
        product: t.product,
        revenue: 0,
        cost: 0,
        profit: 0,
        transactionCount: 0,
        share: 0,
      };
      map.set(t.product, entry);
    }
    entry.revenue += t.revenue;
    entry.cost += t.cost;
    entry.profit = entry.revenue - entry.cost;
    entry.transactionCount += 1;
  }

  const list = Array.from(map.values());
  for (const entry of list) {
    entry.share = totalRevenue > 0 ? (entry.revenue / totalRevenue) * 100 : 0;
  }

  return list.sort((a, b) => b.revenue - a.revenue);
}

export function computeCustomerSummaries(transactions: Transaction[]): CustomerSummary[] {
  const map = new Map<string, CustomerSummary>();

  for (const t of transactions) {
    let entry = map.get(t.customer);
    if (!entry) {
      entry = { customer: t.customer, revenue: 0, transactionCount: 0 };
      map.set(t.customer, entry);
    }
    entry.revenue += t.revenue;
    entry.transactionCount += 1;
  }

  return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
}

const fmtPct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(0)}%`;

export function computeAlerts(monthly: MonthlyPoint[], products: ProductSummary[]): Alert[] {
  const alerts: Alert[] = [];
  if (monthly.length < 2) {
    return alerts;
  }

  // Skeniraj sve uzastopne parove meseci radi otkrivanja neobičnih promena,
  // ne samo poslednji par — anomalija bilo gde u periodu je bitna.
  for (let i = 1; i < monthly.length; i++) {
    const cur = monthly[i];
    const prev = monthly[i - 1];

    const revenueChange = prev.revenue > 0 ? ((cur.revenue - prev.revenue) / prev.revenue) * 100 : 0;
    const costChange = prev.cost > 0 ? ((cur.cost - prev.cost) / prev.cost) * 100 : 0;
    const isLast = i === monthly.length - 1;

    if (revenueChange <= -30) {
      alerts.push({
        id: `revenue-drop-${cur.monthKey}`,
        severity: "critical",
        title: `Nagli pad prihoda u ${cur.monthLabel}`,
        description: `Prihod je pao za ${fmtPct(revenueChange)} u odnosu na ${prev.monthLabel} (sa ${formatCurrencyShort(prev.revenue)} na ${formatCurrencyShort(cur.revenue)}).`,
      });
    } else if (revenueChange <= -18 && isLast) {
      alerts.push({
        id: `revenue-drop-mild-${cur.monthKey}`,
        severity: "warning",
        title: `Pad prihoda u ${cur.monthLabel}`,
        description: `Prihod je opao za ${fmtPct(revenueChange)} u odnosu na prethodni mesec.`,
      });
    } else if (revenueChange >= 40) {
      alerts.push({
        id: `revenue-spike-${cur.monthKey}`,
        severity: "good",
        title: `Značajan rast prihoda u ${cur.monthLabel}`,
        description: `Prihod je porastao za ${fmtPct(revenueChange)} u odnosu na ${prev.monthLabel}.`,
      });
    }

    if (costChange >= 35) {
      alerts.push({
        id: `cost-spike-${cur.monthKey}`,
        severity: "critical",
        title: `Nagli rast troškova u ${cur.monthLabel}`,
        description: `Troškovi su porasli za ${fmtPct(costChange)} u odnosu na ${prev.monthLabel} (sa ${formatCurrencyShort(prev.cost)} na ${formatCurrencyShort(cur.cost)}).`,
      });
    } else if (costChange >= 20 && isLast) {
      alerts.push({
        id: `cost-spike-mild-${cur.monthKey}`,
        severity: "warning",
        title: `Rast troškova u ${cur.monthLabel}`,
        description: `Troškovi su porasli za ${fmtPct(costChange)} u odnosu na prethodni mesec.`,
      });
    }

    const curMargin = cur.revenue > 0 ? (cur.profit / cur.revenue) * 100 : 0;
    if (curMargin < 0) {
      alerts.push({
        id: `negative-margin-${cur.monthKey}`,
        severity: "critical",
        title: `Negativna profitna marža u ${cur.monthLabel}`,
        description: `Troškovi premašuju prihod — profitna marža je ${curMargin.toFixed(1)}%.`,
      });
    }
  }

  // Koncentracija prihoda na jednom proizvodu (rizik zavisnosti)
  if (products.length > 2 && products[0].share >= 50) {
    alerts.push({
      id: "concentration-risk",
      severity: "warning",
      title: "Visoka zavisnost od jednog proizvoda",
      description: `"${products[0].product}" čini ${products[0].share.toFixed(0)}% ukupnog prihoda — razmislite o diversifikaciji ponude.`,
    });
  }

  // Najnoviji nalazi prvo, ograniči broj upozorenja da ne preplavi korisnika
  return alerts.reverse().slice(0, 8);
}

function formatCurrencyShort(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} mil. RSD`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(0)}k RSD`;
  return `${Math.round(n)} RSD`;
}

export function analyzeTransactions(transactions: Transaction[]): AnalysisResult {
  const overview = computeOverview(transactions);
  const monthly = computeMonthlyTrend(transactions);
  const allProducts = computeProductSummaries(transactions);
  const topProducts = allProducts.slice(0, 5);
  const topCustomers = computeCustomerSummaries(transactions).slice(0, 5);
  const alerts = computeAlerts(monthly, allProducts);

  return { overview, monthly, topProducts, allProducts, topCustomers, alerts };
}
