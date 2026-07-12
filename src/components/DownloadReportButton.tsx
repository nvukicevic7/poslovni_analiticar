import { useState } from "react";
import { exportReportToPdf } from "../lib/pdfExport";

interface DownloadReportButtonProps {
  targetId: string;
  fileName: string;
}

export function DownloadReportButton({ targetId, fileName }: DownloadReportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function handleClick() {
    const el = document.getElementById(targetId);
    if (!el) return;
    setIsExporting(true);
    setHasError(false);
    try {
      await exportReportToPdf(el, fileName);
    } catch {
      setHasError(true);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleClick}
        disabled={isExporting}
        className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:opacity-60"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        {isExporting ? "Priprema PDF-a…" : "Preuzmi izveštaj (PDF)"}
      </button>
      {hasError && <span className="text-xs text-red-300">Greška — pokušajte ponovo.</span>}
    </div>
  );
}
