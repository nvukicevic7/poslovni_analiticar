// Parsiranje brojeva i datuma iz raznih formata (srpski i engleski zapis).

export function parseNumber(raw: unknown): number | null {
  if (raw === null || raw === undefined || raw === "") return null;
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : null;

  let s = String(raw).trim();
  if (s === "") return null;

  // ukloni valutne oznake i razmake
  s = s.replace(/(rsd|din\.?|eur|€|\$|usd)/gi, "").trim();

  const hasComma = s.includes(",");
  const hasDot = s.includes(".");

  if (hasComma && hasDot) {
    // pretpostavi da je poslednji separator decimalni
    if (s.lastIndexOf(",") > s.lastIndexOf(".")) {
      // 1.234,56 -> srpski format
      s = s.replace(/\./g, "").replace(",", ".");
    } else {
      // 1,234.56 -> engleski format
      s = s.replace(/,/g, "");
    }
  } else if (hasComma) {
    // samo zarez - tretiraj kao decimalni separator ako ima <= 2 cifre posle
    const parts = s.split(",");
    if (parts[parts.length - 1].length <= 2) {
      s = s.replace(",", ".");
    } else {
      s = s.replace(/,/g, "");
    }
  }

  s = s.replace(/[^\d.+-]/g, "");
  if (s === "" || s === "-" || s === "+") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

const EXCEL_EPOCH = new Date(Date.UTC(1899, 11, 30));

export function parseDate(raw: unknown): Date | null {
  if (raw === null || raw === undefined || raw === "") return null;

  if (raw instanceof Date) {
    return Number.isNaN(raw.getTime()) ? null : raw;
  }

  if (typeof raw === "number") {
    // Excel serijski datum
    const d = new Date(EXCEL_EPOCH.getTime() + raw * 86400000);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const s = String(raw).trim();
  if (s === "") return null;

  // dd.mm.yyyy ili dd/mm/yyyy
  const dmy = s.match(/^(\d{1,2})[./](\d{1,2})[./](\d{2,4})$/);
  if (dmy) {
    let [, d, m, y] = dmy;
    const year = y.length === 2 ? Number(y) + 2000 : Number(y);
    const date = new Date(year, Number(m) - 1, Number(d));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  // yyyy-mm-dd
  const ymd = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (ymd) {
    const [, y, m, d] = ymd;
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const fallback = new Date(s);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}
