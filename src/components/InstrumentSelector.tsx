import { ALL_INSTRUMENTS, type Instrument } from "../types/index.ts";

interface Props {
  selected: Instrument[];
  onChange: (next: Instrument[]) => void;
}

export function InstrumentSelector({ selected, onChange }: Props) {
  function toggle(instrument: Instrument) {
    if (selected.includes(instrument)) {
      onChange(selected.filter((i) => i !== instrument));
    } else {
      onChange([...selected, instrument]);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm font-medium text-text-300">Instrumenti:</span>
      {ALL_INSTRUMENTS.map((instrument) => {
        const active = selected.includes(instrument);
        return (
          <button
            key={instrument}
            type="button"
            onClick={() => toggle(instrument)}
            aria-pressed={active}
            className={`rounded-full border px-3 py-1.5 text-sm font-semibold tracking-wide transition-colors ${
              active
                ? "border-accent-500 bg-accent-500/15 text-accent-400"
                : "border-border-600 bg-bg-800 text-text-500 hover:border-border-500 hover:text-text-300"
            }`}
          >
            {instrument}
          </button>
        );
      })}
    </div>
  );
}
