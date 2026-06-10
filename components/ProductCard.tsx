import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import MotionWrapper from "@/components/MotionWrapper";
import type { Product } from "@/lib/products";

type ProductCardProps = {
  product: Product;
};

const priceFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR"
});

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <MotionWrapper className="h-full">
      <Link
        href={`/products/${product.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface/82 shadow-warm transition duration-300 hover:-translate-y-1 hover:border-accent-purple/60 hover:bg-surface-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple"
      >
        <ProductImage
          src={product.images[0]}
          alt={`Bracelet HandRope Paris ${product.name}`}
          name={product.name}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="aspect-[4/3] rounded-none border-0 border-b border-border"
          imageClassName="group-hover:scale-105"
        />
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl font-semibold text-foreground">
                {product.name}
              </h3>
              <p className="mt-1 text-sm text-muted">
                {product.colors.join(" / ")}
              </p>
            </div>
            <p className="rounded-full border border-accent-warm/30 bg-accent-warm/10 px-3 py-1 text-sm font-semibold text-sand">
              {priceFormatter.format(product.price)}
            </p>
          </div>
          <p className="mt-4 flex-1 text-sm leading-6 text-muted">
            {product.shortDescription}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <span
                key={color}
                className="rounded-full border border-border bg-background/50 px-3 py-1 text-xs text-muted"
              >
                {color}
              </span>
            ))}
          </div>
          <span className="mt-6 inline-flex items-center text-sm font-semibold text-accent-purple-soft transition group-hover:text-accent-warm">
            Voir le modèle
            <span className="ml-2" aria-hidden="true">
              →
            </span>
          </span>
        </div>
      </Link>
    </MotionWrapper>
  );
}
