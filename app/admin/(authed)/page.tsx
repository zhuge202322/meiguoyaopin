import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  ORDER_STATUSES,
  STATUS_COLOR,
  STATUS_LABEL,
  formatMoney,
  type OrderStatus,
} from "@/lib/order";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: { status?: string; q?: string };
}) {
  const status = searchParams.status as OrderStatus | undefined;
  const q = searchParams.q?.trim() || "";

  const where: any = {};
  if (status && (ORDER_STATUSES as readonly string[]).includes(status)) {
    where.status = status;
  }
  if (q) {
    where.OR = [
      { orderNumber: { contains: q } },
      { email: { contains: q.toLowerCase() } },
      { firstName: { contains: q } },
      { lastName: { contains: q } },
      { phone: { contains: q } },
    ];
  }

  const [orders, counts, totalCount] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.order.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.order.count(),
  ]);

  const countByStatus = Object.fromEntries(
    counts.map((c: { status: string; _count: { _all: number } }) => [
      c.status,
      c._count._all,
    ])
  ) as Record<string, number>;

  return (
    <div className="p-6 md:p-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-bold text-[#212322]">Orders</h1>
          <p className="mt-1 text-[13px] text-[#6b7280]">
            {totalCount} total · showing {orders.length}
          </p>
        </div>
        <form className="flex items-center gap-2">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search order #, name, email…"
            className="input !py-2 !text-[13px] w-[280px]"
          />
          {status && <input type="hidden" name="status" value={status} />}
          <button className="btn-primary !py-2 !text-[13px]">Search</button>
        </form>
      </header>

      {/* Status filter chips */}
      <div className="mt-6 flex flex-wrap gap-2">
        <FilterChip
          href={`/admin${q ? `?q=${encodeURIComponent(q)}` : ""}`}
          active={!status}
          label="All"
          count={totalCount}
        />
        {ORDER_STATUSES.map((s) => (
          <FilterChip
            key={s}
            href={`/admin?status=${s}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            active={status === s}
            label={STATUS_LABEL[s]}
            count={countByStatus[s] ?? 0}
          />
        ))}
      </div>

      {/* Table */}
      <div className="mt-6 rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-[#F9FAFB] text-[#6b7280] uppercase text-[11px] tracking-wide">
              <tr>
                <Th>Order #</Th>
                <Th>Date</Th>
                <Th>Customer</Th>
                <Th>Product</Th>
                <Th>Total</Th>
                <Th>Status</Th>
                <Th />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#9ca3af]">
                    No orders match the current filter.
                  </td>
                </tr>
              )}
              {orders.map((o: (typeof orders)[number]) => (
                <tr key={o.id} className="hover:bg-[#F9FAFB]">
                  <Td>
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="font-bold text-[#1E7FFF] hover:underline"
                    >
                      {o.orderNumber}
                    </Link>
                  </Td>
                  <Td className="text-[#6b7280]">
                    {new Date(o.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </Td>
                  <Td>
                    <div className="font-semibold text-[#212322]">
                      {o.firstName} {o.lastName}
                    </div>
                    <div className="text-[#6b7280] text-[12px]">{o.email}</div>
                  </Td>
                  <Td>
                    <div className="capitalize text-[#212322]">{o.product}</div>
                    <div className="text-[#6b7280] text-[12px]">
                      {o.plan} mo · {formatMoney(o.monthlyPrice)}/mo
                    </div>
                  </Td>
                  <Td className="font-semibold text-[#212322]">
                    {formatMoney(o.totalPrice)}
                  </Td>
                  <Td>
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        STATUS_COLOR[o.status as OrderStatus] ??
                        "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {STATUS_LABEL[o.status as OrderStatus] ?? o.status}
                    </span>
                  </Td>
                  <Td>
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="inline-flex items-center gap-1 text-[#1E7FFF] font-semibold text-[12px] hover:underline"
                    >
                      Open <ArrowRight size={12} />
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return <th className="text-left font-bold p-3 whitespace-nowrap">{children}</th>;
}
function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`p-3 align-middle ${className}`}>{children}</td>;
}
function FilterChip({
  href,
  active,
  label,
  count,
}: {
  href: string;
  active: boolean;
  label: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${
        active
          ? "bg-[#1E7FFF] text-white"
          : "bg-white text-[#3a3a3a] hover:bg-slate-50 border border-slate-200"
      }`}
    >
      {label}
      <span
        className={`rounded-full px-1.5 ${
          active ? "bg-white/20" : "bg-slate-100"
        }`}
      >
        {count}
      </span>
    </Link>
  );
}
