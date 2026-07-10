import type { Alert } from "../types";

interface AlertsProps {
  alerts: Alert[];
}

const SEVERITY_STYLES: Record<
  Alert["severity"],
  { bg: string; border: string; text: string; icon: string; label: string }
> = {
  critical: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    icon: "text-critical",
    label: "Kritično",
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800",
    icon: "text-warning",
    label: "Upozorenje",
  },
  good: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-800",
    icon: "text-good",
    label: "Pozitivno",
  },
};

function SeverityIcon({ severity }: { severity: Alert["severity"] }) {
  if (severity === "critical") {
    return (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path
          fillRule="evenodd"
          d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 8a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
  if (severity === "warning") {
    return (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path
          fillRule="evenodd"
          d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7-4a1 1 0 10-2 0v4a1 1 0 102 0V6zm-1 7a1 1 0 100 2 1 1 0 000-2z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function Alerts({ alerts }: AlertsProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-navy-900">Upozorenja i neobične promene</h3>
      <p className="mb-4 text-sm text-slate-500">
        Automatski detektovane anomalije u prihodima, troškovima i marži
      </p>

      {alerts.length === 0 ? (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <span className="text-good">
            <SeverityIcon severity="good" />
          </span>
          Nisu detektovane neobične promene u podacima. Poslovanje deluje stabilno.
        </div>
      ) : (
        <ul className="space-y-3">
          {alerts.map((alert) => {
            const style = SEVERITY_STYLES[alert.severity];
            return (
              <li
                key={alert.id}
                className={`flex gap-3 rounded-lg border ${style.border} ${style.bg} px-4 py-3`}
              >
                <span className={`mt-0.5 shrink-0 ${style.icon}`}>
                  <SeverityIcon severity={alert.severity} />
                </span>
                <div>
                  <p className={`text-sm font-semibold ${style.text}`}>{alert.title}</p>
                  <p className="mt-0.5 text-sm text-slate-600">{alert.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
