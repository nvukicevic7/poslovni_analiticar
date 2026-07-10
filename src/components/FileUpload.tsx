import { useCallback, useRef, useState } from "react";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  onLoadSample: () => void;
  isLoading: boolean;
  error: string | null;
}

export function FileUpload({ onFileSelected, onLoadSample, isLoading, error }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      onFileSelected(files[0]);
    },
    [onFileSelected]
  );

  return (
    <div className="mx-auto max-w-3xl">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`group cursor-pointer rounded-xl border-2 border-dashed px-8 py-16 text-center transition-colors ${
          isDragging
            ? "border-navy-500 bg-navy-50"
            : "border-slate-300 bg-white hover:border-navy-500 hover:bg-navy-50/50"
        }`}
        role="button"
        tabIndex={0}
        aria-label="Otpremite fajl sa poslovnim podacima"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-navy-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-navy-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.6}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
        </div>

        {isLoading ? (
          <p className="text-base font-medium text-navy-900">Učitavanje i analiza podataka…</p>
        ) : (
          <>
            <p className="text-base font-semibold text-navy-900">
              Prevucite fajl ovde ili kliknite da odaberete
            </p>
            <p className="mt-1 text-sm text-slate-500">Podržani formati: .csv, .xlsx, .xls</p>
          </>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 flex items-center justify-center gap-3 text-sm text-slate-500">
        <span className="h-px flex-1 bg-slate-200" />
        <span>ili</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={onLoadSample}
          disabled={isLoading}
          className="rounded-lg border border-navy-800 bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-50"
        >
          Isprobaj sa test podacima
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-slate-400">
        Učitava primer podataka male IT/konsalting firme za 24 meseca poslovanja.
      </p>
    </div>
  );
}
