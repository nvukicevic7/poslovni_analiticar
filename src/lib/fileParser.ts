import Papa from "papaparse";
import type { ParseResult, Transaction } from "../types";
import { buildColumnMap } from "./columns";
import { parseDate, parseNumber } from "./parseValues";

function rowsToTransactions(
  rows: Record<string, unknown>[],
  headers: string[],
  fileName: string
): ParseResult {
  const columnMap = buildColumnMap(headers);
  const warnings: string[] = [];

  if (!columnMap.date) {
    warnings.push("Nije pronađena kolona sa datumom — proverite da fajl sadrži kolonu poput 'Datum'.");
  }
  if (!columnMap.revenue) {
    warnings.push("Nije pronađena kolona sa prihodom — proverite da fajl sadrži kolonu poput 'Prihod' ili 'Cena'.");
  }
  if (!columnMap.product) {
    warnings.push("Nije pronađena kolona sa proizvodom/uslugom — grupisanje po proizvodu neće biti moguće.");
  }

  const transactions: Transaction[] = [];
  let skippedRows = 0;

  for (const row of rows) {
    const isEmpty = Object.values(row).every(
      (v) => v === undefined || v === null || String(v).trim() === ""
    );
    if (isEmpty) continue;

    const rawDate = columnMap.date ? row[columnMap.date] : undefined;
    const rawRevenue = columnMap.revenue ? row[columnMap.revenue] : undefined;
    const rawCost = columnMap.cost ? row[columnMap.cost] : undefined;

    const date = parseDate(rawDate);
    const revenue = parseNumber(rawRevenue);
    const cost = parseNumber(rawCost) ?? 0;

    if (!date || revenue === null) {
      skippedRows += 1;
      continue;
    }

    transactions.push({
      date,
      product: columnMap.product ? String(row[columnMap.product] ?? "Nepoznato").trim() || "Nepoznato" : "Nepoznato",
      customer: columnMap.customer ? String(row[columnMap.customer] ?? "Nepoznat kupac").trim() || "Nepoznat kupac" : "Nepoznat kupac",
      revenue,
      cost,
      category: columnMap.category ? String(row[columnMap.category] ?? "").trim() : undefined,
    });
  }

  if (skippedRows > 0) {
    warnings.push(`Preskočeno ${skippedRows} redova zbog nedostajućeg datuma ili prihoda.`);
  }
  if (transactions.length === 0) {
    warnings.push("Nije pronađena nijedna validna transakcija u fajlu.");
  }

  transactions.sort((a, b) => a.date.getTime() - b.date.getTime());

  return { transactions, warnings, skippedRows, fileName };
}

function parseCsv(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, unknown>>(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (results) => {
        const headers = results.meta.fields ?? [];
        resolve(rowsToTransactions(results.data, headers, file.name));
      },
      error: (err: Error) => reject(err),
    });
  });
}

async function parseExcel(file: File): Promise<ParseResult> {
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, {
    defval: "",
    raw: true,
  });
  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
  return rowsToTransactions(rows, headers, file.name);
}

export async function parseBusinessFile(file: File): Promise<ParseResult> {
  const lowerName = file.name.toLowerCase();
  if (lowerName.endsWith(".csv")) {
    return parseCsv(file);
  }
  if (lowerName.endsWith(".xlsx") || lowerName.endsWith(".xls")) {
    return parseExcel(file);
  }
  throw new Error("Nepodržan format fajla. Podržani formati su: .csv, .xlsx, .xls");
}
