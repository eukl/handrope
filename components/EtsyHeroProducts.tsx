"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ProductImage from "@/components/ProductImage";
import fallbackProducts from "@/data/products-fallback.json";
import {
  etsyProductTitle,
  slugifyEtsyTitle,
  type EtsyProduct
} from "@/lib/etsy-products";

const preferredHeroProducts = ["Dune", "Sea Shanty", "Vespa"];
const fallback = fallbackProducts as EtsyProduct[];

function heroProductsFrom(products: EtsyProduct[]) {
  const preferred = preferredHeroProducts
    .map((title) =>
      products.find((product) =>
        product.title.toLowerCase().includes(title.toLowerCase())
      )
    )
    .filter(Boolean) as EtsyProduct[];

  return preferred.length >= 3 ? preferred : products.slice(0, 3);
}

export default function EtsyHeroProducts() {
  const [products, setProducts] = useState<EtsyProduct[]>(fallback);

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
        console.error("[etsy-hero-products] Unable to load products", error);

        if (isMounted) {
          setProducts(fallback);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const heroProducts = useMemo(() => heroProductsFrom(products), [products]);
  const displayProducts =
    heroProducts.length > 0
      ? heroProducts
      : preferredHeroProducts.map((title) => ({
          id: title,
          slug: slugifyEtsyTitle(title),
          title,
          price: 0,
          currency: "EUR",
          shortDescription: "",
          image: "",
          images: [],
          etsyUrl: "#"
        }));

  return (
    <div className="relative mx-auto h-[53rem] w-full max-w-[42rem] sm:h-[43rem] lg:h-[37rem]">
      {displayProducts.map((product, index) => {
        const title = etsyProductTitle(product.title);

        return (
          <Link
            key={product.id}
            href={`/collection/${product.slug}`}
            className={[
              "absolute rounded-lg border border-border bg-surface/82 p-3 shadow-warm backdrop-blur transition hover:-translate-y-1 hover:border-accent-purple/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple",
              index === 0
                ? "left-0 top-0 w-[82%] sm:w-[47%] lg:w-[48%]"
                : "",
              index === 1
                ? "right-0 top-[18rem] w-[82%] sm:top-10 sm:w-[47%] lg:top-12 lg:w-[48%]"
                : "",
              index === 2
                ? "bottom-0 left-1/2 w-[82%] -translate-x-1/2 sm:w-[58%] lg:w-[60%]"
                : ""
            ].join(" ")}
          >
            <ProductImage
              src={product.image}
              alt={`Bracelet ${title}`}
              name={title}
              sizes="(min-width: 1024px) 28vw, 33vw"
              className="aspect-[4/3]"
            />
            <div className="mt-3">
              <span className="font-display text-xl font-semibold text-foreground">
                {title}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
