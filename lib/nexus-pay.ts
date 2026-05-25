import crypto from "crypto";

const NEXUS_MERCHANT_CODE = process.env.NEXUS_MERCHANT_CODE || "";
const NEXUS_API_SECRET = process.env.NEXUS_API_SECRET || "";
const NEXUS_PRODUCT_CODE = process.env.NEXUS_PRODUCT_CODE || "CC_PAY";
const NEXUS_GATEWAY = process.env.NEXUS_GATEWAY || "https://api.nexus-pay.com"; // Change to actual default if known

export function generateV1Signature(
  method: string,
  path: string,
  query: string,
  body: string,
  timestamp: string,
  nonce: string
) {
  const bodyHash = crypto.createHash("sha256").update(body).digest("hex");
  const canonicalString = [
    method.toUpperCase(),
    path,
    query,
    bodyHash,
    timestamp,
    nonce,
    NEXUS_API_SECRET,
  ].join("\n");
  
  return crypto.createHmac("sha256", NEXUS_API_SECRET).update(canonicalString).digest("hex");
}

export async function processNexusPayment(order: any, cardData: any, reqInfo: any) {
  const path = "/openapi/trade/orders";
  const timestamp = Date.now().toString();
  const nonce = crypto.randomBytes(8).toString("hex");

  const requestBody = {
    orderNo: order.id + crypto.randomBytes(2).toString("hex"), // appending random to ensure uniqueness across retries if needed
    productCode: NEXUS_PRODUCT_CODE,
    amount: order.totalPrice / 100, // cents to dollars if order.totalPrice is in cents
    currencyCode: "USD",
    countryCode: "US",
    settlementCurrency: "USD",
    payType: "CC",
    sourceChannel: "Nextjs",
    sourceSystem: "Custom",
    sourceSite: reqInfo.host,
    sourceIp: reqInfo.ip,
    customerFirstName: order.firstName,
    customerLastName: order.lastName,
    customerPhone: order.phone,
    customerEmail: order.email,
    customerCountry: "US",
    receiverFirstName: order.firstName,
    receiverLastName: order.lastName,
    receiverPhone: order.phone,
    receiverCountry: "US",
    receiverState: order.state,
    receiverCity: order.city,
    receiverPostalCode: order.zip,
    receiverAddress: `${order.address1} ${order.address2 || ""}`.trim(),
    billingFirstName: order.firstName,
    billingLastName: order.lastName,
    billingPhone: order.phone,
    billingEmail: order.email,
    billingCountry: "US",
    billingState: order.state,
    billingCity: order.city,
    billingPostalCode: order.zip,
    billingAddress: `${order.address1} ${order.address2 || ""}`.trim(),
    cardNo: cardData.cardNumber.replace(/\D/g, ""),
    cardHolderFirstName: order.firstName,
    cardHolderLastName: order.lastName,
    cardExpiryMonth: cardData.expiresMonth.padStart(2, "0"),
    cardExpiryYear: cardData.expiresYear,
    cvv: cardData.cvv,
    browserUserAgent: reqInfo.userAgent,
    browserLanguage: reqInfo.acceptLanguage,
    browserResolution: cardData.resolution || "1920x1080",
    browserTimezone: cardData.timeZone || "0",
    browserReferer: reqInfo.referer,
    shopUrl: `https://${reqInfo.host}`,
    notifyUrl: `https://${reqInfo.host}/api/webhooks/nexus`,
    returnUrl: `https://${reqInfo.host}/onboard?done=true&order=${order.orderNumber}`,
    customerIp: reqInfo.ip,
    remark: `Order #${order.orderNumber}`,
    itemsJson: JSON.stringify([{
      sku: order.product,
      name: order.product,
      price: order.monthlyPrice / 100,
      quantity: Number(order.plan),
      total: order.totalPrice / 100,
      url: `https://${reqInfo.host}/weight-loss`
    }])
  };

  const jsonBody = JSON.stringify(requestBody);
  const signature = generateV1Signature("POST", path, "", jsonBody, timestamp, nonce);

  const res = await fetch(`${NEXUS_GATEWAY.replace(/\/$/, "")}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Merchant-Code": NEXUS_MERCHANT_CODE,
      "X-Timestamp": timestamp,
      "X-Nonce": nonce,
      "X-Signature": signature,
      "X-Sign-Version": "v1",
    },
    body: jsonBody,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Nexus Pay HTTP Error:", res.status, text);
    throw new Error("Payment gateway connection error");
  }

  const result = await res.json();
  
  if (result.code === 200) {
    const data = result.data || {};
    if (data.status === 3) {
      throw new Error(data.errorMessage || "Payment failed at gateway.");
    }
    return {
      success: true,
      transactionNo: data.transactionNo,
      payUrl: data.payUrl || null,
      status: data.status
    };
  } else {
    throw new Error(result.msg || "Payment Processing Failed");
  }
}
