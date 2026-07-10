import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlyPoint } from "../types";
import { formatCompactCurrency, formatCurrency } from "../lib/format";

interface TrendChartProps {
  monthly: MonthlyPoint[];
}

const REVENUE_COLOR = "#2a78d6";
const COST_COLOR = "#e34948";

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-sm font-semibold text-navy-900">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.dataKey} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: <span className="font-medium">{formatCurrency(entry.value)}</span>
        </p>
      ))}
    </div>
  );
}

export function TrendChart({ monthly }: TrendChartProps) {
  if (monthly.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-navy-900">Trend prodaje kroz vreme</h3>
      <p className="mb-4 text-sm text-slate-500">Prihod i troškovi po mesecima</p>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthly} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#e1e0d9" />
            <XAxis
              dataKey="monthLabel"
              stroke="#898781"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: "#c3c2b7" }}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis
              tickFormatter={(v) => formatCompactCurrency(v)}
              stroke="#898781"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={64}
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              height={32}
              iconType="plainline"
              wrapperStyle={{ fontSize: 13, color: "#52514e" }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              name="Prihod"
              stroke={REVENUE_COLOR}
              strokeWidth={2}
              dot={{ r: 3, fill: REVENUE_COLOR, strokeWidth: 2, stroke: "#fcfcfb" }}
              activeDot={{ r: 5, strokeWidth: 2, stroke: "#fcfcfb" }}
            />
            <Line
              type="monotone"
              dataKey="cost"
              name="Troškovi"
              stroke={COST_COLOR}
              strokeWidth={2}
              dot={{ r: 3, fill: COST_COLOR, strokeWidth: 2, stroke: "#fcfcfb" }}
              activeDot={{ r: 5, strokeWidth: 2, stroke: "#fcfcfb" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
