import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail } from "lucide-react";
import { getSupportEmail } from "@/lib/settings";

export default async function ContactPage() {
  const supportEmail = await getSupportEmail();

  return (
    <>
      <Header />
      <main className="container py-20 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold">Contact Us</h1>
        <p className="mt-5 text-ink-soft">
          Have a question? Our team is happy to help. For medical questions about your active prescription,
          please log in to your patient portal.
        </p>
        <div className="mt-8 space-y-3 text-ink-soft">
          <p className="flex items-center gap-3">
            <Mail className="text-brand" size={18}/>
            <a href={`mailto:${supportEmail}`} className="hover:underline">{supportEmail}</a>
          </p>
        </div>
        <form className="mt-10 grid gap-4">
          <div>
            <label className="label">Your name</label>
            <input className="input" />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea className="input min-h-[140px]" />
          </div>
          <button type="button" className="btn-primary self-start">Send message</button>
        </form>
      </main>
      <Footer />
    </>
  );
}
