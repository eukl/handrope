import type { Metadata } from "next";
import EtsyProductsGrid from "@/components/EtsyProductsGrid";
import SectionTitle from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "La collection",
  description:
    "Bracelets HandRope Paris en paracorde faits main, inspirés par le voyage, la mer, la route et les jours dehors."
};

export default function CollectionPage() {
  return (
    <section className="px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          eyebrow="Bracelets"
          title="La collection"
          description="Des bracelets en paracorde faits main à Paris. Cinq modèles pour le moment, chacun avec ses couleurs, son nom et son terrain."
        />

        <EtsyProductsGrid />
      </div>
    </section>
  );
}
