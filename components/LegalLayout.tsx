import Header from "./Header";
import Footer from "./Footer";

export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>
        {/* Hero band */}
        <section className="bg-[#F3F3F3]">
          <div className="container py-10 md:py-14">
            <p className="text-[12px] font-bold uppercase tracking-wider text-[#1E7FFF]">
              Legal
            </p>
            <h1 className="mt-2 text-[32px] md:text-[40px] font-bold text-[#212322]">
              {title}
            </h1>
            <p className="mt-2 text-[13px] text-[#6b7280]">
              Last updated: {updated}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="bg-white py-12 md:py-16">
          <div className="container max-w-[820px]">
            <div className="legal-prose text-[15px] leading-[1.75] text-[#3a3a3a]">
              {children}
            </div>
            <div className="mt-12 rounded-xl border border-amber-200 bg-amber-50 p-4 text-[13px] text-amber-900">
              <strong>Placeholder notice:</strong> The text on this page is a
              structural placeholder. Final copy must be drafted or reviewed
              by your legal counsel before launch.
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
