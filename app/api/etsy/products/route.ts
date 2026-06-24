import { NextResponse } from "next/server";
import fallbackProducts from "@/data/products-fallback.json";
import {
  normalizeEtsyDisplayTitle,
  shortDescriptionFromEtsyDescription,
  slugifyEtsyTitle,
  type EtsyProduct
} from "@/lib/etsy-products";
import { decodeHtmlEntities } from "@/lib/html-entities";
import { getEtsyEnv } from "@/lib/server/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ETSY_API_BASE = "https://openapi.etsy.com/v3/application";
const CACHE_TTL_MS = 15 * 60 * 1000;
const ETSY_REQUEST_TIMEOUT_MS = 3000;
const ETSY_IMAGE_REQUEST_DELAY_MS = 250;
const isProductionBuild =
  process.env.NEXT_PHASE === "phase-production-build" &&
  process.argv.some((arg) => arg.includes("next") || arg.includes("next\\dist")) &&
  process.argv.includes("build");

type CachedProducts = {
  data: EtsyProduct[];
  expiresAt: number;
  source: "etsy" | "fallback";
};

type EtsyMoney =
  | string
  | number
  | {
      amount?: number;
      divisor?: number;
      currency_code?: string;
    };

type EtsyListing = {
  listing_id?: number | string;
  title?: string;
  price?: EtsyMoney;
  currency_code?: string;
  description?: string;
  url?: string;
  images?: EtsyImage[];
  updated_timestamp?: number;
  last_modified_tsz?: number;
  updated_at?: string;
};

type EtsyImage = {
  url_fullxfull?: string;
  url_570xN?: string;
  url_300x300?: string;
  url_170x135?: string;
};

type EtsyListResponse<T> = {
  count?: number;
  results?: T[];
};

let productsCache: CachedProducts | null = null;

const fallback = fallbackProducts as EtsyProduct[];

function logEtsyInfo(message: string) {
  console.info(`[etsy-products] ${message}`);
}

function logEtsyError(message: string, error?: unknown) {
  if (error instanceof Error) {
    console.error(`[etsy-products] ${message}: ${error.message}`);
    return;
  }

  if (error) {
    console.error(`[etsy-products] ${message}`, error);
    return;
  }

  console.error(`[etsy-products] ${message}`);
}

function maskIdentifier(value: string) {
  if (value.length <= 4) {
    return "****";
  }

  return `${value.slice(0, 2)}***${value.slice(-2)}`;
}

function logBodyPrefix(body: string) {
  return body.replace(/\s+/g, " ").trim().slice(0, 500);
}

function maskEtsyPath(path: string) {
  return path.replace(/\/shops\/([^/]+)/, (_match, shopId: string) => {
    return `/shops/${maskIdentifier(shopId)}`;
  });
}

function errorDiagnostics(error: unknown) {
  if (!(error instanceof Error)) {
    return String(error);
  }

  const cause = error.cause;

  if (cause instanceof Error) {
    return `${error.name}: ${error.message}; cause=${cause.name}: ${cause.message}`;
  }

  if (cause && typeof cause === "object") {
    const maybeCause = cause as { code?: unknown; message?: unknown };
    return `${error.name}: ${error.message}; causeCode=${String(
      maybeCause.code ?? "unknown"
    )}; causeMessage=${String(maybeCause.message ?? "unknown")}`;
  }

  return `${error.name}: ${error.message}`;
}

function getFallbackProducts(reason: string) {
  logEtsyInfo(`${reason}. Using data/products-fallback.json.`);
  return fallback;
}

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function jsonResponse(data: EtsyProduct[], source: "etsy" | "fallback") {
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=300",
      "X-HandRope-Products-Source": source
    }
  });
}

function getCachedProducts() {
  if (!productsCache || productsCache.expiresAt <= Date.now()) {
    return null;
  }

  return productsCache;
}

function setCachedProducts(data: EtsyProduct[], source: "etsy" | "fallback") {
  productsCache = {
    data,
    source,
    expiresAt: Date.now() + CACHE_TTL_MS
  };
}

function extractResults<T>(payload: EtsyListResponse<T> | T[]): T[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  return payload.results ?? [];
}

