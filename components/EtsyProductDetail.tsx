"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ProductGallery from "@/components/ProductGallery";
import fallbackProducts from "@/data/products-fallback.json";
import {
  etsyProductTitle,
  formatEtsyPrice,
  type EtsyProduct
} from "@/lib/etsy-products";
import {
  getProductCopyForSlug,
  productDetails
} from "@/lib/product-copy";

type EtsyProductDetailProps = {
  slug: string;
};

const fallback = fallbackProducts as EtsyProduct[];

function findProductBySlug(products: EtsyProduct[], slug: string) {
  return products.find((product) => product.slug === slug);
}

export default function EtsyProductDetail({ slug }: EtsyProductDetailProps) {
  const [products, setProducts] = useState<EtsyProduct[]>(fallback);
  const [hasLoaded, setHasLoaded] = useState(false);

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
          setProducts(data.length > 0 ? data : fallback);
        }
      } catch (error) {
        console.error("[etsy-product-detail] Unable to load product", error);

        if (isMounted) {
          setProducts(fallback);
        }
      } finally {
        if (isMounted) {
          setHasLoaded(true);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const product = findProductBySlug(products, slug);
  const copy = getProductCopyForSlug(slug);
  const title = product
    ? copy?.name ?? etsyProductTitle(product.title)
    : copy?.name ?? "Modèle HandRope";
  const images = useMemo(() => {
    if (!product) {
      return [];
    }

    return product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [];
  }, [product]);

  if (!product && !hasLoaded) {
    return (
      <section className="px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-muted">Chargement du modèle...</p>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-lg border border-border bg-surface/72 p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent-warm">
            Collection
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-foreground">
            Modèle introuvable
          </h1>
          <p className="mt-4 leading-7 text-muted">
            Ce bracelet n&apos;est pas disponible dans la collection actuelle.
          </p>
          <Link
            href="/collection"
            className="mt-8 inline-flex rounded-full border border-border px-7 py-3 text-sm font-semibold text-foreground transition hover:border-accent-purple/70"
          >
            Retour à la collection
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/collection"
          className="mb-8 inline-flex text-sm font-semibold text-muted transition hover:text-foreground"
        >
          ← Retour à la collection
        </Link>

        <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <ProductGallery images={images} name={title} />

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent-warm">
              Bracelet HandRope Paris
            </p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-tight text-foreground sm:text-6xl">
              {title}
            </h1>
            <p className="mt-4 text-2xl font-semibold text-sand">
              {formatEtsyPrice(product.price, product.currency)}
            </p>
            <p className="mt-6 text-lg leading-8 text-muted">
              {copy?.description ?? product.shortDescription}
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href={product.etsyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-warm-gradient px-7 py-3 text-sm font-bold text-[#130f1f] shadow-glow transition hover:scale-[1.02]"
              >
                Commander sur Etsy
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-border px-7 py-3 text-sm font-semibold text-foreground transition hover:border-accent-purple/70"
              >
                Question taille ou couleur
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-dark">
              L&apos;achat et le paiement sont gérés directement par Etsy.
            </p>

            <div className="mt-12 grid gap-8 border-t border-border pt-10">
              <div>
                <h2 className="font-display text-3xl font-semibold text-foreground">
                  L&apos;inspiration
                </h2>
                <p className="mt-4 leading-7 text-muted">
                  {copy?.story ?? product.shortDescription}
                </p>
              </div>

              <div>
                <h2 className="font-display text-3xl font-semibold text-foreground">
                  Détails
                </h2>
                <ul className="mt-4 grid gap-3 text-sm text-muted sm:grid-cols-2">
                  {productDetails.map((detail) => (
                    <li
                      key={detail}
                      className="rounded-lg border border-border bg-surface/70 px-4 py-3"
                    >
                      {detail}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm leading-6 text-muted-dark">
                  Les détails exacts du listing, les options disponibles et les
                  délais sont indiqués sur la fiche Etsy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
