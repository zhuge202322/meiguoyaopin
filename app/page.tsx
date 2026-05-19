import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Faq from "@/components/Faq";
import BlueFeatureBar from "@/components/BlueFeatureBar";
import { Monitor, ClipboardList, Truck, ArrowRight } from "lucide-react";

const HOME_FAQ = [
  {
    q: "What is MyFastRx?",
    a: "MyFastRx is a telehealth platform that pairs you with U.S.-licensed physicians for online consultations and home-delivered prescription care. Doctors review your medical history, prescribe when appropriate, and our partner pharmacy ships your medication directly to your door.",
  },
  {
    q: "What is the MyFastRx process?",
    a: "Pick your treatment, complete a short medical intake, and a licensed doctor reviews your case — usually within 24 hours. If approved, your medication is shipped free and discreetly. Some states require a brief video or live-chat consult, which we arrange for you.",
  },
  {
    q: "How much does MyFastRx cost?",
    a: "Pricing is flat and transparent. Most members find MyFastRx significantly cheaper than other online programs and even local pharmacies — with free shipping always included and no insurance required.",
  },
];

// Reference assets (dev placeholders — replace before launch).
const HERO_IMG = "/images/doctor-photo-1.png";
const STEP_IMGS = [
  "/images/mfrx_hp_1.jpeg",
  "/images/mfrx_hp_2.jpeg",
  "/images/9c307353-13ab-421f-a6d9-8249fad7f9e7.jpeg",
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* ===== Hero ===== */}
        <section className="bg-[#F3F3F3]">
          <div className="container py-12 md:py-16 grid md:grid-cols-[1fr_1fr] gap-8 items-center">
            {/* Left: text */}
            <div className="md:pl-12 max-w-xl md:justify-self-end">
              <h1 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-[#212322]">
                Fast, Easy Healthcare.<br />Right From Home
              </h1>
              <p className="mt-5 text-[15px] text-[#3a3a3a] leading-relaxed max-w-md">
                Complete a quick online form, get a fast prescription, and receive your meds discreetly at home — no appointments, no hassle.
              </p>

              <ul className="mt-6 space-y-2.5">
                {[
                  { icon: Monitor, t: "Free online consult with a licensed doctor" },
                  { icon: ClipboardList, t: "Fast prescription approval, no in-person visit" },
                  { icon: Truck, t: "Discreet delivery right to your door" },
                ].map((it, i) => (
                  <li key={i} className="flex items-center gap-3 text-[14px] text-[#212322]">
                    <it.icon size={18} className="text-[#212322] shrink-0" />
                    <span>{it.t}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-7 font-bold text-[14px] text-[#212322]">Healthcare made simple by MyFastRx.</p>

              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[#212322]">
                {["Free Online Consultation", "Trusted Medications", "Free Discreet Delivery"].map((t, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5">
                    <ArrowRight size={13} className="text-[#212322]" />
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/weight-loss" className="btn-primary">Start my visit</Link>
                <Link
                  href="/weight-loss"
                  className="inline-flex items-center justify-center rounded-md border-2 border-[#1E7FFF] bg-white px-6 py-3 text-sm font-semibold text-[#1E7FFF] hover:bg-[#EFF6FF] transition"
                >
                  Get Started - Pick Your Treatment
                </Link>
              </div>
            </div>

            {/* Right: doctor photo with blue circle backdrop */}
            <div className="relative h-[460px] md:h-[600px] flex items-end justify-center">
              {/* Circle backdrop */}
              <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] md:h-[500px] md:w-[500px] rounded-full bg-[#D7E7FF]" />
              {/* Doctor — head pokes above circle top */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={HERO_IMG}
                alt="Licensed online doctor consultation"
                width={604}
                height={938}
                className="relative z-10 max-h-[600px] w-auto object-contain"
                loading="eager"
              />
            </div>
          </div>
        </section>

        {/* ===== How it works ===== */}
        <section className="py-14 md:py-20 bg-white">
          <div className="container">
            <div className="rounded-3xl bg-[#F3F3F3] px-6 md:px-12 py-12 md:py-16">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-[#212322]">How it works</h2>

              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {[
                  { img: STEP_IMGS[0], label: "Quick Consultation" },
                  { img: STEP_IMGS[1], label: "Get your prescription" },
                  { img: STEP_IMGS[2], label: "Fast, Discreet Delivery" },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.img}
                      alt={s.label}
                      className="w-full aspect-[4/3] object-cover rounded-md"
                    />
                    <p className="mt-5 text-xl font-bold text-[#212322]">Step - {i + 1}</p>
                    <p className="mt-1.5 text-[#3a3a3a]">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex justify-center">
                <Link href="/onboard" className="btn-primary">Start my visit</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Blue feature marquee ===== */}
        <BlueFeatureBar />

        {/* ===== Treatment CTA strip ===== */}
        <section className="bg-[#F3F3F3] py-7">
          <div className="container flex flex-col md:flex-row items-center justify-center gap-5 md:gap-10 text-center md:text-left">
            <p className="text-[18px] font-semibold text-[#212322]">
              Medications tailored to you, delivered to your door
            </p>
            <Link href="/weight-loss" className="btn-primary">Choose Your Treatment</Link>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <Faq items={HOME_FAQ} title="Frequently asked questions" />
      </main>
      <Footer />
    </>
  );
}
