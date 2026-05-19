import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  STATUS_COLOR,
  STATUS_LABEL,
  formatMoney,
  type OrderStatus,
} from "@/lib/order";
import { ArrowLeft } from "lucide-react";
import OrderUpdateForm from "./OrderUpdateForm";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order) notFound();

  let intake: Record<string, unknown> = {};
  try {
    intake = JSON.parse(order.intake);
  } catch {
    /* ignore */
  }

  return (
    <div className="p-6 md:p-8 max-w-[1100px]">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-[13px] text-[#6b7280] hover:text-[#1E7FFF]"
      >
        <ArrowLeft size={14} /> Back to orders
      </Link>

      <header className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[26px] font-bold text-[#212322]">
            {order.orderNumber}
          </h1>
          <p className="mt-1 text-[13px] text-[#6b7280]">
            Submitted{" "}
            {new Date(order.createdAt).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
        <span
          className={`inline-block rounded-full px-3 py-1 text-[12px] font-bold ${
            STATUS_COLOR[order.status as OrderStatus] ??
            "bg-slate-100 text-slate-700"
          }`}
        >
          {STATUS_LABEL[order.status as OrderStatus] ?? order.status}
        </span>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Order summary */}
          <Card title="Order Summary">
            <Row label="Product">
              <span className="capitalize">{order.product}</span>
            </Row>
            <Row label="Plan">
              {order.plan} month{order.plan === "1" ? "" : "s"}
            </Row>
            <Row label="Monthly Rate">{formatMoney(order.monthlyPrice)}</Row>
            <Row label="Total (COD)" strong>
              {formatMoney(order.totalPrice)}
            </Row>
          </Card>

          {/* Customer */}
          <Card title="Customer">
            <Row label="Name">
              {order.firstName} {order.lastName}
            </Row>
            <Row label="Email">
              <a
                href={`mailto:${order.email}`}
                className="text-[#1E7FFF] hover:underline"
              >
                {order.email}
              </a>
            </Row>
            <Row label="Phone">
              <a
                href={`tel:${order.phone}`}
                className="text-[#1E7FFF] hover:underline"
              >
                {order.phone}
              </a>
            </Row>
          </Card>

          {/* Shipping */}
          <Card title="Shipping Address">
            <p className="text-[14px] leading-relaxed text-[#212322]">
              {order.firstName} {order.lastName}
              <br />
              {order.address1}
              {order.address2 ? (
                <>
                  <br />
                  {order.address2}
                </>
              ) : null}
              <br />
              {order.city}, {order.state} {order.zip}
            </p>
          </Card>

          {/* Intake */}
          <Card title="Medical Intake">
            {Object.keys(intake).length === 0 ? (
              <p className="text-[13px] text-[#9ca3af]">
                No intake data on file.
              </p>
            ) : (
              <dl className="grid gap-x-6 gap-y-3 grid-cols-1 md:grid-cols-2">
                {Object.entries(intake).map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[11px] font-bold uppercase tracking-wide text-[#9ca3af]">
                      {humanize(k)}
                    </dt>
                    <dd className="text-[14px] text-[#212322] mt-0.5 break-words">
                      {formatValue(v)}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </Card>
        </div>

        {/* Right column — actions */}
        <aside>
          <div className="sticky top-6">
            <OrderUpdateForm
              id={order.id}
              status={order.status as OrderStatus}
              trackingNumber={order.trackingNumber || ""}
              carrier={order.carrier || ""}
              adminNotes={order.adminNotes || ""}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-3">
        <h2 className="text-[14px] font-bold text-[#212322]">{title}</h2>
      </div>
      <div className="p-5 space-y-2.5">{children}</div>
    </section>
  );
}

function Row({
  label,
  children,
  strong,
}: {
  label: string;
  children: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-[14px]">
      <span className="text-[#6b7280]">{label}</span>
      <span
        className={
          strong
            ? "font-bold text-[#1E7FFF] text-[16px]"
            : "text-[#212322] font-medium"
        }
      >
        {children}
      </span>
    </div>
  );
}

function humanize(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function formatValue(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (Array.isArray(v)) return v.length === 0 ? "—" : v.join(", ");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}
