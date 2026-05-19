"use client";

export default function YesNo({
  value,
  onChange,
}: {
  value: "yes" | "no" | "";
  onChange: (v: "yes" | "no") => void;
}) {
  const base = "px-6 py-2 rounded-md text-sm font-semibold border transition";
  return (
    <div className="inline-flex gap-2">
      <button
        type="button"
        onClick={() => onChange("yes")}
        className={`${base} ${value === "yes" ? "bg-brand text-white border-brand" : "bg-white text-ink border-slate-300 hover:border-brand"}`}
      >
        Yes
      </button>
      <button
        type="button"
        onClick={() => onChange("no")}
        className={`${base} ${value === "no" ? "bg-brand text-white border-brand" : "bg-white text-ink border-slate-300 hover:border-brand"}`}
      >
        No
      </button>
    </div>
  );
}
