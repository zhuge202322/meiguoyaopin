import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateV1Signature } from "@/lib/nexus-pay";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature") || "";
    const timestamp = req.headers.get("x-timestamp") || "";
    const nonce = req.headers.get("x-nonce") || "";

    if (!signature || !timestamp || !nonce) {
      return new NextResponse("Missing headers", { status: 400 });
    }

    const url = new URL(req.url);
    const path = url.pathname;
    
    const expectedSign = generateV1Signature("POST", path, "", rawBody, timestamp, nonce);

    if (signature.replace("HMAC ", "").toLowerCase() !== expectedSign.toLowerCase()) {
      console.error("Webhook signature mismatch", { path, expectedSign, signature });
      return new NextResponse("Invalid signature", { status: 401 });
    }

    const result = JSON.parse(rawBody);
    const merchantOrderNo = result.merchantOrderNo || "";
    
    // The orderNo we sent was order.id + 4 random hex chars
    const orderId = merchantOrderNo.slice(0, -4);
    
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    
    if (order) {
      const status = Number(result.status || 0);
      if (status === 2) {
        await prisma.order.update({
          where: { id: orderId },
          data: { 
            status: "PAID", 
            trackingNumber: result.transactionNo || order.trackingNumber 
          }
        });
        return new NextResponse("success", { status: 200 });
      } else if (status === 3) {
        await prisma.order.update({
          where: { id: orderId },
          data: { 
            status: "PAYMENT_FAILED", 
            adminNotes: `Payment failed via Gateway (Webhook).` 
          }
        });
        return new NextResponse("success", { status: 200 });
      }
      return new NextResponse("pending", { status: 200 });
    }
    
    return new NextResponse("order not found", { status: 404 });
  } catch (error) {
    console.error("Nexus Webhook error", error);
    return new NextResponse("Server error", { status: 500 });
  }
}
