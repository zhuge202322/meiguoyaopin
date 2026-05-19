export const ORDER_STATUSES = [
  "NEW",
  "REVIEWING",
  "APPROVED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  NEW: "New",
  REVIEWING: "Reviewing",
  APPROVED: "Approved",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const STATUS_COLOR: Record<OrderStatus, string> = {
  NEW: "bg-blue-100 text-blue-700",
  REVIEWING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-emerald-100 text-emerald-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-slate-200 text-slate-700",
  CANCELLED: "bg-rose-100 text-rose-700",
};

export function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function generateOrderNumber() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `MFR-${ymd}-${rand}`;
}

export const PRICING: Record<string, Record<string, number>> = {
  semaglutide: { "1": 16900, "3": 13300, "6": 11700, "12": 9900 },
  tirzepatide: { "1": 24900, "3": 19900, "6": 18300, "12": 14900 },
};
