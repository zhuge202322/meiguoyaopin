import Link from "next/link";
import Logo from "./Logo";
import { ShieldCheck, Truck, Stethoscope } from "lucide-react";

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-white">
      {/* Left: form */}
      <div className="flex flex-col justify-between px-6 md:px-14 py-8">
        <div>
          <Logo width={180} />
        </div>

        <div className="mx-auto w-full max-w-[420px] py-10">
          <h1 className="text-[30px] md:text-[34px] font-bold text-[#212322] leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-[14px] text-[#6b7280]">{subtitle}</p>
          )}
          <div className="mt-7">{children}</div>
          {footer && (
            <div className="mt-6 text-center text-[13px] text-[#6b7280]">
              {footer}
            </div>
          )}
        </div>

        <p className="text-[12px] text-[#9ca3af]">
          © 2026 MyFastRx Health LLC.{" "}
          <Link href="/privacy" className="hover:text-[#1E7FFF]">Privacy</Link>{" "}
          ·{" "}
          <Link href="/terms" className="hover:text-[#1E7FFF]">Terms</Link>
        </p>
      </div>

      {/* Right: brand panel */}
      <div className="hidden md:flex relative bg-[#F3F3F3] flex-col items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-[520px] w-[520px] rounded-full bg-[#D7E7FF]" />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/doctor-photo-1.png"
          alt=""
          className="relative z-10 max-h-[560px] w-auto object-contain"
        />
        <div className="relative z-10 mt-6 max-w-md text-center">
          <h2 className="text-[22px] font-bold text-[#212322]">
            Your care, simplified.
          </h2>
          <p className="mt-2 text-[14px] text-[#3a3a3a]">
            Online consults, transparent pricing, free discreet shipping.
          </p>
          <div className="mt-5 flex items-center justify-center gap-5 text-[12px] text-[#3a3a3a]">
            <span className="inline-flex items-center gap-1.5">
              <Stethoscope size={16} className="text-[#1E7FFF]" /> US-licensed doctors
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Truck size={16} className="text-[#1E7FFF]" /> Free shipping
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-[#1E7FFF]" /> HIPAA compliant
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
