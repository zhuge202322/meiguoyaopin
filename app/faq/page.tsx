import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Faq from "@/components/Faq";

const ITEMS = [
  { q: "What is MyFastRx?", a: "MyFastRx is a telehealth platform connecting you to U.S.-licensed physicians for online consultations and prescription medication delivered to your home." },
  { q: "How does the process work?", a: "Pick your treatment, answer a brief set of medical questions, and a doctor will review within ~24 hours. Approved prescriptions ship free and discreetly." },
  { q: "How much does it cost?", a: "Pricing is flat and transparent. Semaglutide is $169/mo and Tirzepatide is $249/mo — consultation, medication, and shipping included." },
  { q: "Do you accept insurance?", a: "MyFastRx does not require insurance. Our prices are designed to be more affordable than most pharmacies even without coverage." },
  { q: "Is my information secure?", a: "Yes. All consultations and records are protected under HIPAA standards." },
];

export default function FaqPage() {
  return (
    <>
      <Header />
      <main className="pt-12"><Faq items={ITEMS} title="Frequently Asked Questions" /></main>
      <Footer />
    </>
  );
}
