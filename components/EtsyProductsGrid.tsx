"use client";

import { useEffect, useState } from "react";
import EtsyProductCard from "@/components/EtsyProductCard";
import fallbackProducts from "@/data/products-fallback.json";
import type { EtsyProduct } from "@/lib/etsy-products";

type EtsyProductsGridProps = {
  featuredOnly?: boolean;
};

const featuredTitles = ["Dune", "Sea Shanty", "Vespa"];
const fallback = fallbackProducts as EtsyProduct[];

function sortFeaturedProducts(products: EtsyProduct[]) {
  return [...products].sort((a, b) => {
    const aIndex = featuredTitles.findIndex((title) =>
      a.title.toLowerCase().includes(title.toLowerCase())
    );
    const bIndex = featuredTitles.findIndex((title) =>
      b.title.toLowerCase().includes(title.toLowerCase())
    );

    return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
  });
}

export default function EtsyProductsGrid({
  featuredOnly = false
}: EtsyProductsGridProps) {
  const [products, setProducts] = useState<EtsyProduct[]>(fallback);
  const [isLoading, setIsLoading] = useState(fallback.length === 0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        const response = await fetch("/api/etsy/products");

        if (!response.ok) {
          throw new Error(`Products API returned ${response.status}`);
        }

        const data = (await response.json()) as EtsyProduct[];

        if (isMounted) {
          setProducts(data);
        }
      } catch (error) {
        console.error("[etsy-products-grid] Unable to load products", error);

        if (isMounted) {
          setProducts(fallback);
          setHasError(fallback.length === 0);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleProducts = featuredOnly
    ? sortFeaturedProducts(products).slice(0, 3)
    : products;

  if (isLoading) {
    return (
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="h-[28rem] animate-pulse rounded-lg border border-border bg-surface/60"
          />
        ))}
      </div>
    );
  }

  if (hasError || visibleProducts.length === 0) {
    return (
      <div className="mt-10 rounded-lg border border-border bg-surface/80 p-6 text-sm text-muted">
        La collection est indisponible pour le moment. Tu peux retrouver les
        bracelets directement sur Etsy.
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {visibleProducts.map((product) => (
        <EtsyProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
