import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NewFastRx — Online Doctor Visits & Rx Delivery",
  description:
    "Skip the waiting room. NewFastRx connects you to licensed doctors online for quick consultations, prescriptions, and home delivery - fast, secure, and discreet.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:opsz,wght@6..12,300;6..12,400;6..12,500;6..12,600;6..12,700;6..12,800&family=Montserrat:wght@500;600;700;800;900&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
