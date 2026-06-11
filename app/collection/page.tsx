import type { Metadata } from "next";
import EtsyProductsGrid from "@/components/EtsyProductsGrid";
import SectionTitle from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "La collection",
  description:
    "Découvrez les bracelets HandRope Paris en paracorde faits main : Dune, Sea Shanty, Mona Lisa, Vespa et Paint It Black."
};

export default function CollectionPage() {
  return (
    <section className="px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          eyebrow="Bracelets"
          title="La collection"
          description="Des modèles en paracorde faits main à Paris, inspirés par le voyage, la musique, le cinéma et les objets qui tiennent vraiment."
        />

        <EtsyProductsGrid />
      </div>
    </section>
  );
}
