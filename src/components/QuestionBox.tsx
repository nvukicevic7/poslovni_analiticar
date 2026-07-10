import { useState } from "react";
import type { Transaction } from "../types";
import { answerQuestion } from "../lib/qa";

interface QAEntry {
  question: string;
  answer: string;
}

interface QuestionBoxProps {
  transactions: Transaction[];
  suggestions: string[];
}

export function QuestionBox({ transactions, suggestions }: QuestionBoxProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<QAEntry[]>([]);

  const ask = (question: string) => {
    const q = question.trim();
    if (!q) return;
    const answer = answerQuestion(q, transactions);
    setHistory((prev) => [...prev, { question: q, answer }]);
    setInput("");
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-navy-900">Postavite pitanje o svojim podacima</h3>
      <p className="mb-4 text-sm text-slate-500">
        Pitajte prirodnim jezikom, npr. „Koliko sam zaradio u martu?”
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Postavite pitanje…"
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-navy-900 placeholder:text-slate-400 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-100"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
        >
          Pitaj
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => ask(s)}
            className="rounded-full border border-navy-100 bg-navy-50 px-3 py-1 text-xs font-medium text-navy-700 transition-colors hover:bg-navy-100"
          >
            {s}
          </button>
        ))}
      </div>

      {history.length > 0 && (
        <div className="mt-5 space-y-4 border-t border-slate-100 pt-4">
          {[...history].reverse().map((entry, i) => (
            <div key={i}>
              <p className="text-sm font-semibold text-navy-900">{entry.question}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{entry.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
