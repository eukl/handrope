import MotionWrapper from "@/components/MotionWrapper";
import ProductImage from "@/components/ProductImage";
import {
  etsyProductTitle,
  formatEtsyPrice,
  type EtsyProduct
} from "@/lib/etsy-products";

type EtsyProductCardProps = {
  product: EtsyProduct;
};

export default function EtsyProductCard({ product }: EtsyProductCardProps) {
  const title = etsyProductTitle(product.title);

  return (
    <MotionWrapper className="h-full">
      <a
        href={product.etsyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface/82 shadow-warm transition duration-300 hover:-translate-y-1 hover:border-accent-purple/60 hover:bg-surface-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple"
      >
        <ProductImage
          src={product.image}
          alt={`Bracelet HandRope Paris ${title}`}
          name={title}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="aspect-[4/3] rounded-none border-0 border-b border-border"
          imageClassName="group-hover:scale-105"
        />
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-display text-2xl font-semibold text-foreground">
              {title}
            </h3>
            <p className="shrink-0 rounded-full border border-accent-warm/30 bg-accent-warm/10 px-3 py-1 text-sm font-semibold text-sand">
              {formatEtsyPrice(product.price, product.currency)}
            </p>
          </div>
          <p className="mt-4 flex-1 text-sm leading-6 text-muted">
            {product.shortDescription}
          </p>
          <span className="mt-6 inline-flex items-center text-sm font-semibold text-accent-purple-soft transition group-hover:text-accent-warm">
            Commander sur Etsy
            <span className="ml-2" aria-hidden="true">
              →
            </span>
          </span>
        </div>
      </a>
    </MotionWrapper>
  );
}
