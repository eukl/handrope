export type ProductCopy = {
  name: string;
  shortDescription: string;
  description: string;
  story: string;
};

export const productCopyBySlug = {
  dune: {
    name: "Dune",
    shortDescription:
      "Sable, beige et terracotta. Un bracelet discret, solide, qui passe aussi bien avec un tee-shirt blanc qu'une veste noire.",
    description:
      "Dune mélange des tons sable et terracotta pour un rendu simple à porter. Il a ce côté compagnon du quotidien : robuste, discret, prêt à partir.",
    story:
      "Le nom vient du désert, de la chaleur et de l'univers de Dune. Pas besoin d'en faire trop : les couleurs racontent déjà l'idée."
  },
  "paint-it-black": {
    name: "Paint It Black",
    shortDescription:
      "Noir et rouge, direct. Un bracelet qui sent la route, l'asphalte et les départs sans trop réfléchir.",
    description:
      "Paint It Black est le modèle le plus franc de la collection. Noir, rouge, un peu rock, fait pour ceux qui aiment les objets simples avec du caractère.",
    story:
      "Le nom vient du morceau des Rolling Stones. Je voulais un bracelet qui garde cette énergie : brut, roulant, sans détour."
  },
  "sea-shanty": {
    name: "Sea Shanty",
    shortDescription:
      "Bleu marine, blanc cassé, rouge. Un clin d'oeil aux cordages et à l'air salé, sans tomber dans le déguisement marin.",
    description:
      "Sea Shanty garde l'esprit des ports, de la voile et des sacs posés près du quai. Il reste sobre, solide et facile à porter loin de la mer aussi.",
    story:
      "Le nom vient de ces chants de marins qu'on garde en tête, dont 'There once was a ship that put to sea'. Le bracelet reprend l'idée du cordage, pas le costume."
  },
  vespa: {
    name: "Vespa",
    shortDescription:
      "Vert, crème et noir. Un bracelet léger, solaire, avec ce petit côté Italie, terrasse et virée en scooter.",
    description:
      "Vespa est pensé comme un modèle facile : un peu rétro, propre, sans être précieux. Il va bien avec les journées au soleil comme avec le quotidien.",
    story:
      "Le nom vient des scooters italiens, des rues chaudes et des vacances simples. Un clin d'oeil méditerranéen, rien de forcé."
  },
  "mona-lisa": {
    name: "Mona Lisa",
    shortDescription:
      "Bleu, blanc, rouge, mais moderne. Un clin d'oeil français assumé, simple à porter.",
    description:
      "Mona Lisa reprend les couleurs françaises sans tomber dans le folklore. C'est graphique, net, et juste assez joueur.",
    story:
      "Le nom mélange l'art, Paris et ce petit côté soir de match qu'on assume volontiers. Un bracelet français, mais pas déguisé."
  }
} satisfies Record<string, ProductCopy>;

const listingIdToSlug = {
  "4517031306": "dune",
  "4517041881": "sea-shanty",
  "4478833346": "mona-lisa",
  "4517044363": "vespa",
  "4517047079": "paint-it-black"
} as const;

export function getProductCopyForListing({
  id,
  title
}: {
  id: string;
  title: string;
}) {
  const slugFromId = listingIdToSlug[id as keyof typeof listingIdToSlug];

  if (slugFromId) {
    return productCopyBySlug[slugFromId];
  }

  const normalizedTitle = title.toLowerCase();

  return Object.values(productCopyBySlug).find((copy) =>
    normalizedTitle.includes(copy.name.toLowerCase())
  );
}
