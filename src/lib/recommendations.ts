import type { AnalysisResult, Recommendation } from "../types";
import { formatCurrency, formatPercent } from "./format";

interface Candidate extends Recommendation {
  weight: number; // interna težina za rangiranje, veće = važnije
}

function last(arr: readonly number[]): number {
  return arr[arr.length - 1];
}

export function generateRecommendations(result: AnalysisResult): Recommendation[] {
  const { overview, monthly, allProducts, topProducts, topCustomers, alerts } = result;
  const candidates: Candidate[] = [];

  // 1. Profitna marža
  if (overview.profitMargin < 0) {
    candidates.push({
      id: "margin-negative",
      priority: "visok",
      weight: 100,
      title: "Poslovanje trenutno posluje sa gubitkom",
      explanation: `Ukupni troškovi (${formatCurrency(overview.totalCost)}) premašuju ostvareni prihod (${formatCurrency(overview.totalRevenue)}), što daje profitnu maržu od ${formatPercent(overview.profitMargin)}.`,
      action: "Hitno analizirajte strukturu troškova i identifikujte stavke koje se mogu smanjiti ili eliminisati u narednih 30 dana. Razmotrite i korekciju cena kod proizvoda/usluga sa najnižom maržom.",
    });
  } else if (overview.profitMargin < 15) {
    candidates.push({
      id: "margin-low",
      priority: "visok",
      weight: 80,
      title: "Niska profitna marža",
      explanation: `Profitna marža za posmatrani period iznosi ${formatPercent(overview.profitMargin)}, što je ispod uobičajenog zdravog raspona za male i srednje firme (15-30%).`,
      action: "Proverite da li cene pokrivaju stvarne troškove (uključujući režijske) i pregovarajte sa dobavljačima sa najvišim udelom u nabavnoj ceni. Razmotrite postepeno povećanje cena kod proizvoda sa niskom maržom.",
    });
  } else if (overview.profitMargin >= 30) {
    candidates.push({
      id: "margin-strong",
      priority: "nizak",
      weight: 20,
      title: "Profitna marža je iznad proseka",
      explanation: `Sa maržom od ${formatPercent(overview.profitMargin)}, poslovanje generiše solidan profit u odnosu na prihod.`,
      action: "Razmotrite reinvestiranje dela profita u rast — marketing, proširenje ponude ili dodatne kapacitete — dok je marža povoljna.",
    });
  }

  // 2. Troškovi rastu brže od prihoda (poslednja 3 meseca)
  if (monthly.length >= 4) {
    const recent = monthly.slice(-3);
    const prevBaseline = monthly[monthly.length - 4];
    const recentRevenue = recent.reduce((s, m) => s + m.revenue, 0);
    const recentCost = recent.reduce((s, m) => s + m.cost, 0);
    const baselineRevenue = prevBaseline.revenue * 3;
    const baselineCost = prevBaseline.cost * 3;
    const revenueGrowth = baselineRevenue > 0 ? ((recentRevenue - baselineRevenue) / baselineRevenue) * 100 : 0;
    const costGrowth = baselineCost > 0 ? ((recentCost - baselineCost) / baselineCost) * 100 : 0;

    if (costGrowth - revenueGrowth >= 15) {
      candidates.push({
        id: "cost-outpacing-revenue",
        priority: "visok",
        weight: 75,
        title: "Troškovi rastu brže od prihoda",
        explanation: `U poslednja tri meseca troškovi su promenili trend za ${formatPercent(costGrowth, true)} dok je prihod promenio za ${formatPercent(revenueGrowth, true)} u odnosu na prethodni period — razmak se širi.`,
        action: "Uradite reviziju fiksnih i varijabilnih troškova poslednja tri meseca i utvrdite koji su porasli van kontrole (nabavka, zakup, honorari). Postavite mesečni budžet po kategoriji troška.",
      });
    }
  }

  // 3. Opadajući trend prihoda
  if (monthly.length >= 3) {
    const recent = monthly.slice(-3).map((m) => m.revenue);
    const isDeclining = recent[0] > recent[1] && recent[1] > recent[2];
    const totalDrop = recent[0] > 0 ? ((last(recent) - recent[0]) / recent[0]) * 100 : 0;
    if (isDeclining && totalDrop <= -10) {
      candidates.push({
        id: "revenue-declining",
        priority: "visok",
        weight: 70,
        title: "Prihod opada tri meseca zaredom",
        explanation: `Prihod je padao svaki mesec u poslednja tri meseca, ukupno za ${formatPercent(totalDrop)} od ${monthly[monthly.length - 3].monthLabel} do ${monthly[monthly.length - 1].monthLabel}.`,
        action: "Pokrenite kratkoročnu marketinšku ili prodajnu akciju (popust, promocija, kontakt postojećih kupaca) i istražite razlog pada — sezonalnost, konkurencija ili gubitak kupca.",
      });
    }
  }

  // 4. Koncentracija prihoda na jednom proizvodu
  if (allProducts.length > 1 && topProducts[0]) {
    const top = topProducts[0];
    if (top.share >= 40) {
      candidates.push({
        id: "product-concentration",
        priority: top.share >= 55 ? "visok" : "srednji",
        weight: top.share >= 55 ? 65 : 45,
        title: "Visoka zavisnost od jednog proizvoda/usluge",
        explanation: `"${top.product}" čini ${formatPercent(top.share)} ukupnog prihoda. Gubitak potražnje za ovim proizvodom bi značajno ugrozio poslovanje.`,
        action: "Aktivno promovišite ostale proizvode/usluge iz ponude i razmotrite razvoj novog proizvoda kako biste smanjili zavisnost od jedne stavke.",
      });
    }
  }

  // 5. Koncentracija prihoda na jednom kupcu
  if (topCustomers.length > 1 && overview.totalRevenue > 0) {
    const topCustomerShare = (topCustomers[0].revenue / overview.totalRevenue) * 100;
    if (topCustomerShare >= 25) {
      candidates.push({
        id: "customer-concentration",
        priority: topCustomerShare >= 40 ? "visok" : "srednji",
        weight: topCustomerShare >= 40 ? 68 : 42,
        title: "Rizik zavisnosti od jednog kupca",
        explanation: `Kupac "${topCustomers[0].customer}" čini ${formatPercent(topCustomerShare)} ukupnog prihoda. Gubitak ovog kupca bi imao veliki uticaj na poslovanje.`,
        action: "Radite na proširenju baze kupaca kroz nove prodajne kanale i negujte odnos sa najvećim kupcem kroz redovnu komunikaciju kako biste smanjili rizik njegovog odlaska.",
      });
    }
  }

  // 6. Proizvodi/usluge sa negativnim profitom
  const unprofitable = allProducts.filter((p) => p.profit < 0);
  if (unprofitable.length > 0) {
    const names = unprofitable
      .slice(0, 3)
      .map((p) => `"${p.product}"`)
      .join(", ");
    candidates.push({
      id: "unprofitable-products",
      priority: "srednji",
      weight: 55,
      title: `${unprofitable.length} proizvod${unprofitable.length === 1 ? "" : "a/usluge"} posluje sa gubitkom`,
      explanation: `${names}${unprofitable.length > 3 ? " i drugi" : ""} generišu negativan profit u posmatranom periodu (trošak premašuje prihod).`,
      action: "Preispitajte cenu ovih proizvoda/usluga ili nabavnu/operativnu cenu koja ih prati. Ako korekcija nije moguća, razmotrite ukidanje ponude.",
    });
  }

  // 7. Nizak broj transakcija po kupcu (mala učestalost ponovne kupovine)
  if (overview.transactionCount > 0 && topCustomers.length >= 3) {
    const avgTxPerCustomer =
      topCustomers.reduce((s, c) => s + c.transactionCount, 0) / topCustomers.length;
    if (avgTxPerCustomer < 2) {
      candidates.push({
        id: "low-repeat-purchase",
        priority: "nizak",
        weight: 30,
        title: "Niska stopa ponovljenih kupovina kod najvećih kupaca",
        explanation: `Najveći kupci u proseku imaju manje od 2 transakcije u posmatranom periodu, što ukazuje na slabu lojalnost ili nedostatak follow-up prodaje.`,
        action: "Uvedite program lojalnosti, redovne podsetnike ili paket ponude kako biste podstakli ponovljene kupovine kod postojećih kupaca.",
      });
    }
  }

  // 8. Kritična/upozoravajuća aktivna upozorenja (iz Alerts modula)
  const criticalAlerts = alerts.filter((a) => a.severity === "critical");
  if (criticalAlerts.length >= 2) {
    candidates.push({
      id: "multiple-critical-alerts",
      priority: "visok",
      weight: 60,
      title: "Više kritičnih upozorenja u istom periodu",
      explanation: `Detektovano je ${criticalAlerts.length} kritičnih upozorenja (nagli padovi prihoda i/ili rast troškova) — pogledajte sekciju "Upozorenja" za detalje po mesecima.`,
      action: "Napravite mesečni pregled finansija (prihod, trošak, profit) kao rutinu kako biste ranije uočavali slične anomalije i brže reagovali.",
    });
  }

  // Osnovna preporuka koja se uvek prikazuje ako ima dovoljno podataka o profitabilnim proizvodima
  if (topProducts.length > 0) {
    const best = topProducts[0];
    candidates.push({
      id: "double-down-best-seller",
      priority: "nizak",
      weight: 15,
      title: `Iskoristite potencijal proizvoda "${best.product}"`,
      explanation: `Ovo je vaš proizvod/usluga sa najvećim prihodom (${formatCurrency(best.revenue)}) i profitom od ${formatCurrency(best.profit)}.`,
      action: "Razmotrite dodatna ulaganja u marketing ili prodaju ovog proizvoda, ili kreiranje sličnih/dopunskih ponuda za iste kupce.",
    });
  }

  // Fallback ako nema dovoljno pravila koja se aktiviraju (zdravo poslovanje, malo podataka)
  if (candidates.length < 4) {
    candidates.push({
      id: "diversify-general",
      priority: "nizak",
      weight: 10,
      title: "Nastavite da pratite ključne pokazatelje",
      explanation: "Trenutni podaci ne ukazuju na značajne probleme, ali redovno praćenje prihoda, troškova i marže po mesecu pomaže da se rano uoče promene.",
      action: "Postavite mesečni podsetnik za pregled ovog izveštaja i upoređivanje sa prethodnim periodom.",
    });
    candidates.push({
      id: "cash-reserve-general",
      priority: "nizak",
      weight: 8,
      title: "Formirajte rezervu za sezonske oscilacije",
      explanation: "Većina malih i srednjih firmi ima mesece sa slabijom prodajom (praznici, letnji period).",
      action: "Izdvojite deo profita iz jačih meseci kao rezervu za pokrivanje fiksnih troškova u slabijim mesecima.",
    });
  }

  const sorted = candidates.sort((a, b) => b.weight - a.weight);

  // ukloni interno polje `weight` pre vraćanja i ograniči na 4-6 preporuka
  return sorted.slice(0, 6).map((c) => ({
    id: c.id,
    priority: c.priority,
    title: c.title,
    explanation: c.explanation,
    action: c.action,
  }));
}
