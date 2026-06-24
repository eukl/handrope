export type EtsyProduct = {
  id: string;
  slug: string;
  title: string;
  etsyTitle: string;
  price: number;
  currency: string;
  description: string;
  shortDescription: string;
  image: string;
  images: string[];
  etsyUrl: string;
  updatedAt: string | null;
};

const TITLE_SEPARATOR_PATTERN = /\s[-–—]\s/;
const MAX_SHORT_DESCRIPTION_LENGTH = 180;
const LETTER_PATTERN = /[A-Za-zÀ-ÖØ-öø-ÿ]/g;
const WORD_START_PATTERN = /(^|[\s'’,-])([A-Za-zÀ-ÖØ-öø-ÿ])/g;

function cleanText(value: string | undefined) {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

function isMostlyUppercase(value: string) {
  const letters = value.match(LETTER_PATTERN) ?? [];

  if (letters.length === 0) {
    return false;
  }

  const uppercaseLetters = letters.filter(
    (letter) =>
      letter === letter.toLocaleUpperCase("fr-FR") &&
      letter !== letter.toLocaleLowerCase("fr-FR")
  );
  const lowercaseLetters = letters.filter(
    (letter) => letter === letter.toLocaleLowerCase("fr-FR")
  );

  return lowercaseLetters.length === 0 || uppercaseLetters.length / letters.length > 0.8;
}

function toDisplayCase(value: string) {
  return value
    .toLocaleLowerCase("fr-FR")
    .replace(WORD_START_PATTERN, (_match, prefix: string, letter: string) => {
      return `${prefix}${letter.toLocaleUpperCase("fr-FR")}`;
    });
}

export const normalizeEtsyDisplayTitle = (title: string) => {
  const cleanedTitle = cleanText(title);
  const [shortTitle] = cleanedTitle.split(TITLE_SEPARATOR_PATTERN);
  const displayTitle = shortTitle?.trim() || cleanedTitle;

  if (!displayTitle) {
    return "Bracelet HandRope";
  }

  return isMostlyUppercase(displayTitle) ? toDisplayCase(displayTitle) : displayTitle;
};

export const etsyProductTitle = (title: string) => {
  return normalizeEtsyDisplayTitle(title);
};

export const shortDescriptionFromEtsyDescription = (
  description: string | undefined,
  fallbackTitle: string
) => {
  const cleaned = cleanText(description);

  if (!cleaned) {
    return normalizeEtsyDisplayTitle(fallbackTitle);
  }

  if (cleaned.length <= MAX_SHORT_DESCRIPTION_LENGTH) {
    return cleaned;
  }

  const truncated = cleaned.slice(0, MAX_SHORT_DESCRIPTION_LENGTH + 1);
  const lastSpace = truncated.lastIndexOf(" ");
  const endIndex = lastSpace > 80 ? lastSpace : MAX_SHORT_DESCRIPTION_LENGTH;

  return `${cleaned.slice(0, endIndex).trim()}...`;
};

export const slugifyEtsyTitle = (title: string) =>
  normalizeEtsyDisplayTitle(title)
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
