import type { AnalysisResult, MonthlyPoint, Transaction } from "../types";
import { computeAlerts, computeMonthlyTrend, computeOverview, computeProductSummaries } from "./analysis";
import { formatCurrency, formatPercent } from "./format";

const MONTH_NAMES: { names: string[]; index: number }[] = [
  { names: ["januar"], index: 0 },
  { names: ["februar"], index: 1 },
  { names: ["mart"], index: 2 },
  { names: ["april"], index: 3 },
  { names: ["maj"], index: 4 },
  { names: ["jun"], index: 5 },
  { names: ["jul"], index: 6 },
  { names: ["avgust"], index: 7 },
  { names: ["septembar"], index: 8 },
  { names: ["oktobar"], index: 9 },
  { names: ["novembar"], index: 10 },
  { names: ["decembar"], index: 11 },
];

function stripDiacritics(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function findMonthsInText(text: string): number[] {
  const norm = stripDiacritics(text.toLowerCase());
  const found: number[] = [];
  for (const { names, index } of MONTH_NAMES) {
    for (const name of names) {
      const re = new RegExp(`\\b${name}\\w*\\b`, "i");
      if (re.test(norm)) {
        found.push(index);
        break;
      }
    }
  }
  return found;
}

function findYearsInText(text: string): number[] {
  const matches = text.match(/\b(20\d{2})\b/g);
  return matches ? matches.map(Number) : [];
}

function monthsForYearMonth(monthly: MonthlyPoint[], monthIdx: number, year?: number): MonthlyPoint[] {
  return monthly.filter((m) => {
    const [y, mm] = m.monthKey.split("-").map(Number);
    return mm - 1 === monthIdx && (year === undefined || y === year);
  });
}

function resolveMonthPoint(
  monthly: MonthlyPoint[],
  monthIdx: number,
  year: number | undefined
): MonthlyPoint | null {
  const matches = monthsForYearMonth(monthly, monthIdx, year);
  if (matches.length === 0) return null;
  // ako je više godina sa istim mesecom a godina nije navedena, uzmi najskoriju
  return matches.sort((a, b) => b.monthKey.localeCompare(a.monthKey))[0];
}

function monthLabelFor(monthIdx: number, year?: number): string {
  const names = [
    "januaru",
    "februaru",
    "martu",
    "aprilu",
    "maju",
    "junu",
    "julu",
    "avgustu",
    "septembru",
    "oktobru",
    "novembru",
    "decembru",
  ];
  return year ? `${names[monthIdx]} ${year}.` : names[monthIdx];
}

const INTENTS = {
  revenue: ["zaradio", "zaradila", "zarada", "prihod", "prihoda", "prodaja", "prodao", "prodala", "koliko sam prodao"],
  cost: ["trosak", "troskov", "potrosio", "potrosila", "rashod", "izdatak", "izdataka"],
  profit: ["profit", "dobit", "neto"],
  margin: ["marz", "marg"],
  topProduct: ["najprodavaniji", "najbolji proizvod", "top proizvod", "koji proizvod", "koja usluga", "najtrazeniji"],
  topCustomer: ["najveci kupac", "najbolji kupac", "koji kupac", "koji klijent", "najveci klijent"],
  count: ["koliko transakcija", "broj transakcija", "koliko porudzbina", "koliko prodaja je bilo"],
  anomalies: ["neobicno", "anomalij", "upozorenj", "problem", "pad", "sumnjiv"],
  average: ["prosecn", "prosek"],
};

function textHasAny(text: string, keywords: string[]): boolean {
  const norm = stripDiacritics(text.toLowerCase());
  return keywords.some((k) => norm.includes(stripDiacritics(k)));
}

export function answerQuestion(question: string, transactions: Transaction[]): string {
  if (transactions.length === 0) {
    return "Prvo učitajte fajl sa podacima da bih mogao/la da odgovorim na pitanje.";
  }

  const trimmed = question.trim();
  if (trimmed.length === 0) {
    return "Postavite pitanje o svojim podacima, na primer: „Koliko sam zaradio u martu?”";
  }

  const monthly = computeMonthlyTrend(transactions);
  const overview = computeOverview(transactions);
  const products = computeProductSummaries(transactions);

  const months = findMonthsInText(trimmed);
  const years = findYearsInText(trimmed);
  const year = years[0];

  const normQuestion = stripDiacritics(trimmed.toLowerCase());
  const referencesRelativeMonth = /(proslog?|poslednj\w+|ovog?|trenutn\w+)\s+mesec/.test(normQuestion);

  // Relativno „prošli/ovaj/poslednji mesec” — uzmi poslednji mesec iz podataka
  if (referencesRelativeMonth && months.length === 0 && monthly.length > 0) {
    const point = monthly[monthly.length - 1];
    const [y, mm] = point.monthKey.split("-").map(Number);
    const label = monthLabelFor(mm - 1, y);

    if (textHasAny(trimmed, INTENTS.cost)) {
      return `U ${label} ukupni troškovi su iznosili ${formatCurrency(point.cost)}, kroz ${point.transactionCount} transakcija.`;
    }
    if (textHasAny(trimmed, INTENTS.profit)) {
      return `Profit u ${label} iznosio je ${formatCurrency(point.profit)}.`;
    }
    return `U ${label} (poslednji mesec u podacima) ste ostvarili prihod od ${formatCurrency(point.revenue)} kroz ${point.transactionCount} transakcija (profit: ${formatCurrency(point.profit)}).`;
  }

  // Pitanje o konkretnom mesecu
  if (months.length > 0) {
    const monthIdx = months[0];
    const point = resolveMonthPoint(monthly, monthIdx, year);

    if (!point) {
      return `Nemam podatke za ${monthLabelFor(monthIdx, year)} u učitanom fajlu. Proverite da li period koji ste naveli postoji u podacima.`;
    }

    const label = monthLabelFor(monthIdx, Number(point.monthKey.split("-")[0]));

    if (textHasAny(trimmed, INTENTS.cost)) {
      return `U ${label} ukupni troškovi su iznosili ${formatCurrency(point.cost)}, kroz ${point.transactionCount} transakcija.`;
    }
    if (textHasAny(trimmed, INTENTS.profit)) {
      const marginTxt = point.revenue > 0 ? ` (marža ${formatPercent((point.profit / point.revenue) * 100)})` : "";
      return `Profit u ${label} iznosio je ${formatCurrency(point.profit)}${marginTxt}.`;
    }
    if (textHasAny(trimmed, INTENTS.margin)) {
      const margin = point.revenue > 0 ? (point.profit / point.revenue) * 100 : 0;
      return `Profitna marža u ${label} bila je ${formatPercent(margin)} (prihod ${formatCurrency(point.revenue)}, profit ${formatCurrency(point.profit)}).`;
    }
    // podrazumevano: prihod/zarada
    return `U ${label} ste ostvarili prihod od ${formatCurrency(point.revenue)} kroz ${point.transactionCount} transakcija (profit: ${formatCurrency(point.profit)}).`;
  }

  if (textHasAny(trimmed, INTENTS.topProduct)) {
    if (products.length === 0) return "Nema dovoljno podataka o proizvodima/uslugama.";
    const top = products[0];
    return `Najprodavaniji proizvod/usluga je „${top.product}” sa ostvarenim prihodom od ${formatCurrency(top.revenue)}, što čini ${formatPercent(top.share)} ukupnog prihoda.`;
  }

  if (textHasAny(trimmed, INTENTS.topCustomer)) {
    const customerMap = new Map<string, number>();
    for (const t of transactions) {
      customerMap.set(t.customer, (customerMap.get(t.customer) ?? 0) + t.revenue);
    }
    const sorted = Array.from(customerMap.entries()).sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) return "Nema dovoljno podataka o kupcima.";
    const [name, revenue] = sorted[0];
    return `Vaš najveći kupac je „${name}” sa ukupnim prihodom od ${formatCurrency(revenue)}.`;
  }

  if (textHasAny(trimmed, INTENTS.count)) {
    return `U učitanom periodu zabeleženo je ukupno ${overview.transactionCount} transakcija.`;
  }

  if (textHasAny(trimmed, INTENTS.anomalies)) {
    const alerts = computeAlerts(monthly, products);
    if (alerts.length === 0) {
      return "Trenutno nisu detektovane neobične promene u podacima — poslovanje deluje stabilno.";
    }
    return `Detektovano je ${alerts.length} upozorenj${alerts.length === 1 ? "e" : "a"}: ${alerts
      .slice(0, 3)
      .map((a) => a.title)
      .join("; ")}${alerts.length > 3 ? "…" : ""}. Pogledajte sekciju „Upozorenja” za detalje.`;
  }

  if (textHasAny(trimmed, INTENTS.average)) {
    return `Prosečna vrednost transakcije je ${formatCurrency(overview.avgTransactionValue)}.`;
  }

  if (textHasAny(trimmed, INTENTS.margin)) {
    return `Ukupna profitna marža za ceo period je ${formatPercent(overview.profitMargin)} (prihod ${formatCurrency(overview.totalRevenue)}, profit ${formatCurrency(overview.totalProfit)}).`;
  }

  if (textHasAny(trimmed, INTENTS.cost)) {
    return `Ukupni troškovi za ceo učitani period iznose ${formatCurrency(overview.totalCost)}.`;
  }

  if (textHasAny(trimmed, INTENTS.profit)) {
    return `Ukupan profit za ceo učitani period je ${formatCurrency(overview.totalProfit)} (marža ${formatPercent(overview.profitMargin)}).`;
  }

  if (textHasAny(trimmed, INTENTS.revenue)) {
    return `Ukupan prihod za ceo učitani period je ${formatCurrency(overview.totalRevenue)}.`;
  }

  // podrazumevani odgovor - opšti pregled
  return `Nisam sigurna/siguran tačno šta vas zanima, ali evo opšteg pregleda: ukupan prihod je ${formatCurrency(
    overview.totalRevenue
  )}, ukupni troškovi ${formatCurrency(overview.totalCost)}, profit ${formatCurrency(
    overview.totalProfit
  )}. Pokušajte da pitate npr. „Koliko sam zaradio u martu?” ili „Koji je najprodavaniji proizvod?”.`;
}

export function suggestedQuestions(_result: AnalysisResult): string[] {
  return [
    "Koliko sam zaradio prošlog meseca?",
    "Koji je najprodavaniji proizvod?",
    "Koji je moj najveći kupac?",
    "Da li ima neobičnih promena u poslovanju?",
    "Kolika je moja profitna marža?",
  ];
}
