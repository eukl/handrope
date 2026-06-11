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
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/favicon.svg",
        color: "#b294ff"
      }
    ]
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
