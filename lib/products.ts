import { productCopyBySlug } from "@/lib/product-copy";

export type Product = {
  slug: string;
  name: string;
  price: number;
  etsyUrl: string;
  shortDescription: string;
  description: string;
  story: string;
  specs: string[];
  images: string[];
  colors: string[];
  inStock: boolean;
  featured?: boolean;
};

export const ETSY_SHOP_URL = "https://www.etsy.com/shop/HandRope";
export const INSTAGRAM_URL = "https://www.instagram.com/handrope_craft/";

const commonSpecs = [
  "Bracelet fait main à Paris",
  "Paracorde résistante",
  "Réglable grâce aux noeuds coulissants",
  "Pensé pour être porté tous les jours",
  "Résiste à l'eau",
  "Disponible en plusieurs tailles"
];

const productImages = (slug: string) => [
  `/products/${slug}/${slug}-1.jpg`,
  `/products/${slug}/${slug}-2.jpg`,
  `/products/${slug}/${slug}-3.jpg`
];

export const products: Product[] = [
  {
    slug: "dune",
    name: "Dune",
    price: 24.9,
    etsyUrl:
      "https://www.etsy.com/fr/listing/4517031306/dune-bracelet-paracorde-beige-homme",
    shortDescription: productCopyBySlug.dune.shortDescription,
    description: productCopyBySlug.dune.description,
    story: productCopyBySlug.dune.story,
    specs: commonSpecs,
    images: productImages("dune"),
    colors: ["Sable", "Beige", "Terracotta"],
    inStock: true,
    featured: true
  },
  {
    slug: "sea-shanty",
    name: "Sea Shanty",
    price: 24.9,
    etsyUrl:
      "https://www.etsy.com/fr/listing/4517041881/sea-shanty-bracelet-paracorde-bleu",
    shortDescription: productCopyBySlug["sea-shanty"].shortDescription,
    description: productCopyBySlug["sea-shanty"].description,
    story: productCopyBySlug["sea-shanty"].story,
    specs: commonSpecs,
    images: productImages("sea-shanty"),
    colors: ["Bleu marine", "Blanc cassé", "Rouge"],
    inStock: true,
    featured: true
  },
  {
    slug: "mona-lisa",
    name: "Mona Lisa",
    price: 24.9,
    etsyUrl:
      "https://www.etsy.com/fr/listing/4478833346/mona-lisa-bracelet-paracorde-homme-femme",
    shortDescription: productCopyBySlug["mona-lisa"].shortDescription,
    description: productCopyBySlug["mona-lisa"].description,
    story: productCopyBySlug["mona-lisa"].story,
    specs: commonSpecs,
    images: productImages("mona-lisa"),
    colors: ["Bleu", "Blanc", "Rouge"],
    inStock: true
  },
  {
    slug: "vespa",
    name: "Vespa",
    price: 24.9,
    etsyUrl:
      "https://www.etsy.com/fr/listing/4517044363/vespa-bracelet-paracorde-vert-blanc",
    shortDescription: productCopyBySlug.vespa.shortDescription,
    description: productCopyBySlug.vespa.description,
    story: productCopyBySlug.vespa.story,
    specs: commonSpecs,
    images: productImages("vespa"),
    colors: ["Vert", "Crème", "Noir"],
    inStock: true,
    featured: true
  },
  {
    slug: "paint-it-black",
    name: "Paint It Black",
    price: 24.9,
    etsyUrl:
      "https://www.etsy.com/fr/listing/4517047079/paint-it-black-bracelet-paracorde-noir",
    shortDescription: productCopyBySlug["paint-it-black"].shortDescription,
    description: productCopyBySlug["paint-it-black"].description,
    story: productCopyBySlug["paint-it-black"].story,
    specs: commonSpecs,
    images: productImages("paint-it-black"),
    colors: ["Noir", "Rouge"],
    inStock: true
  }
];

export const featuredProducts = products.filter((product) => product.featured);

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
