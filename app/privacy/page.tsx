import LegalLayout from "@/components/LegalLayout";

export const metadata = { title: "Privacy Policy — MyFastRx" };

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="January 1, 2026">
      <p>
        This Privacy Policy describes how we collect, use, share, and protect
        information when you visit our website or use our telehealth services.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        We collect information you provide directly (such as account details,
        medical history, and payment information), information collected
        automatically (such as device data and usage analytics), and information
        from third parties (such as pharmacies, payment processors, and identity
        verification services).
      </p>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To provide telehealth consultations and fulfill prescriptions</li>
        <li>To process payments and arrange shipping</li>
        <li>To communicate with you about your account and treatment</li>
        <li>To comply with legal obligations and protect our rights</li>
        <li>To improve, secure, and personalize our services</li>
      </ul>

      <h2>3. Sharing of Information</h2>
      <p>
        We share information only as needed to deliver care: with licensed
        providers, partner pharmacies, payment processors, shipping carriers,
        analytics vendors, and as required by law.
      </p>

      <h2>4. Protected Health Information (PHI)</h2>
      <p>
        Health information you share with our providers is treated as Protected
        Health Information under HIPAA where applicable. See our HIPAA Notice
        for details on how PHI is handled.
      </p>

      <h2>5. Cookies and Tracking</h2>
      <p>
        We use cookies, pixels, and similar technologies for authentication,
        analytics, and marketing. You can control cookies through your browser
        and adjust ad-tracking preferences via the CCPA Opt-Out page where
        applicable.
      </p>

      <h2>6. Your Rights</h2>
      <p>
        Depending on your jurisdiction, you may have rights to access, correct,
        delete, or port your personal information, and to opt out of certain
        sharing. Contact us at the email below to exercise these rights.
      </p>

      <h2>7. Security</h2>
      <p>
        We use administrative, technical, and physical safeguards designed to
        protect your information. No method of transmission or storage is 100%
        secure, but we work to maintain reasonable protections.
      </p>

      <h2>8. Children</h2>
      <p>
        Our services are not directed to individuals under 18. We do not
        knowingly collect personal information from children.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this policy from time to time. Material changes will be
        posted here with an updated effective date.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about this policy? Email{" "}
        <a href="mailto:privacy@example.com">privacy@example.com</a>.
      </p>
    </LegalLayout>
  );
}
