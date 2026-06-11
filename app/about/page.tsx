import type { Metadata } from "next";
import SectionTitle from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "HandRope Paris fabrique des bracelets en paracorde faits main, simples, solides et inspirés par l'outdoor."
};

const sections = [
  {
    title: "HandRope Paris",
    text: "HandRope part d'une idée simple : fabriquer des bracelets solides, propres, faciles à porter. Pas une marque de mode, plutôt un petit atelier pour des objets qu'on garde au poignet."
  },
  {
    title: "Pourquoi la paracorde",
    text: "La paracorde vient d'un univers utile : léger, solide, souple. Bien choisie et bien tressée, elle devient un bracelet simple, confortable, prêt à suivre."
  },
  {
    title: "Fait main, sans surproduction",
    text: "Les bracelets sont fabriqués à Paris, en petites quantités. L'idée n'est pas de remplir des étagères, mais de sortir des pièces propres, cohérentes et prêtes à partir."
  },
  {
    title: "Pensé pour le quotidien",
    text: "Douche, sommeil, voyage, bivouac, bateau, montagne, moto, sport, randonnée ou journée normale : le bracelet est fait pour rester au poignet sans demander d'attention particulière."
  },
  {
    title: "Pas de promesse absurde",
    text: "HandRope ne vend pas un superpouvoir. Juste un bracelet solide, simple, réglable, fait avec soin. Il doit tenir sa place, pas raconter n'importe quoi."
  }
];

export default function AboutPage() {
  return (
    <section className="px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          eyebrow="Atelier"
          title="Un petit atelier, de la corde, des bracelets faits pour suivre."
          description="HandRope mélange paracorde, couleurs de voyage et fabrication simple. Rien de surjoué, juste des bracelets qu'on a envie d'emmener."
        />

        <div className="mt-12 grid gap-5">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-lg border border-border bg-surface/72 p-6 sm:p-8"
            >
              <h2 className="font-display text-3xl font-semibold text-foreground">
                {section.title}
              </h2>
              <p className="mt-4 max-w-4xl leading-7 text-muted">
                {section.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
