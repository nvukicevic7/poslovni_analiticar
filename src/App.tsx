import { useMemo, useState } from "react";
import { FileUpload } from "./components/FileUpload";
import { OverviewCards } from "./components/OverviewCards";
import { TopProducts } from "./components/TopProducts";
import { TrendChart } from "./components/TrendChart";
import { Alerts } from "./components/Alerts";
import { QuestionBox } from "./components/QuestionBox";
import { BusinessHealthBadge } from "./components/BusinessHealthBadge";
import { Recommendations } from "./components/Recommendations";
import { DownloadReportButton } from "./components/DownloadReportButton";
import { parseBusinessFile } from "./lib/fileParser";
import { analyzeTransactions } from "./lib/analysis";
import { suggestedQuestions } from "./lib/qa";
import { computeBusinessHealth } from "./lib/health";
import { generateRecommendations } from "./lib/recommendations";
import type { ParseResult } from "./types";

const REPORT_ELEMENT_ID = "report-content";

function Header({ fileName, onReset, showDownload }: { fileName: string | null; onReset: () => void; showDownload: boolean }) {
  return (
    <header className="border-b border-navy-800 bg-navy-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5l4.5-4.5 4 4L21 4.5M21 4.5H15M21 4.5v6M3 20.25h18" />
            </svg>
          </div>
          <div>
            <p className="text-base font-semibold text-white leading-tight">AI Poslovni Analitičar</p>
            <p className="text-xs text-navy-100/70 leading-tight">Analitika za male i srednje firme</p>
          </div>
        </div>
        {fileName && (
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-navy-100/80 sm:inline">{fileName}</span>
            {showDownload && (
              <DownloadReportButton targetId={REPORT_ELEMENT_ID} fileName="poslovni-izvestaj.pdf" />
            )}
            <button
              onClick={onReset}
              className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Učitaj drugi fajl
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default function App() {
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analysis = useMemo(
    () => (parseResult ? analyzeTransactions(parseResult.transactions) : null),
    [parseResult]
  );

  const health = useMemo(() => (analysis ? computeBusinessHealth(analysis) : null), [analysis]);
  const recommendations = useMemo(
    () => (analysis ? generateRecommendations(analysis) : []),
    [analysis]
  );

  async function handleFile(file: File) {
    setIsLoading(true);
    setError(null);
    try {
      const result = await parseBusinessFile(file);
      if (result.transactions.length === 0) {
        setError(
          result.warnings.join(" ") ||
            "Nije moguće pronaći validne podatke u fajlu. Proverite format i pokušajte ponovo."
        );
        setIsLoading(false);
        return;
      }
      setParseResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Došlo je do greške prilikom čitanja fajla.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLoadSample() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/test-podaci.csv");
      const blob = await response.blob();
      const file = new File([blob], "test-podaci.csv", { type: "text/csv" });
      await handleFile(file);
    } catch {
      setError("Nije moguće učitati test podatke.");
      setIsLoading(false);
    }
  }

  function handleReset() {
    setParseResult(null);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-navy-50">
      <Header fileName={parseResult?.fileName ?? null} onReset={handleReset} showDownload={!!analysis} />

      <main className="mx-auto max-w-6xl px-6 py-10">
        {!analysis ? (
          <div className="py-10">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-navy-900">
                Razumite svoje poslovanje za par sekundi
              </h1>
              <p className="mt-3 text-base text-slate-500">
                Otpremite Excel ili CSV fajl sa podacima o prodaji i troškovima — aplikacija automatski
                izračunava prihod, profit, trendove i upozorava vas na neobične promene.
              </p>
            </div>
            <FileUpload
              onFileSelected={handleFile}
              onLoadSample={handleLoadSample}
              isLoading={isLoading}
              error={error}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {parseResult && parseResult.warnings.length > 0 && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {parseResult.warnings.join(" ")}
              </div>
            )}

            <div id={REPORT_ELEMENT_ID} className="space-y-6 bg-navy-50">
              {health && <BusinessHealthBadge health={health} />}

              <OverviewCards overview={analysis.overview} />

              <Alerts alerts={analysis.alerts} />

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <TrendChart monthly={analysis.monthly} />
                <TopProducts products={analysis.topProducts} />
              </div>

              <Recommendations recommendations={recommendations} />
            </div>

            <QuestionBox
              transactions={parseResult!.transactions}
              suggestions={suggestedQuestions(analysis)}
            />
          </div>
        )}
      </main>

      <footer className="mx-auto max-w-6xl px-6 pb-10 pt-4 text-center text-xs text-slate-400">
        AI Poslovni Analitičar — svi podaci se obrađuju lokalno u vašem pregledaču, ništa se ne šalje na server.
      </footer>
    </div>
  );
}
