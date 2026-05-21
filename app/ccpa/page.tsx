import LegalLayout from "@/components/LegalLayout";

export const metadata = { title: "CCPA Opt-Out — NewFastRx" };

export default function CcpaPage() {
  return (
    <LegalLayout title="CCPA Opt-Out" updated="January 1, 2026">
      <p>
        Under the California Consumer Privacy Act (CCPA) and California Privacy
        Rights Act (CPRA), California residents have the right to opt out of
        the sale or sharing of personal information for cross-context
        behavioral advertising.
      </p>

      <h2>1. Your California Rights</h2>
      <ul>
        <li>Right to know what personal information we collect and how it is used</li>
        <li>Right to delete personal information we have collected</li>
        <li>Right to correct inaccurate personal information</li>
        <li>Right to opt out of the sale or sharing of personal information</li>
        <li>Right to limit use of sensitive personal information</li>
        <li>Right to non-discrimination for exercising these rights</li>
      </ul>

      <h2>2. How to Opt Out</h2>
      <p>
        To opt out of the sale or sharing of your personal information, submit
        a request via:
      </p>
      <ul>
        <li>Email: <a href="mailto:privacy@example.com">privacy@example.com</a></li>
        <li>The opt-out form linked from our Privacy Policy</li>
        <li>Global Privacy Control (GPC) signal — we honor this automatically</li>
      </ul>

      <h2>3. Authorized Agents</h2>
      <p>
        You may designate an authorized agent to submit a request on your
        behalf. We will require verification of identity and authorization.
      </p>

      <h2>4. Verification</h2>
      <p>
        We verify requests by matching the information you provide with what
        we have on file. We may request additional information for verification.
      </p>

      <h2>5. Response Timeline</h2>
      <p>
        We aim to respond to verifiable consumer requests within 45 days, with
        a possible 45-day extension where necessary.
      </p>

      <h2>6. Contact</h2>
      <p>
        Questions? Email{" "}
        <a href="mailto:privacy@example.com">privacy@example.com</a>.
      </p>
    </LegalLayout>
  );
}
