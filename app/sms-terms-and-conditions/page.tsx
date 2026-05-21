import LegalLayout from "@/components/LegalLayout";

export const metadata = { title: "SMS Terms and Conditions — NewFastRx" };

export default function SmsTermsPage() {
  return (
    <LegalLayout title="SMS Terms and Conditions" updated="January 1, 2026">
      <p>
        By providing your mobile number and opting in, you agree to receive
        text messages from us as described below.
      </p>

      <h2>Product Description</h2>
      <p>
        Our SMS program sends transactional and, if separately opted in,
        marketing text messages related to your account, prescriptions,
        appointments, and promotions.
      </p>

      <h2>Opt-In</h2>
      <p>
        You opt in by checking the SMS consent boxes during sign-up or by
        replying with the keyword shown in a confirmation message.
      </p>

      <h2>Message Frequency</h2>
      <p>
        Frequency varies. Transactional messages are sent as account events
        occur. Marketing messages are typically limited to a few per month.
      </p>

      <h2>Message and Data Rates</h2>
      <p>
        Standard message and data rates from your carrier may apply. Check
        with your carrier for details.
      </p>

      <h2>Opting Out</h2>
      <p>
        Reply <strong>STOP</strong> to any message to opt out of further
        messages from that program. You will receive a confirmation message
        and no additional messages thereafter, unless you opt back in.
      </p>

      <h2>Help and Support</h2>
      <p>
        Reply <strong>HELP</strong> for assistance, or email{" "}
        <a href="mailto:support@example.com">support@example.com</a>.
      </p>

      <h2>Carrier Liability Disclaimer</h2>
      <p>
        Carriers are not liable for delayed or undelivered messages.
      </p>

      <h2>Privacy</h2>
      <p>
        Your mobile information is handled in accordance with our{" "}
        <a href="/privacy">Privacy Policy</a>. We do not sell or share mobile
        numbers with third parties for their marketing purposes.
      </p>
    </LegalLayout>
  );
}
