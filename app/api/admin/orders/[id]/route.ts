import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { ORDER_STATUSES } from "@/lib/order";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (body.status) {
    if (!(ORDER_STATUSES as readonly string[]).includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    data.status = body.status;
  }
  if (body.trackingNumber !== undefined) data.trackingNumber = body.trackingNumber || null;
  if (body.carrier !== undefined) data.carrier = body.carrier || null;
  if (body.adminNotes !== undefined) data.adminNotes = body.adminNotes || null;

  const updated = await prisma.order.update({ where: { id: params.id }, data });
  return NextResponse.json({ ok: true, order: updated });
}
