import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ProductSummary } from "../types";
import { formatCompactCurrency, formatCurrency, formatPercent } from "../lib/format";

interface TopProductsProps {
  products: ProductSummary[];
}

const BAR_COLOR = "#2a78d6";

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const p: ProductSummary = payload[0].payload;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-sm font-semibold text-navy-900">{p.product}</p>
      <p className="mt-1 text-xs text-slate-500">Prihod: {formatCurrency(p.revenue)}</p>
      <p className="text-xs text-slate-500">Profit: {formatCurrency(p.profit)}</p>
      <p className="text-xs text-slate-500">Udeo u prihodu: {formatPercent(p.share)}</p>
    </div>
  );
}

export function TopProducts({ products }: TopProductsProps) {
  if (products.length === 0) {
    return null;
  }

  const chartData = [...products].reverse(); // najveći na vrhu horizontalnog grafikona

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-navy-900">Top 5 proizvoda/usluga po prihodu</h3>
      <p className="mb-4 text-sm text-slate-500">Rangirano po ostvarenom prihodu u posmatranom periodu</p>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 4, right: 48, left: 4, bottom: 4 }}
            barCategoryGap={12}
          >
            <CartesianGrid horizontal={false} stroke="#e1e0d9" strokeDasharray="0" />
            <XAxis
              type="number"
              tickFormatter={(v) => formatCompactCurrency(v)}
              stroke="#898781"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: "#c3c2b7" }}
            />
            <YAxis
              type="category"
              dataKey="product"
              width={150}
              stroke="#52514e"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(42,120,214,0.06)" }} />
            <Bar dataKey="revenue" radius={[0, 4, 4, 0]} maxBarSize={24}>
              {chartData.map((entry) => (
                <Cell key={entry.product} fill={BAR_COLOR} />
              ))}
              <LabelList
                dataKey="revenue"
                position="right"
                formatter={(v: ReactNode) => formatCompactCurrency(Number(v))}
                style={{ fill: "#0b0b0b", fontSize: 12, fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
              <th className="py-2 pr-4 font-medium">#</th>
              <th className="py-2 pr-4 font-medium">Proizvod/Usluga</th>
              <th className="py-2 pr-4 font-medium text-right">Prihod</th>
              <th className="py-2 pr-4 font-medium text-right">Profit</th>
              <th className="py-2 font-medium text-right">Udeo</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p.product} className="border-b border-slate-100 last:border-0">
                <td className="py-2 pr-4 text-slate-400">{i + 1}</td>
                <td className="py-2 pr-4 font-medium text-navy-900">{p.product}</td>
                <td className="py-2 pr-4 text-right tabular-nums">{formatCurrency(p.revenue)}</td>
                <td
                  className={`py-2 pr-4 text-right tabular-nums ${
                    p.profit >= 0 ? "text-good" : "text-critical"
                  }`}
                >
                  {formatCurrency(p.profit)}
                </td>
                <td className="py-2 text-right tabular-nums text-slate-500">
                  {formatPercent(p.share)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
