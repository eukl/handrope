import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { ETSY_SHOP_URL, INSTAGRAM_URL } from "@/lib/products";

const footerLinks = [
  { href: "/collection", label: "Collection" },
  { href: "/about", label: "À propos" },
  { href: "/contact", label: "Contact" }
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <BrandLogo showParis className="text-[2.35rem] leading-none sm:text-[2.7rem]" />
          <p className="mt-3 max-w-md text-sm leading-6 text-muted">
            Bracelets en paracorde faits main à Paris. Simples, solides,
            réglables, inspirés par la route, la mer et les jours dehors.
          </p>
          <p className="mt-4 text-sm font-medium text-sand">
            Achat sécurisé via Etsy
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-dark">
            Navigation
          </p>
          <div className="mt-4 flex flex-col gap-3">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted transition hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-dark">
            Atelier
          </p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-muted">
            <span>Fait main à Paris</span>
            <a
              href={ETSY_SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-foreground"
            >
              Boutique Etsy
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-accent-purple-soft"
            >
              Instagram @handrope_craft
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border px-4 py-5 text-center text-xs text-muted-dark">
        © 2026 HandRope Paris. Pas de panier ici, les commandes passent par Etsy.
      </div>
    </footer>
  );
}
