import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FaqClient from "./FaqClient";

export const metadata = {
  title: "Frequently Asked Questions | NewFastRx",
  description: "Find answers to frequently asked questions about NewFastRx telehealth services, GLP-1 weight loss treatments, pricing, and more.",
};

export default function FaqPage() {
  return (
    <>
      <Header />
      <FaqClient />
      <Footer />
    </>
  );
}
