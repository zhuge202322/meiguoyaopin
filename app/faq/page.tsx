import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FaqClient from "./FaqClient";
import { getSupportEmail } from "@/lib/settings";

export const metadata = {
  title: "Frequently Asked Questions | NewFastRx",
  description: "Find answers to frequently asked questions about NewFastRx telehealth services, GLP-1 weight loss treatments, pricing, and more.",
};

export default async function FaqPage() {
  const supportEmail = await getSupportEmail();

  return (
    <>
      <Header />
      <FaqClient supportEmail={supportEmail} />
      <Footer />
    </>
  );
}
