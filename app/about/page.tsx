import type { Metadata } from "next";
import SectionTitle from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez HandRope Paris, une marque française de bracelets en paracorde faits main à Paris, solides, sobres et pensés pour le quotidien."
};

const sections = [
  {
    title: "HandRope Paris",
    text: "HandRope est né d’un goût simple pour les objets utiles, solides, bien faits. Un bracelet n’a pas besoin d’en faire des tonnes. Il doit tenir, se porter facilement, et accompagner ce qu’on vit."
  },
  {
    title: "Pourquoi la paracorde",
    text: "La paracorde a ce mélange rare : légère, résistante, souple, agréable à porter. Elle vient d’un univers fonctionnel, mais elle peut devenir un objet personnel quand elle est bien choisie et bien travaillée."
  },
  {
    title: "Fait main, sans surproduction",
    text: "Les bracelets sont fabriqués à Paris, en petites quantités. L'idée n'est pas de remplir des étagères, mais de proposer des pièces propres, cohérentes, prêtes à partir."
  },
  {
    title: "Pensé pour le quotidien",
    text: "Douche, sommeil, voyage, bivouac, bateau, montagne, moto, sport, randonnée ou journée normale : le bracelet est fait pour rester au poignet sans demander d'attention particulière."
  },
  {
    title: "Pas de promesse absurde",
    text: "HandRope ne vend pas un superpouvoir. Juste un bracelet solide, simple, réglable, fait avec soin. Pas fragile. Pas précieux. Juste fiable."
  }
];

export default function AboutPage() {
  return (
    <section className="px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          eyebrow="Atelier"
          title="Fait main à Paris. Pensé pour durer."
          description="Une approche directe, artisanale et honnête du bracelet en paracorde."
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