function normalizePrice(price: EtsyMoney | undefined, currencyCode?: string) {
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

function imageUrlFrom(images: EtsyImage[]) {
  return imageUrlsFrom(images)[0] ?? "";
}

function imageUrlsFrom(images: EtsyImage[]) {
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

function updatedAtFromListing(listing: EtsyListing) {
  const timestamp = listing.updated_timestamp ?? listing.last_modified_tsz;

  if (timestamp) {
    return new Date(timestamp * 1000).toISOString();
  }

  return listing.updated_at ?? null;
}

function uniqueSlugFrom(baseSlug: string, id: string, usedSlugs: Set<string>) {
  const slug = baseSlug || id;

  if (!usedSlugs.has(slug)) {
    usedSlugs.add(slug);
    return slug;
  }

  const uniqueSlug = `${slug}-${id}`;
  usedSlugs.add(uniqueSlug);
  return uniqueSlug;
}

async function fetchEtsyJson<T>(path: string, apiHeader: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, ETSY_REQUEST_TIMEOUT_MS);
  const endpoint = `${ETSY_API_BASE}${path}`;
  const diagnosticPath = maskEtsyPath(path);
  const diagnosticEndpoint = `${ETSY_API_BASE}${diagnosticPath}`;

  logEtsyInfo(`Calling Etsy endpoint: ${diagnosticEndpoint}`);

  try {
    const response = await fetch(endpoint, {
      headers: {
        "x-api-key": apiHeader
      },
      cache: "no-store",
      signal: controller.signal
    });

    logEtsyInfo(`Etsy HTTP status ${response.status} for ${diagnosticPath}.`);

    if (!response.ok) {
      const errorBody = await response.text();
      logEtsyInfo(
        `Etsy error body for ${diagnosticPath}: ${logBodyPrefix(errorBody) || "(empty)"}`
      );

      if (response.status === 401 || response.status === 403) {
        logEtsyError(`Etsy authentication failed with HTTP ${response.status}`);
      } else {
        logEtsyError(`Etsy request failed with HTTP ${response.status}`);
      }

      const httpError = new Error(
        `Etsy API ${response.status} on ${diagnosticPath}`
      );
      httpError.name = "EtsyHttpError";
      throw httpError;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(`Etsy API timeout after 3000ms on ${diagnosticPath}`);
    }

    if (error instanceof Error && error.name === "EtsyHttpError") {
      throw error;
    }

    logEtsyInfo(
      `Etsy request failed before HTTP response for ${diagnosticPath}. ${errorDiagnostics(
        error
      )}`
    );
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchListingImages(listingId: string, apiHeader: string) {
  const imagesResponse = await fetchEtsyJson<EtsyListResponse<EtsyImage>>(
    `/listings/${listingId}/images`,
    apiHeader
  );

  return extractResults(imagesResponse);
}

async function fetchEtsyProducts() {
  if (isProductionBuild) {
    return getFallbackProducts("Next production build detected");
  }

  const etsyEnv = getEtsyEnv();

  if (!etsyEnv.ok) {
    logEtsyInfo(
      `Etsy env check failed. Missing: ${etsyEnv.missing.join(", ")}`
    );
    return getFallbackProducts(
      `Missing ${etsyEnv.missing.join(", ")} server env vars`
    );
  }

  const { apiHeader, shopId } = etsyEnv.value;
  logEtsyInfo(
    "Etsy env check passed. Keystring, shared secret and shop id are present."
  );
  logEtsyInfo(`Using Etsy shop id: ${maskIdentifier(shopId)}.`);
  logEtsyInfo("Fetching active Etsy listings.");

  const listingsResponse = await fetchEtsyJson<EtsyListResponse<EtsyListing>>(
    `/shops/${shopId}/listings/active?limit=100`,
    apiHeader
  );
  const listings = extractResults(listingsResponse);
  logEtsyInfo(`Etsy returned ${listings.length} active listings.`);

  const normalizedProducts: EtsyProduct[] = [];
  const usedSlugs = new Set<string>();

  for (let index = 0; index < listings.length; index += 1) {
    const listing = listings[index];

    if (index > 0) {
      await wait(ETSY_IMAGE_REQUEST_DELAY_MS);
    }

    const id = String(listing.listing_id ?? "");
    const etsyTitle = listing.title?.trim() || `Listing ${id}`;
    const title = normalizeEtsyDisplayTitle(etsyTitle);
    const description = decodeHtmlEntities(listing.description?.trim() ?? "");
    const slug = uniqueSlugFrom(slugifyEtsyTitle(title), id, usedSlugs);
    const { price, currency } = normalizePrice(
      listing.price,
      listing.currency_code
    );
    const images = listing.images?.length
      ? listing.images
      : await fetchListingImages(id, apiHeader);
    const imageUrls = imageUrlsFrom(images);

    normalizedProducts.push({
      id,
      slug,
      title,
      etsyTitle,
      price,
      currency,
      description,
      shortDescription: shortDescriptionFromEtsyDescription(description, title),
      image: imageUrls[0] ?? imageUrlFrom(images),
      images: imageUrls,
      etsyUrl: listing.url ?? `https://www.etsy.com/fr/listing/${id}`,
      updatedAt: updatedAtFromListing(listing)
    });
  }

  const products = normalizedProducts.filter(
    (product) => product.id && product.etsyUrl
  );

  if (products.length === 0) {
    return getFallbackProducts("Etsy returned no usable active listings");
  }

  logEtsyInfo(`Using ${products.length} products from Etsy.`);
  return products;
}

export async function GET() {
  const cachedProducts = getCachedProducts();

  if (cachedProducts) {
    logEtsyInfo(
      `Serving products from in-memory cache. Source: ${cachedProducts.source}.`
    );
    return jsonResponse(cachedProducts.data, cachedProducts.source);
  }

  try {
    const etsyProducts = await fetchEtsyProducts();
    const source = etsyProducts === fallback ? "fallback" : "etsy";
    logEtsyInfo(`Products response source: ${source}.`);
    setCachedProducts(etsyProducts, source);

    return jsonResponse(etsyProducts, source);
  } catch (error) {
    logEtsyError(
      "Unable to fetch active Etsy listings within the safe timeout. Using data/products-fallback.json",
      error
    );
    setCachedProducts(fallback, "fallback");

    return jsonResponse(fallback, "fallback");
  }
}
