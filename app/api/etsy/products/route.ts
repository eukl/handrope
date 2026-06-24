import { NextResponse } from "next/server";
import fallbackProducts from "@/data/products-fallback.json";
import { slugifyEtsyTitle, type EtsyProduct } from "@/lib/etsy-products";
import { getProductCopyForListing } from "@/lib/product-copy";
import { getEtsyEnv } from "@/lib/server/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ETSY_API_BASE = "https://openapi.etsy.com/v3/application";
const CACHE_TTL_MS = 15 * 60 * 1000;
const ETSY_REQUEST_TIMEOUT_MS = 3000;
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

function truncateDescription(description: string | undefined, title: string) {
  const cleaned = description?.replace(/\s+/g, " ").trim();

  if (!cleaned) {
    return title;
  }

  if (cleaned.length <= 160) {
    return cleaned;
  }

  return `${cleaned.slice(0, 157).trim()}...`;
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

async function fetchEtsyJson<T>(path: string, apiKey: string) {
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
        "x-api-key": apiKey
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

async function fetchListingImages(listingId: string, apiKey: string) {
  const imagesResponse = await fetchEtsyJson<EtsyListResponse<EtsyImage>>(
    `/listings/${listingId}/images`,
    apiKey
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

  const { keystring, shopId } = etsyEnv.value;
  logEtsyInfo("Etsy env check passed. Keystring and shop id are present.");
  logEtsyInfo(`Using Etsy shop id: ${maskIdentifier(shopId)}.`);
  logEtsyInfo("Fetching active Etsy listings.");

  const listingsResponse = await fetchEtsyJson<EtsyListResponse<EtsyListing>>(
    `/shops/${shopId}/listings/active?limit=100`,
    keystring
  );
  const listings = extractResults(listingsResponse);
  logEtsyInfo(`Etsy returned ${listings.length} active listings.`);

  const normalizedProducts = await Promise.all(
    listings.map(async (listing) => {
      const id = String(listing.listing_id ?? "");
      const title = listing.title?.trim() || `Listing ${id}`;
      const productCopy = getProductCopyForListing({ id, title });
      const slug = slugifyEtsyTitle(productCopy?.name ?? title) || id;
      const { price, currency } = normalizePrice(
        listing.price,
        listing.currency_code
      );
      const images = listing.images?.length
        ? listing.images
        : await fetchListingImages(id, keystring);
      const imageUrls = imageUrlsFrom(images);

      return {
        id,
        slug,
        title,
        price,
        currency,
        shortDescription:
          productCopy?.shortDescription ??
          truncateDescription(listing.description, title),
        image: imageUrls[0] ?? imageUrlFrom(images),
        images: imageUrls,
        etsyUrl: listing.url ?? `https://www.etsy.com/fr/listing/${id}`
      };
    })
  );

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
