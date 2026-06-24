import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ETSY_API_BASE = "https://openapi.etsy.com/v3/application";
const REQUEST_TIMEOUT_MS = 3000;
const IMAGE_REQUEST_DELAY_MS = 250;
const TITLE_SEPARATOR_PATTERN = /\s[-–—]\s/;
const MAX_SHORT_DESCRIPTION_LENGTH = 180;
const LETTER_PATTERN = /[A-Za-zÀ-ÖØ-öø-ÿ]/g;
const WORD_START_PATTERN = /(^|[\s'’,-])([A-Za-zÀ-ÖØ-öø-ÿ])/g;
const FALLBACK_PATH = path.join(process.cwd(), "data", "products-fallback.json");
const namedEntities = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: "\""
};

async function loadEnvFile(filename) {
  const filepath = path.join(process.cwd(), filename);

  try {
    const content = await readFile(filepath, "utf8");

    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);

      if (!match) {
        continue;
      }

      const key = match[1];
      let value = match[2].trim();

      if (value.startsWith("#")) {
        continue;
      }

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    if (error && error.code !== "ENOENT") {
      throw error;
    }
  }
}

function log(message) {
  console.info(`[sync-etsy-backup] ${message}`);
}

function cleanText(value) {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

function decodeHtmlEntities(value) {
  return value.replace(
    /&(#(\d+)|#x([0-9a-fA-F]+)|[a-zA-Z]+);/g,
    (match, entity, decimal, hexadecimal) => {
      if (decimal) {
        const codePoint = Number.parseInt(decimal, 10);
        return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
      }

      if (hexadecimal) {
        const codePoint = Number.parseInt(hexadecimal, 16);
        return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
      }

      return namedEntities[entity] ?? match;
    }
  );
}

function isMostlyUppercase(value) {
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

function toDisplayCase(value) {
  return value
    .toLocaleLowerCase("fr-FR")
    .replace(WORD_START_PATTERN, (_match, prefix, letter) => {
      return `${prefix}${letter.toLocaleUpperCase("fr-FR")}`;
    });
}

function normalizeEtsyDisplayTitle(title) {
  const cleanedTitle = cleanText(title);
  const [shortTitle] = cleanedTitle.split(TITLE_SEPARATOR_PATTERN);
  const displayTitle = shortTitle?.trim() || cleanedTitle;

  if (!displayTitle) {
    return "Bracelet HandRope";
  }

  return isMostlyUppercase(displayTitle) ? toDisplayCase(displayTitle) : displayTitle;
}

function slugifyEtsyTitle(title) {
  return normalizeEtsyDisplayTitle(title)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function shortDescriptionFromEtsyDescription(description, fallbackTitle) {
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
}

function normalizePrice(price, currencyCode) {
  if (typeof price === "object" && price !== null) {
    const amount = Number(price.amount ?? 0);
    const divisor = Number(price.divisor ?? 100) || 100;

    return {
      price: amount / divisor,
      currency: price.currency_code ?? currencyCode ?? "EUR"
    };
  }

  const parsed = Number(price ?? 0);

  return {
    price: Number.isFinite(parsed) ? parsed : 0,
    currency: currencyCode ?? "EUR"
  };
}

function imageUrlsFrom(images) {
  return images
    .map(
      (image) =>
        image.url_fullxfull ??
        image.url_570xN ??
        image.url_300x300 ??
        image.url_170x135 ??
        ""
    )
    .filter(Boolean);
}

function extractResults(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  return payload.results ?? [];
}

function updatedAtFromListing(listing) {
  const timestamp = listing.updated_timestamp ?? listing.last_modified_tsz;

  if (timestamp) {
    return new Date(timestamp * 1000).toISOString();
  }

  return listing.updated_at ?? null;
}

function uniqueSlugFrom(baseSlug, id, usedSlugs) {
  const slug = baseSlug || id;

  if (!usedSlugs.has(slug)) {
    usedSlugs.add(slug);
    return slug;
  }

  const uniqueSlug = `${slug}-${id}`;
  usedSlugs.add(uniqueSlug);
  return uniqueSlug;
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function fetchEtsyJson(requestPath, apiHeader) {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${ETSY_API_BASE}${requestPath}`, {
      headers: {
        "x-api-key": apiHeader
      },
      signal: controller.signal
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Etsy HTTP ${response.status} on ${requestPath}: ${body
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 300)}`
      );
    }

    return response.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchListingImages(listingId, apiHeader) {
  const response = await fetchEtsyJson(`/listings/${listingId}/images`, apiHeader);
  return extractResults(response);
}

function normalizeListing(listing, images, usedSlugs) {
  const id = String(listing.listing_id ?? "");
  const etsyTitle = listing.title?.trim() || `Listing ${id}`;
  const title = normalizeEtsyDisplayTitle(etsyTitle);
  const description = decodeHtmlEntities(listing.description?.trim() ?? "");
  const { price, currency } = normalizePrice(listing.price, listing.currency_code);
  const imageUrls = imageUrlsFrom(images);

  return {
    id,
    slug: uniqueSlugFrom(slugifyEtsyTitle(title), id, usedSlugs),
    title,
    etsyTitle,
    price,
    currency,
    description,
    shortDescription: shortDescriptionFromEtsyDescription(description, title),
    image: imageUrls[0] ?? "",
    images: imageUrls,
    etsyUrl: listing.url ?? `https://www.etsy.com/fr/listing/${id}`,
    updatedAt: updatedAtFromListing(listing)
  };
}

async function main() {
  await loadEnvFile(".env.local");
  await loadEnvFile(".env");

  const keystring = process.env.ETSY_KEYSTRING;
  const sharedSecret = process.env.ETSY_SHARED_SECRET;
  const shopId = process.env.ETSY_SHOP_ID;
  const missing = [
    !keystring ? "ETSY_KEYSTRING" : null,
    !sharedSecret ? "ETSY_SHARED_SECRET" : null,
    !shopId ? "ETSY_SHOP_ID" : null
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }

  const apiHeader = `${keystring}:${sharedSecret}`;
  log("Fetching active Etsy listings.");

  const listingsResponse = await fetchEtsyJson(
    `/shops/${shopId}/listings/active?limit=100`,
    apiHeader
  );
  const listings = extractResults(listingsResponse);
  log(`Etsy returned ${listings.length} active listings.`);

  const products = [];
  const usedSlugs = new Set();

  for (let index = 0; index < listings.length; index += 1) {
    const listing = listings[index];
    const id = String(listing.listing_id ?? "");

    if (!id) {
      continue;
    }

    if (index > 0) {
      await wait(IMAGE_REQUEST_DELAY_MS);
    }

    const images = listing.images?.length
      ? listing.images
      : await fetchListingImages(id, apiHeader);
    const product = normalizeListing(listing, images, usedSlugs);

    if (product.id && product.etsyUrl) {
      products.push(product);
    }
  }

  if (products.length === 0) {
    throw new Error("Etsy returned no valid active products. Backup was not changed.");
  }

  await mkdir(path.dirname(FALLBACK_PATH), { recursive: true });
  await writeFile(FALLBACK_PATH, `${JSON.stringify(products, null, 2)}\n`, "utf8");
  log(`Wrote ${products.length} products to ${FALLBACK_PATH}.`);
}

main().catch((error) => {
  console.error(`[sync-etsy-backup] ${error instanceof Error ? error.message : error}`);
  process.exitCode = 1;
});
