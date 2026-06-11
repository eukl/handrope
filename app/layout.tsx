import type { Metadata } from "next";
import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "HandRope Paris — Bracelets en paracorde faits main",
    template: "%s — HandRope Paris"
  },
  description:
    "Bracelets artisanaux en paracorde faits main à Paris. Solides, réglables, inspirés par l'outdoor, la route, la mer et le voyage.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg"
  },
  openGraph: {
    title: "HandRope Paris — Bracelets en paracorde faits main",
    description:
      "Bracelets artisanaux en paracorde faits main à Paris. Solides, réglables, inspirés par l'outdoor, la route, la mer et le voyage.",
    siteName: "HandRope Paris",
    locale: "fr_FR",
    type: "website"
  }
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
