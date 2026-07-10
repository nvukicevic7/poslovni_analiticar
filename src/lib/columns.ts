// Normalizacija naziva kolona: prepoznaje srpske (latinica/ćirilica) i
// engleske varijante naziva kolona iz Excel/CSV fajlova.

function stripDiacritics(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "dj");
}

export function normalizeHeader(header: string): string {
  return stripDiacritics(String(header).trim().toLowerCase()).replace(/[_\s./-]+/g, " ").trim();
}

const FIELD_ALIASES: Record<string, string[]> = {
  date: [
    "datum",
    "datum prodaje",
    "datum transakcije",
    "date",
    "datum kupovine",
    "vreme",
  ],
  product: [
    "proizvod",
    "usluga",
    "proizvod usluga",
    "artikal",
    "stavka",
    "product",
    "item",
    "service",
    "naziv proizvoda",
    "naziv artikla",
  ],
  customer: [
    "kupac",
    "klijent",
    "customer",
    "client",
    "kupac klijent",
    "naziv kupca",
  ],
  category: ["kategorija", "category", "grupa", "tip"],
  quantity: ["kolicina", "kom", "quantity", "qty", "komada"],
  revenue: [
    "prihod",
    "prodaja",
    "iznos",
    "iznos prodaje",
    "revenue",
    "sales",
    "amount",
    "ukupno",
    "ukupna prodaja",
    "cena",
    "vrednost",
    "prihod rsd",
  ],
  cost: [
    "trosak",
    "troskovi",
    "cost",
    "costs",
    "expense",
    "expenses",
    "nabavna cena",
    "nabavna vrednost",
    "rashod",
    "trosak rsd",
  ],
};

export type FieldKey = keyof typeof FIELD_ALIASES;

export function matchField(header: string): FieldKey | null {
  const norm = normalizeHeader(header);
  for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
    if (aliases.includes(norm)) return field as FieldKey;
  }
  // fallback: partial match (e.g. "datum prometa" contains "datum")
  for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
    if (aliases.some((a) => norm.includes(a) || a.includes(norm))) {
      return field as FieldKey;
    }
  }
  return null;
}

export function buildColumnMap(headers: string[]): Partial<Record<FieldKey, string>> {
  const map: Partial<Record<FieldKey, string>> = {};
  for (const h of headers) {
    const field = matchField(h);
    if (field && !map[field]) {
      map[field] = h;
    }
  }
  return map;
}
