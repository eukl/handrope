import Link from "next/link";
import EtsyHeroProducts from "@/components/EtsyHeroProducts";
import EtsyProductsGrid from "@/components/EtsyProductsGrid";
import MotionWrapper from "@/components/MotionWrapper";
import ReviewCard from "@/components/ReviewCard";
import SectionTitle from "@/components/SectionTitle";
import { reviews } from "@/lib/reviews";

const promises = [
  {
    title: "Fait main à Paris",
    text: "Petites séries, tressage propre, finitions vérifiées à la main. Rien d'industriel, rien de compliqué."
  },
  {
    title: "De la corde, simplement",
    text: "De la paracorde résistante, des noeuds coulissants, un port facile au quotidien. Le bracelet doit tenir, c'est tout."
  },
  {
    title: "Commande via Etsy",
    text: "Les achats passent par Etsy pour garder un paiement clair, sécurisé, et un suivi simple de la commande."
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
  return (
    <>
      <section className="noise-layer relative overflow-hidden px-4 pt-28 sm:px-6 lg:px-8">
        <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-accent-purple/20 blur-3xl" />
        <div className="absolute right-0 top-48 h-80 w-80 rounded-full bg-accent-orange/14 blur-3xl" />
        <div className="relative mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-12 pb-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(25rem,0.85fr)] lg:gap-16">
          <MotionWrapper className="relative z-10 min-w-0">
            <p className="mb-5 inline-flex rounded-full border border-accent-warm/30 bg-accent-warm/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-sand">
              Fait main à Paris. Prêt à partir.
            </p>
            <h1 className="max-w-4xl text-balance font-display text-5xl font-semibold leading-[0.98] text-foreground sm:text-6xl lg:text-7xl">
              Des bracelets faits pour te suivre, pas pour rester en vitrine.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              HandRope fabrique des bracelets simples, solides et réglables,
              inspirés par le voyage, les cordages, le sable et les objets
              qu&apos;on
              garde longtemps.
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
            <EtsyHeroProducts />
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
              eyebrow="Collection"
              title="Cinq modèles, chacun avec son terrain."
              description="Désert, mer, route, Italie, clin d'oeil français. Les noms ne sont pas là pour décorer : ils donnent le ton du bracelet."
            />
            <Link
              href="/collection"
              className="inline-flex w-fit rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:border-accent-warm hover:text-sand"
            >
              Toute la collection
            </Link>
          </div>
          <EtsyProductsGrid featuredOnly />
        </div>
      </section>

      <section className="bg-surface/55 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionTitle
            eyebrow="Terrain"
            title="Fait pour bouger, pas pour être fragile."
            description="Un bracelet réglable, résistant à l'eau, pensé pour rester au poignet pendant les journées normales comme les départs improvisés."
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
            Fait main à Paris. Sans surproduction.
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            Choisis le modèle qui te parle.
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
