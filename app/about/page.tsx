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
    title: "Fait main, sans surproduction",
    text: "Chaque bracelet est fabriqué à la commande, à la main, en petite série. Nous préférons prendre le temps de réaliser chaque pièce correctement plutôt que de produire en quantité. L'objectif est simple : proposer des bracelets solides, bien finis et prêts à vous accompagner longtemps."
  },
  {
    title: "Pensé pour le quotidien",
    text: "Douche, sommeil, voyage, bivouac, bateau, montagne, moto, sport, randonnée ou journée normale : le bracelet est fait pour rester au poignet sans demander d'attention particulière."
  }
];

export default function AboutPage() {
  return (
    <section className="px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          eyebrow="Atelier"
          title="Un petit atelier, de la corde, des bracelets faits pour vous suivre."
          description="Chez HandRope, nous créons des bracelets en paracorde pensés pour accompagner les sorties, les voyages et les années qui passent."
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
