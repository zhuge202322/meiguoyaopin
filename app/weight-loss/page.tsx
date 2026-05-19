import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WeightLossClient from "./WeightLossClient";

export const metadata = {
  title: "Personalized GLP-1 Weight Loss | Flat Pricing by MyFastRx",
  description:
    "Doctor-guided GLP-1 weight loss from MyFastRx. One flat price for any dose, free doctor consult and discreet shipping. Start your free visit today.",
};

export default function WeightLossPage() {
  return (
    <>
      <Header />
      <WeightLossClient />
      <Footer />
    </>
  );
}