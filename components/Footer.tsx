import Link from "next/link";
import Logo from "./Logo";

const THERAPIES = [{ href: "/weight-loss", label: "Weight Loss" }];

const LEGAL = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/ccpa", label: "CCPA Opt-Out" },
  { href: "/hipaa", label: "HIPAA Notice" },
  { href: "/returns-refund-policy", label: "Returns & Refund Policy" },
  { href: "/sms-terms-and-conditions", label: "SMS Terms and Conditions" },
];

const COMPANY = [
  { href: "/about", label: "About" },
  { href: "/contact-us", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

function Column({ title, items }: { title: string; items: { href: string; label: string }[] }) {
  return (
    <div>
      <h4 className="text-[15px] font-bold text-[#1E7FFF] mb-4">{title}</h4>
      <ul className="space-y-2.5">
        {items.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-[14px] text-[#3a3a3a] hover:text-[#1E7FFF]">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="mt-12 bg-white">
      <div className="container py-14 grid gap-10 md:grid-cols-4">
        <div>
          <Logo width={200} />
          <div className="mt-6 flex items-center gap-5">
            <a
              href="https://www.legitscript.com/websites/?checker_keywords=myfastrx.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Verify LegitScript Approval"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://static.legitscript.com/seals/24730.png"
                alt="LegitScript Approved"
                width={73}
                height={79}
              />
            </a>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/HIPAA-Compliant-Logo-300x164.webp"
              srcSet="/images/HIPAA-Compliant-Logo-300x164.webp 300w, /images/HIPAA-Compliant-Logo-768x419.webp 768w, /images/HIPAA-Compliant-Logo-1024x559.webp 1024w"
              sizes="120px"
              width={120}
              height={66}
              alt="HIPAA Compliant"
              loading="lazy"
              className="h-auto"
            />
          </div>
        </div>

        <Column title="Therapies" items={THERAPIES} />
        <Column title="Legal" items={LEGAL} />
        <Column title="Company" items={COMPANY} />
      </div>

      <div className="container pb-8">
        <p className="text-[11px] leading-relaxed text-[#9ca3af] max-w-5xl">
          NewFastRx is a registered trademark of NewFastRx Health LLC. Individual results may vary; weight loss
          is not guaranteed. Results depend on multiple factors including starting weight, adherence to
          treatment, diet, and lifestyle. GLP-1 medications may not be appropriate for everyone. A medical
          consultation is required, and prescriptions are issued at the discretion of a licensed U.S.
          healthcare provider based on clinical evaluation. Medications offered are compounded formulations
          and are not FDA-approved. Compounded medications are prepared by state-licensed pharmacies in
          accordance with applicable regulations. Pricing: advertised monthly rates reflect discounted
          pricing with multi-month or annual plans billed upfront; standard monthly pricing may be higher.
          Actual pricing, savings, and available plans may vary. Shipping times may vary based on provider
          approval, pharmacy processing, and location. NewFastRx does not accept insurance. All services are
          cash-pay.
        </p>
        <p className="mt-6 text-[12px] text-[#9ca3af]">
          © {new Date().getFullYear()} NewFastRx Health LLC. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
