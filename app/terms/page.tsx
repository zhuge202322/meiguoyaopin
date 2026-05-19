import LegalLayout from "@/components/LegalLayout";

export const metadata = { title: "Terms of Use — MyFastRx" };

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Use" updated="January 1, 2026">
      <p>
        These Terms of Use govern your access to and use of our website and
        services. By using the site you agree to these terms.
      </p>

      <h2>1. Eligibility</h2>
      <p>
        You must be at least 18 years old and a U.S. resident in a state where
        our services are offered to use the platform.
      </p>

      <h2>2. Telehealth Services</h2>
      <p>
        Our platform connects you with licensed providers for online
        consultations. The decision to prescribe is made solely by the
        provider based on clinical evaluation. We do not guarantee a
        prescription will be issued.
      </p>

      <h2>3. Accounts</h2>
      <p>
        You are responsible for the accuracy of information you provide and
        for safeguarding your account credentials.
      </p>

      <h2>4. Payments and Subscriptions</h2>
      <ul>
        <li>Pricing is shown at checkout and subject to change with notice</li>
        <li>Multi-month plans may be billed upfront</li>
        <li>You may pause or cancel before the next billing cycle</li>
      </ul>

      <h2>5. Shipping and Delivery</h2>
      <p>
        Shipping times depend on provider approval and pharmacy processing.
        Carrier and weather delays may apply.
      </p>

      <h2>6. Returns</h2>
      <p>
        Prescription medications generally cannot be returned for safety and
        regulatory reasons. See our Returns &amp; Refund Policy for details.
      </p>

      <h2>7. Acceptable Use</h2>
      <p>
        You agree not to misuse the platform, attempt to circumvent security
        controls, or provide false medical information.
      </p>

      <h2>8. Intellectual Property</h2>
      <p>
        All content on the site is owned by us or our licensors and protected
        by applicable laws. You receive a limited, non-transferable license to
        use the site as intended.
      </p>

      <h2>9. Disclaimers</h2>
      <p>
        The site is provided on an "as is" basis. To the fullest extent
        permitted by law, we disclaim all warranties, express or implied.
      </p>

      <h2>10. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, our aggregate liability for
        any claim arising out of or relating to the services is limited to the
        amounts you paid us in the prior twelve months.
      </p>

      <h2>11. Dispute Resolution</h2>
      <p>
        Any dispute will be resolved by binding individual arbitration in
        accordance with applicable arbitration rules, except where prohibited
        by law.
      </p>

      <h2>12. Changes</h2>
      <p>
        We may update these terms from time to time. Continued use after
        changes constitutes acceptance.
      </p>

      <h2>13. Contact</h2>
      <p>
        Questions about these terms? Email{" "}
        <a href="mailto:legal@example.com">legal@example.com</a>.
      </p>
    </LegalLayout>
  );
}
