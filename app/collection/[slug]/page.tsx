import type { Metadata } from "next";
import EtsyProductDetail from "@/components/EtsyProductDetail";
import fallbackProducts from "@/data/products-fallback.json";
import { etsyProductTitle, type EtsyProduct } from "@/lib/etsy-products";

type CollectionProductPageProps = {
  params: {
    slug: string;
  };
};

const fallback = fallbackProducts as EtsyProduct[];

export function generateStaticParams() {
  return fallback.map((product) => ({
    slug: product.slug
  }));
}

export function generateMetadata({
  params
}: CollectionProductPageProps): Metadata {
  const product = fallback.find((item) => item.slug === params.slug);
  const title = product ? etsyProductTitle(product.title) : "Bracelet";

  return {
    title: `${title} — Collection`,
    description:
      product?.shortDescription ??
      "Bracelet HandRope Paris en paracorde fait main."
  };
}

export default function CollectionProductPage({
  params
}: CollectionProductPageProps) {
  return <EtsyProductDetail slug={params.slug} />;
}
