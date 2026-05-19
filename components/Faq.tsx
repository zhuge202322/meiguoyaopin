"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export type FaqItem = { q: string; a: string };

export default function Faq({ items, title }: { items: FaqItem[]; title?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="container py-16">
      {title && <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10">{title}</h2>}
      <div className="mx-auto max-w-3xl divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-card">
        {items.map((it, i) => {
          const isOpen = open === i;
          return (
            <div key={i}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-semibold text-ink">{it.q}</span>
                <ChevronDown
                  size={20}
                  className={`text-brand transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && <div className="px-6 pb-6 text-ink-soft leading-relaxed">{it.a}</div>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
