import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import InstagramIcon from "@/components/InstagramIcon";
import SectionTitle from "@/components/SectionTitle";
import { ETSY_SHOP_URL, INSTAGRAM_URL } from "@/lib/products";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez HandRope Paris pour une taille spéciale, une couleur précise ou une commande cadeau."
};

export default function ContactPage() {
  return (
    <section className="px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionTitle
            eyebrow="Contact"
            title="Une taille spéciale, une couleur précise, un cadeau ?"
            description="Pour une taille spéciale, une couleur précise ou une commande cadeau, envoie-nous un message."
          />
          <p className="mt-8 max-w-xl leading-7 text-muted">
            Les commandes et les paiements passent toujours par Etsy. Pour une
            question de taille, de couleur ou de cadeau, tu peux écrire ici ou
            passer directement par Etsy.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={ETSY_SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center rounded-full bg-warm-gradient px-7 py-3 text-sm font-bold text-[#130f1f] shadow-glow transition hover:scale-[1.02]"
            >
              Écrire via Etsy
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#fd1d1d]/45 px-7 py-3 text-sm font-semibold text-[#ff5f7e] transition hover:border-[#f77737]/70 hover:bg-[#fd1d1d]/10 hover:text-[#f77737]"
            >
              <InstagramIcon className="h-4 w-4" />
              Instagram
            </a>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
