import type { BusinessHealth, HealthLabel } from "../types";

interface BusinessHealthBadgeProps {
  health: BusinessHealth;
}

const LABEL_STYLES: Record<HealthLabel, { ring: string; text: string; bg: string; track: string }> = {
  "Odlično": { ring: "#0ca30c", text: "text-good", bg: "bg-green-50", track: "#c9ecc9" },
  "Dobro": { ring: "#2a78d6", text: "text-navy-700", bg: "bg-navy-50", track: "#cfe0f5" },
  "Osrednje": { ring: "#eda100", text: "text-warning", bg: "bg-amber-50", track: "#f6ddab" },
  "Zabrinjavajuće": { ring: "#d03b3b", text: "text-critical", bg: "bg-red-50", track: "#f3c6c6" },
};

function ScoreRing({ score, color, track }: { score: number; color: string; track: string }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <svg width="76" height="76" viewBox="0 0 76 76" className="shrink-0" role="img" aria-label={`Ocena zdravlja biznisa: ${score} od 100`}>
      <circle cx="38" cy="38" r={radius} fill="none" stroke={track} strokeWidth="7" />
      <circle
        cx="38"
        cy="38"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 38 38)"
      />
      <text x="38" y="43" textAnchor="middle" fontSize="20" fontWeight="600" fill="#0b0b0b">
        {score}
      </text>
    </svg>
  );
}

export function BusinessHealthBadge({ health }: BusinessHealthBadgeProps) {
  const style = LABEL_STYLES[health.label];

  return (
    <div className={`rounded-xl border border-slate-200 ${style.bg} p-5 shadow-sm`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <ScoreRing score={health.score} color={style.ring} track={style.track} />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-navy-900">Zdravlje biznisa</h2>
            <span className={`rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold ${style.text}`}>
              {health.label}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600">{health.summary}</p>
          {health.factors.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {health.factors.map((f) => (
                <li key={f} className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                  {f}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
