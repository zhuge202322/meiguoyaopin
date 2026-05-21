import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="container py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold">About NewFastRx</h1>
        <p className="mt-6 text-lg text-ink-soft max-w-2xl">
          NewFastRx is your comprehensive health and wellness partner. We coordinate virtual medical
          consultations with U.S.-licensed physicians and deliver cost-effective, high-quality
          prescriptions directly to your home.
        </p>
        <p className="mt-4 text-lg text-ink-soft max-w-2xl">
          Our mission is to deliver accessible, affordable, and top-notch healthcare to individuals
          and communities across multiple states — with discreet shipping and an unmatched online experience.
        </p>
      </main>
      <Footer />
    </>
  );
}
