import LegalLayout from "@/components/LegalLayout";

export const metadata = { title: "Returns & Refund Policy — MyFastRx" };

export default function ReturnsPage() {
  return (
    <LegalLayout title="Returns & Refund Policy" updated="January 1, 2026">
      <p>
        For safety and regulatory reasons, prescription medications generally
        cannot be returned once shipped. This policy explains the limited
        circumstances in which refunds or replacements may be available.
      </p>

      <h2>1. Consultation Fees</h2>
      <p>
        If a provider determines that you are not a candidate for treatment,
        any consultation-only fee paid is refundable as described at checkout.
      </p>

      <h2>2. Medication Orders</h2>
      <p>
        Once a prescription is dispensed by a pharmacy, the medication cannot
        be returned and is not eligible for refund, except as set out below.
      </p>

      <h2>3. Damaged or Defective Shipments</h2>
      <p>
        If your shipment arrives damaged or defective, contact us within 7 days
        of delivery so we can arrange a replacement, where appropriate.
      </p>

      <h2>4. Lost or Stolen Packages</h2>
      <p>
        If a package is reported lost in transit by the carrier, we will work
        with you and the pharmacy on a case-by-case basis.
      </p>

      <h2>5. Subscription Cancellation</h2>
      <p>
        You may pause or cancel your subscription at any time before your next
        billing cycle. Charges already processed for the current cycle are
        non-refundable.
      </p>

      <h2>6. How to Request a Refund</h2>
      <p>
        Email{" "}
        <a href="mailto:support@example.com">support@example.com</a> with your
        order number and the reason for the request. Most replies within
        1 business day.
      </p>
    </LegalLayout>
  );
}
