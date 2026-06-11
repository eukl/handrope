export type EtsyProduct = {
  id: string;
  title: string;
  price: number;
  currency: string;
  shortDescription: string;
  image: string;
  etsyUrl: string;
};

export const etsyProductTitle = (title: string) => {
  const [shortTitle] = title.split(" - ");
  return shortTitle.trim() || title;
};

export const formatEtsyPrice = (price: number, currency: string) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency
  }).format(price);
