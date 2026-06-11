import type { Metadata } from "next";
import { ETSY_SHOP_URL, INSTAGRAM_URL } from "@/lib/products";
import SectionTitle from "@/components/SectionTitle";

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
            description="Pour une taille spéciale, une couleur précise ou une commande cadeau, envoie-moi un message."
          />
          <p className="mt-8 max-w-xl leading-7 text-muted">
            Le site ne gère pas de backend ni de paiement. Les commandes et les
            échanges liés à l’achat passent directement par Etsy.
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
              className="inline-flex justify-center rounded-full border border-accent-purple/50 px-7 py-3 text-sm font-semibold text-accent-purple-soft transition hover:bg-accent-purple/10"
            >
              Instagram
            </a>
          </div>
        </div>

        <form className="rounded-lg border border-border bg-surface/82 p-6 sm:p-8">
          <p className="mb-6 text-sm leading-6 text-muted">
            Formulaire statique pour l’instant : aucun message n’est envoyé
            depuis ce site. Utilise Etsy pour une réponse directe.
          </p>
          <div className="grid gap-5">
            <label className="grid gap-2 text-sm font-semibold text-foreground">
              Nom
              <input
                type="text"
                name="name"
                disabled
                placeholder="Ton nom"
                className="rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-dark disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-foreground">
              Email
              <input
                type="email"
                name="email"
                disabled
                placeholder="ton@email.fr"
                className="rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-dark disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-foreground">
              Message
              <textarea
                name="message"
                disabled
                rows={6}
                placeholder="Taille, couleur, idée cadeau..."
                className="resize-none rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-dark disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
            <button
              type="button"
              disabled
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-muted-dark disabled:cursor-not-allowed"
            >
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
