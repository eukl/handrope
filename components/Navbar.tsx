"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import InstagramIcon from "@/components/InstagramIcon";
import { ETSY_SHOP_URL, INSTAGRAM_URL } from "@/lib/products";

const links = [
  { href: "/collection", label: "Collection" },
  { href: "/about", label: "À propos" },
  { href: "/contact", label: "Contact" }
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition duration-300",
        isScrolled
          ? "border-b border-border bg-background/88 shadow-lg shadow-black/20 backdrop-blur-xl"
          : "bg-transparent"
      ].join(" ")}
    >
      <nav className="mx-auto flex h-24 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple"
          aria-label="HandRope, accueil"
        >
          <BrandLogo className="text-[2.35rem] leading-none sm:text-[2.7rem]" />
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "text-sm font-medium transition hover:text-foreground",
                  isActive ? "text-foreground" : "text-muted"
                ].join(" ")}
              >
                {link.label}
              </Link>
            );
          })}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#fd1d1d]/35 px-3.5 py-2 text-sm font-semibold text-[#ff5f7e] transition hover:border-[#f77737]/60 hover:bg-[#fd1d1d]/10 hover:text-[#f77737]"
          >
            <InstagramIcon className="h-4 w-4" />
            Instagram
          </a>
          <a
            href={ETSY_SHOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-accent-warm/40 px-4 py-2 text-sm font-semibold text-sand transition hover:border-accent-warm hover:bg-accent-warm/10"
          >
            Boutique Etsy
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/70 md:hidden"
          aria-label="Ouvrir le menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
        >
          <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
            <span
              className={[
                "h-0.5 rounded-full bg-foreground transition",
                isOpen ? "translate-y-2 rotate-45" : ""
              ].join(" ")}
            />
            <span
              className={[
                "h-0.5 rounded-full bg-foreground transition",
                isOpen ? "opacity-0" : ""
              ].join(" ")}
            />
            <span
              className={[
                "h-0.5 rounded-full bg-foreground transition",
                isOpen ? "-translate-y-2 -rotate-45" : ""
              ].join(" ")}
            />
          </span>
        </button>
      </nav>

      {isOpen ? (
        <div className="border-t border-border bg-background/96 px-4 pb-5 pt-2 backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-3 text-base font-medium text-muted transition hover:bg-surface hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-3 text-base font-semibold text-[#ff5f7e] transition hover:bg-[#fd1d1d]/10 hover:text-[#f77737]"
            >
              <InstagramIcon className="h-5 w-5" />
              Instagram
            </a>
            <a
              href={ETSY_SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 rounded-lg border border-accent-warm/40 px-3 py-3 text-center font-semibold text-sand"
            >
              Boutique Etsy
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
