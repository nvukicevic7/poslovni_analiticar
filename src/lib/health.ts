import type { AnalysisResult, BusinessHealth, HealthLabel } from "../types";
import { formatPercent } from "./format";

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function labelForScore(score: number): HealthLabel {
  if (score >= 75) return "Odlično";
  if (score >= 55) return "Dobro";
  if (score >= 35) return "Osrednje";
  return "Zabrinjavajuće";
}

export function computeBusinessHealth(result: AnalysisResult): BusinessHealth {
  const { overview, monthly, topProducts, topCustomers, alerts } = result;
  const factors: string[] = [];
  let score = 65; // neutralna polazna tačka

  // Profitna marža — najveći uticaj
  if (overview.profitMargin < 0) {
    score -= 30;
    factors.push(`Negativna profitna marža (${formatPercent(overview.profitMargin)})`);
  } else if (overview.profitMargin < 15) {
    score -= 12;
    factors.push(`Niska profitna marža (${formatPercent(overview.profitMargin)})`);
  } else if (overview.profitMargin >= 30) {
    score += 15;
    factors.push(`Visoka profitna marža (${formatPercent(overview.profitMargin)})`);
  } else {
    score += 5;
    factors.push(`Zdrava profitna marža (${formatPercent(overview.profitMargin)})`);
  }

  // Trend prihoda — poređenje poslednjeg meseca sa prethodnim
  if (monthly.length >= 2) {
    const last = monthly[monthly.length - 1];
    const prev = monthly[monthly.length - 2];
    const change = prev.revenue > 0 ? ((last.revenue - prev.revenue) / prev.revenue) * 100 : 0;
    if (change >= 10) {
      score += 10;
      factors.push(`Prihod raste (${formatPercent(change, true)} u odnosu na prethodni mesec)`);
    } else if (change <= -15) {
      score -= 18;
      factors.push(`Prihod naglo opada (${formatPercent(change, true)} u odnosu na prethodni mesec)`);
    } else if (change <= -5) {
      score -= 8;
      factors.push(`Prihod blago opada (${formatPercent(change, true)} u odnosu na prethodni mesec)`);
    }
  }

  // Upozorenja
  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const warningCount = alerts.filter((a) => a.severity === "warning").length;
  if (criticalCount > 0) {
    score -= Math.min(25, criticalCount * 8);
    factors.push(`${criticalCount} kritičn${criticalCount === 1 ? "o" : "a"} upozorenj${criticalCount === 1 ? "e" : "a"} u periodu`);
  }
  if (warningCount > 0) {
    score -= Math.min(10, warningCount * 3);
  }
  if (criticalCount === 0 && warningCount === 0 && alerts.length === 0) {
    factors.push("Nema detektovanih anomalija u podacima");
  }

  // Koncentracija rizika (proizvod i kupac)
  if (topProducts[0] && topProducts[0].share >= 55) {
    score -= 8;
    factors.push(`Visoka zavisnost od jednog proizvoda (${formatPercent(topProducts[0].share)})`);
  }
  if (topCustomers[0] && overview.totalRevenue > 0) {
    const share = (topCustomers[0].revenue / overview.totalRevenue) * 100;
    if (share >= 40) {
      score -= 8;
      factors.push(`Visoka zavisnost od jednog kupca (${formatPercent(share)})`);
    }
  }

  score = Math.round(clamp(score, 0, 100));
  const label = labelForScore(score);

  const summaries: Record<HealthLabel, string> = {
    "Odlično": "Poslovanje pokazuje snažnu profitabilnost i stabilan rast, bez značajnih upozorenja.",
    "Dobro": "Poslovanje je stabilno i profitabilno, uz par oblasti koje vredi pratiti.",
    "Osrednje": "Poslovanje ima uočljive slabosti — pogledajte preporuke ispod za konkretne korake.",
    "Zabrinjavajuće": "Podaci ukazuju na ozbiljne probleme u profitabilnosti ili trendu prihoda koje treba hitno rešiti.",
  };

  return {
    score,
    label,
    summary: summaries[label],
    factors: factors.slice(0, 4),
  };
}
