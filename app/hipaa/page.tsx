import LegalLayout from "@/components/LegalLayout";

export const metadata = { title: "HIPAA Notice of Privacy Practices — NewFastRx" };

export default function HipaaPage() {
  return (
    <LegalLayout
      title="HIPAA Notice of Privacy Practices"
      updated="January 1, 2026"
    >
      <p>
        <strong>
          This notice describes how medical information about you may be used
          and disclosed and how you can get access to this information. Please
          review it carefully.
        </strong>
      </p>

      <h2>1. Our Commitment</h2>
      <p>
        We are required by law to maintain the privacy of your Protected Health
        Information (PHI), provide you with this notice of our legal duties and
        privacy practices, and follow the terms of the notice in effect.
      </p>

      <h2>2. How We May Use and Disclose PHI</h2>
      <h3>Treatment</h3>
      <p>
        We use PHI to provide telehealth consultations, prescriptions, and
        related care, and to coordinate with pharmacies and other providers.
      </p>
      <h3>Payment</h3>
      <p>
        We may use and disclose PHI to obtain payment for services rendered.
      </p>
      <h3>Health Care Operations</h3>
      <p>
        We may use PHI for quality improvement, training, audits, compliance,
        and other internal operations.
      </p>

      <h2>3. Disclosures Required or Permitted by Law</h2>
      <ul>
        <li>Public health activities and reporting</li>
        <li>Health oversight activities</li>
        <li>Judicial and administrative proceedings</li>
        <li>Law enforcement purposes when required</li>
        <li>To prevent a serious threat to health or safety</li>
      </ul>

      <h2>4. Your Rights</h2>
      <ul>
        <li>Right to inspect and copy your PHI</li>
        <li>Right to request an amendment to your PHI</li>
        <li>Right to an accounting of disclosures</li>
        <li>Right to request restrictions on certain uses and disclosures</li>
        <li>Right to request confidential communications</li>
        <li>Right to a paper copy of this notice</li>
      </ul>

      <h2>5. Authorizations</h2>
      <p>
        Other uses and disclosures will be made only with your written
        authorization. You may revoke an authorization in writing at any time.
      </p>

      <h2>6. Complaints</h2>
      <p>
        You may file a complaint with us or with the U.S. Department of Health
        and Human Services if you believe your privacy rights have been
        violated. We will not retaliate for filing a complaint.
      </p>

      <h2>7. Contact</h2>
      <p>
        Privacy Officer:{" "}
        <a href="mailto:privacy@example.com">privacy@example.com</a>
      </p>
    </LegalLayout>
  );
}
