import Link from "next/link";
import MotionWrapper from "@/components/MotionWrapper";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import ReviewCard from "@/components/ReviewCard";
import SectionTitle from "@/components/SectionTitle";
import { featuredProducts, products } from "@/lib/products";
import { reviews } from "@/lib/reviews";

const promises = [
  {
    title: "Fait main à Paris",
    text: "Chaque bracelet est préparé à l’atelier, avec une attention simple portée au tressage, aux finitions et au confort."
  },
  {
    title: "Pensé pour durer",
    text: "Paracorde résistante, nœuds coulissants, port quotidien. Pas fragile. Pas précieux. Juste fiable."
  },
  {
    title: "Achat sécurisé via Etsy",
    text: "Pas de panier caché ni de paiement bricolé ici. La commande et le paiement se font directement sur Etsy."
  }
];

const usages = [
  "Bivouac",
  "Bateau",
  "Moto",
  "Montagne",
  "Sport",
  "Voyage",
  "Cadeau"
];

export default function HomePage() {
  const heroProducts = featuredProducts.slice(0, 3);
  const highlightedProducts = products.filter((product) =>
    ["dune", "sea-shanty", "vespa"].includes(product.slug)
  );

  return (
    <>
      <section className="noise-layer relative overflow-hidden px-4 pt-28 sm:px-6 lg:px-8">
        <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-accent-purple/20 blur-3xl" />
        <div className="absolute right-0 top-48 h-80 w-80 rounded-full bg-accent-orange/14 blur-3xl" />
        <div className="relative mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-12 pb-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(25rem,0.85fr)] lg:gap-16">
          <MotionWrapper className="relative z-10 min-w-0">
            <p className="mb-5 inline-flex rounded-full border border-accent-warm/30 bg-accent-warm/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-sand">
              Porté au poignet. Prêt pour l’aventure.
            </p>
            <h1 className="max-w-4xl text-balance font-display text-5xl font-semibold leading-[0.98] text-foreground sm:text-6xl lg:text-7xl">
              Des bracelets faits pour suivre, pas pour rester en vitrine.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              HandRope Paris fabrique des bracelets en paracorde faits main,
              solides, réglables et prêts à accompagner le quotidien comme les
              aventures.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/collection"
                className="inline-flex items-center justify-center rounded-full bg-warm-gradient px-6 py-3 text-sm font-bold text-[#130f1f] shadow-glow transition hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-warm"
              >
                Voir la collection
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full border border-border bg-surface/60 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-accent-purple/70 hover:bg-surface"
              >
                Découvrir l’atelier
              </Link>
            </div>
          </MotionWrapper>

          <MotionWrapper
            delay={0.12}
            className="relative z-0 w-full min-w-0 justify-self-end lg:max-w-[42rem]"
          >
            <div className="absolute -left-4 top-10 h-48 w-48 rounded-full bg-accent-purple/20 blur-3xl" />
            <div className="absolute -right-8 bottom-16 h-48 w-48 rounded-full bg-accent-warm/16 blur-3xl" />
            <div className="relative mx-auto h-[53rem] w-full max-w-[42rem] sm:h-[43rem] lg:h-[37rem]">
              {heroProducts.map((product, index) => (
                <div
                  key={product.slug}
                  className={[
                    "absolute rounded-lg border border-border bg-surface/82 p-3 shadow-warm backdrop-blur",
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
                    src={product.images[0]}
                    alt={`Bracelet ${product.name}`}
                    name={product.name}
                    sizes="(min-width: 1024px) 28vw, 33vw"
                    className="aspect-[4/3]"
                  />
                  <div className="mt-3">
                    <span className="font-display text-xl font-semibold">
                      {product.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </MotionWrapper>
        </div>
      </section>

      <section className="border-y border-border bg-surface/45 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {promises.map((promise, index) => (
            <MotionWrapper
              key={promise.title}
              delay={index * 0.08}
              className="rounded-lg border border-border bg-background/50 p-6"
            >
              <h2 className="font-display text-2xl font-semibold text-foreground">
                {promise.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                {promise.text}
              </p>
            </MotionWrapper>
          ))}
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionTitle
              eyebrow="Modèles"
              title="Les bracelets qui ouvrent la marche."
              description="Dune, Sea Shanty et Vespa posent l’univers HandRope : solide, culturel, portable, sans mise en scène inutile."
            />
            <Link
              href="/collection"
              className="inline-flex w-fit rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:border-accent-warm hover:text-sand"
            >
              Toute la collection
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {highlightedProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface/55 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionTitle
            eyebrow="Terrain"
            title="Un morceau de corde, un objet quotidien, un compagnon d’aventure."
            description="Le bracelet ne décide pas de l’aventure à ta place. Il tient au poignet pendant que tu vis le reste."
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {usages.map((usage) => (
              <MotionWrapper key={usage} className="h-full">
                <div className="flex min-h-24 items-center justify-center rounded-lg border border-border bg-background/50 px-4 text-center font-semibold text-foreground transition hover:border-accent-purple/60">
                  {usage}
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            eyebrow="Avis Etsy"
            title="Simple, robuste, bien fait."
            description="Les vrais retours laissés par les clients sur la boutique Etsy HandRope."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-lg border border-border bg-surface-grain p-8 text-center shadow-glow sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-accent-warm">
            Fait main à Paris. Pensé pour durer.
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            Choisis ton bracelet. Il fera le reste.
          </h2>
          <Link
            href="/collection"
            className="mt-8 inline-flex rounded-full bg-warm-gradient px-7 py-3 text-sm font-bold text-[#130f1f] shadow-warm transition hover:scale-[1.02]"
          >
            Voir toute la collection
          </Link>
        </div>
      </section>
    </>
  );
}
