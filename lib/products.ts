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

export const ETSY_SHOP_URL = "https://www.etsy.com/fr/shop/HandRopeParis";
export const INSTAGRAM_URL = "https://www.instagram.com/handrope_craft/";

const commonSpecs = [
  "Bracelet fait main à Paris",
  "Paracorde résistante",
  "Réglable grâce aux nœuds coulissants",
  "Pensé pour être porté tous les jours",
  "Résiste à l’eau",
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
    etsyUrl: "https://www.etsy.com/fr/listing/4517031306/dune-bracelet-paracorde-beige-homme",
    shortDescription:
      "Tons désertiques, esprit sci-fi, prêt pour les longues traversées.",
    description:
      "Un bracelet en paracorde aux tons sable et terracotta, discret mais présent. Il se porte facilement au quotidien et garde ce côté compagnon de route qui fait la force d’un bon objet.",
    story:
      "Inspiré des paysages de sable, des dunes infinies et des grands récits de science-fiction.",
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
    etsyUrl: "https://www.etsy.com/fr/listing/4517041881/sea-shanty-bracelet-paracorde-bleu",
    shortDescription:
      "Un bracelet marin, solide et simple, pensé pour les embruns.",
    description:
      "Un modèle aux couleurs nautiques, fait pour ceux qui aiment les cordages, les pontons, les sacs prêts à partir et les objets qui ne craignent pas l’eau.",
    story:
      "Clin d’œil aux chants de marins, aux cordages, aux pontons et aux départs un peu trop tôt le matin.",
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
    etsyUrl: "https://www.etsy.com/fr/listing/4478833346/mona-lisa-bracelet-paracorde-homme-femme",
    shortDescription: "Une référence française, discrète et graphique.",
    description:
      "Un bracelet bleu, blanc, rouge sans folklore forcé. Graphique, simple, portable tous les jours, avec juste ce qu’il faut de clin d’œil français.",
    story:
      "Une pièce aux couleurs françaises, entre clin d’œil artistique et bracelet de tous les jours.",
    specs: commonSpecs,
    images: productImages("mona-lisa"),
    colors: ["Bleu", "Blanc", "Rouge"],
    inStock: true
  },
  {
    slug: "vespa",
    name: "Vespa",
    price: 24.9,
    etsyUrl: "https://www.etsy.com/fr/listing/4517044363/vespa-bracelet-paracorde-vert-blanc",
    shortDescription:
      "Esprit italien, balade urbaine, liberté en deux roues.",
    description:
      "Un modèle vert, crème et noir, entre charme rétro et envie de rouler sans trop réfléchir. Sobre, vivant, facile à associer.",
    story:
      "Inspiré des virées en scooter, des ruelles italiennes et du charme rétro.",
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
    etsyUrl: "https://www.etsy.com/fr/listing/4517047079/paint-it-black-bracelet-paracorde-noir",
    shortDescription: "Noir, rouge, efficace. Un classique rock au poignet.",
    description:
      "Un bracelet direct, contrasté, sans détour. Le noir garde la ligne sobre, le rouge apporte juste assez d’énergie.",
    story:
      "Référence directe à l’énergie brute des Rolling Stones, version bracelet solide et minimaliste.",
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
