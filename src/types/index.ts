export interface Transaction {
  date: Date;
  product: string;
  customer: string;
  revenue: number;
  cost: number;
  category?: string;
}

export interface ParseResult {
  transactions: Transaction[];
  warnings: string[];
  skippedRows: number;
  fileName: string;
}

export interface MonthlyPoint {
  monthKey: string; // "2026-01"
  monthLabel: string; // "Jan 2026"
  revenue: number;
  cost: number;
  profit: number;
  transactionCount: number;
}

export interface ProductSummary {
  product: string;
  revenue: number;
  cost: number;
  profit: number;
  transactionCount: number;
  share: number; // % of total revenue
}

export interface CustomerSummary {
  customer: string;
  revenue: number;
  transactionCount: number;
}

export type AlertSeverity = "warning" | "critical" | "good";

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
}

export interface Overview {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  profitMargin: number;
  transactionCount: number;
  periodStart: Date | null;
  periodEnd: Date | null;
  avgTransactionValue: number;
}

export interface AnalysisResult {
  overview: Overview;
  monthly: MonthlyPoint[];
  topProducts: ProductSummary[];
  allProducts: ProductSummary[];
  topCustomers: CustomerSummary[];
  alerts: Alert[];
}
