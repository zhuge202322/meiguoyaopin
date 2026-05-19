import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserSession } from "@/lib/auth";
import { generateOrderNumber, PRICING } from "@/lib/order";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      product, plan,
      firstName, lastName, email, phone,
      address1, address2, city, state, zip,
      ...intake
    } = data;

    if (!product || !plan || !firstName || !lastName || !email || !phone || !address1 || !city || !state || !zip) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const monthlyPrice = PRICING[product]?.[plan];
    if (!monthlyPrice) {
      return NextResponse.json({ error: "Invalid product/plan" }, { status: 400 });
    }
    const totalPrice = monthlyPrice * Number(plan);

    const session = await getUserSession();

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session?.sub,
        product, plan,
        monthlyPrice, totalPrice,
        firstName, lastName, email: email.toLowerCase(), phone,
        address1, address2, city, state, zip,
        intake: JSON.stringify(intake),
        status: "NEW",
      },
      select: { id: true, orderNumber: true },
    });

    return NextResponse.json({ ok: true, orderId: order.id, orderNumber: order.orderNumber });
  } catch (e: any) {
    console.error("onboard error", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
