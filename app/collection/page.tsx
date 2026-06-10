import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import SectionTitle from "@/components/SectionTitle";
import { products } from "@/lib/products";

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

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
