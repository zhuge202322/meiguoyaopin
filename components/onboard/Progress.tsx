export default function Progress({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs font-semibold text-ink-soft">
        <span>Step {step} of {total}</span>
        <span>{pct}% Complete</span>
      </div>
      <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
        <div className="h-full bg-brand transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-6 flex items-center justify-center gap-3">
        {Array.from({ length: total }).map((_, i) => {
          const n = i + 1;
          const active = n === step;
          const done = n < step;
          return (
            <div
              key={n}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition
                ${active ? "bg-brand text-white" : done ? "bg-brand text-white" : "bg-slate-300 text-white"}`}
            >
              {n}
            </div>
          );
        })}
      </div>
    </div>
  );
}
