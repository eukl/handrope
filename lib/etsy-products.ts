export type EtsyProduct = {
  id: string;
  slug: string;
  title: string;
  price: number;
  currency: string;
  shortDescription: string;
  image: string;
  images: string[];
  etsyUrl: string;
};

export const etsyProductTitle = (title: string) => {
  const [shortTitle] = title.split(" - ");
  return shortTitle.trim() || title;
};

export const slugifyEtsyTitle = (title: string) =>
  etsyProductTitle(title)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const formatEtsyPrice = (price: number, currency: string) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency
  }).format(price);
