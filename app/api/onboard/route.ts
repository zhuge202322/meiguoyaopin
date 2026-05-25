import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserSession } from "@/lib/auth";
import { generateOrderNumber, PRICING } from "@/lib/order";
import { processNexusPayment } from "@/lib/nexus-pay";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      product, plan,
      firstName, lastName, email, phone,
      address1, address2, city, state, zip,
      cardNumber, cardExpiry, cardCvv, resolution, timeZone,
      ...intake
    } = data;

    if (!product || !plan || !firstName || !lastName || !email || !phone || !address1 || !city || !state || !zip || !cardNumber || !cardExpiry || !cardCvv) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const monthlyPrice = PRICING[product]?.[plan];
    if (!monthlyPrice) {
      return NextResponse.json({ error: "Invalid product/plan" }, { status: 400 });
    }
    const totalPrice = monthlyPrice * Number(plan) * 100; // stored in cents

    const session = await getUserSession();

    // Create the order as PENDING_PAYMENT
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session?.sub,
        product, plan,
        monthlyPrice: monthlyPrice * 100, 
        totalPrice,
        firstName, lastName, email: email.toLowerCase(), phone,
        address1, address2, city, state, zip,
        intake: JSON.stringify(intake),
        status: "PENDING_PAYMENT",
      },
    });

    try {
      // Extract IP and Host
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.ip || "127.0.0.1";
      const host = req.headers.get("host") || "localhost";
      const userAgent = req.headers.get("user-agent") || "";
      const acceptLanguage = req.headers.get("accept-language") || "";
      const referer = req.headers.get("referer") || "";

      const [expiresMonth, expiresYearFull] = cardExpiry.split("/");
      const expiresYear = "20" + expiresYearFull; // e.g. "24" -> "2024"

      const paymentResult = await processNexusPayment(order, {
        cardNumber, expiresMonth, expiresYear, cvv: cardCvv,
        resolution, timeZone
      }, { ip, host, userAgent, acceptLanguage, referer });

      if (paymentResult.success) {
        // Payment accepted or redirect required
        await prisma.order.update({
          where: { id: order.id },
          data: { status: "PAID", trackingNumber: paymentResult.transactionNo }, // temp store transactionNo in trackingNumber or adminNotes
        });

        return NextResponse.json({ 
          ok: true, 
          orderId: order.id, 
          orderNumber: order.orderNumber,
          payUrl: paymentResult.payUrl 
        });
      }
    } catch (paymentError: any) {
      // Payment failed
      console.error("Payment error:", paymentError);
      
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "PAYMENT_FAILED", adminNotes: `Payment failed: ${paymentError.message}` },
      });

      return NextResponse.json({ error: paymentError.message || "Payment processing failed. Please check your card details." }, { status: 400 });
    }

  } catch (e: any) {
    console.error("onboard error", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
