import type { Recommendation, RecommendationPriority } from "../types";

interface RecommendationsProps {
  recommendations: Recommendation[];
}

const PRIORITY_STYLES: Record<
  RecommendationPriority,
  { border: string; badgeBg: string; badgeText: string; label: string }
> = {
  visok: {
    border: "border-l-critical",
    badgeBg: "bg-red-50",
    badgeText: "text-critical",
    label: "Visok prioritet",
  },
  srednji: {
    border: "border-l-warning",
    badgeBg: "bg-amber-50",
    badgeText: "text-warning",
    label: "Srednji prioritet",
  },
  nizak: {
    border: "border-l-navy-500",
    badgeBg: "bg-navy-50",
    badgeText: "text-navy-700",
    label: "Nizak prioritet",
  },
};

export function Recommendations({ recommendations }: RecommendationsProps) {
  if (recommendations.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-navy-900">Preporuke</h3>
      <p className="mb-4 text-sm text-slate-500">
        Konkretni koraci generisani na osnovu učitanih podataka, rangirani po prioritetu
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {recommendations.map((rec) => {
          const style = PRIORITY_STYLES[rec.priority];
          return (
            <div
              key={rec.id}
              className={`rounded-lg border border-slate-200 border-l-4 ${style.border} bg-slate-50/50 p-4`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-navy-900">{rec.title}</p>
                <span
                  className={`shrink-0 rounded-full ${style.badgeBg} ${style.badgeText} px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap`}
                >
                  {style.label}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-slate-600">{rec.explanation}</p>
              <p className="mt-2 text-sm text-slate-700">
                <span className="font-semibold text-navy-800">Predlog akcije: </span>
                {rec.action}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
