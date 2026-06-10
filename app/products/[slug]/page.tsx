import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";
import SectionTitle from "@/components/SectionTitle";
import { getProductBySlug, products } from "@/lib/products";

type ProductPageProps = {
  params: {
    slug: string;
  };
};

const priceFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR"
});

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug
  }));
}

export function generateMetadata({ params }: ProductPageProps): Metadata {
  const product = getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Produit introuvable"
    };
  }

  return {
    title: `${product.name} — Bracelet en paracorde fait main`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} — HandRope Paris`,
      description: product.shortDescription
    }
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
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
          <ProductGallery images={product.images} name={product.name} />

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent-warm">
              Bracelet HandRope Paris
            </p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-tight text-foreground sm:text-6xl">
              {product.name}
            </h1>
            <p className="mt-4 text-2xl font-semibold text-sand">
              {priceFormatter.format(product.price)}
            </p>
            <p className="mt-6 text-lg leading-8 text-muted">
              {product.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <span
                  key={color}
                  className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted"
                >
                  {color}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href={product.etsyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-warm-gradient px-7 py-3 text-sm font-bold text-background shadow-glow transition hover:scale-[1.02]"
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
              L’achat et le paiement sont gérés directement par Etsy.
            </p>

            <div className="mt-12 grid gap-8 border-t border-border pt-10">
              <div>
                <h2 className="font-display text-3xl font-semibold text-foreground">
                  L’inspiration
                </h2>
                <p className="mt-4 leading-7 text-muted">{product.story}</p>
              </div>

              <div>
                <h2 className="font-display text-3xl font-semibold text-foreground">
                  Détails
                </h2>
                <ul className="mt-4 grid gap-3 text-sm text-muted sm:grid-cols-2">
                  {product.specs.map((spec) => (
                    <li
                      key={spec}
                      className="rounded-lg border border-border bg-surface/70 px-4 py-3"
                    >
                      {spec}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm leading-6 text-muted-dark">
                  Selon les modèles, certaines paracordes peuvent avoir des
                  caractéristiques différentes. Les détails précis sont indiqués
                  sur la fiche Etsy.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <SectionTitle
            eyebrow="Tailles"
            title="Réglable, simple à porter."
            description="Les nœuds coulissants permettent d’ajuster le bracelet facilement. Pour une taille spéciale ou un cadeau, le plus simple reste de demander avant la commande."
          />
        </div>
      </div>
    </section>
  );
}
