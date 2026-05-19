"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ORDER_STATUSES,
  STATUS_LABEL,
  type OrderStatus,
} from "@/lib/order";
import { Save } from "lucide-react";

export default function OrderUpdateForm({
  id,
  status,
  trackingNumber,
  carrier,
  adminNotes,
}: {
  id: string;
  status: OrderStatus;
  trackingNumber: string;
  carrier: string;
  adminNotes: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    status,
    trackingNumber,
    carrier,
    adminNotes,
  });
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Update failed");
      return;
    }
    setSavedAt(new Date().toLocaleTimeString());
    startTransition(() => router.refresh());
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl bg-white shadow-sm p-5 space-y-4"
    >
      <h2 className="text-[14px] font-bold text-[#212322]">Manage Order</h2>

      <div>
        <label className="label">Status</label>
        <select
          className="input !py-2.5"
          value={form.status}
          onChange={(e) => update("status", e.target.value as OrderStatus)}
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">Carrier</label>
        <input
          className="input !py-2.5"
          placeholder="e.g. USPS, FedEx, UPS"
          value={form.carrier}
          onChange={(e) => update("carrier", e.target.value)}
        />
      </div>

      <div>
        <label className="label">Tracking Number</label>
        <input
          className="input !py-2.5"
          placeholder="e.g. 9400 1000 0000 0000 0000 00"
          value={form.trackingNumber}
          onChange={(e) => update("trackingNumber", e.target.value)}
        />
      </div>

      <div>
        <label className="label">Internal Notes</label>
        <textarea
          rows={4}
          className="input !py-2.5 resize-y"
          placeholder="Notes visible to admins only"
          value={form.adminNotes}
          onChange={(e) => update("adminNotes", e.target.value)}
        />
      </div>

      {error && (
        <div className="rounded-md bg-rose-50 border border-rose-200 px-3 py-2 text-[13px] text-rose-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full disabled:opacity-60"
      >
        <Save size={16} className="mr-2" /> {pending ? "Saving…" : "Save changes"}
      </button>

      {savedAt && !error && (
        <p className="text-center text-[12px] text-emerald-600">
          Saved at {savedAt}
        </p>
      )}
    </form>
  );
}
