import { NextResponse } from "next/server";
import fallbackProducts from "@/data/products-fallback.json";
import type { EtsyProduct } from "@/lib/etsy-products";
import { getProductCopyForListing } from "@/lib/product-copy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ETSY_API_BASE = "https://openapi.etsy.com/v3/application";
const CACHE_TTL_MS = 15 * 60 * 1000;
const ETSY_REQUEST_TIMEOUT_MS = 7000;

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
  const firstImage = images[0];

  return (
    firstImage?.url_fullxfull ??
    firstImage?.url_570xN ??
    firstImage?.url_300x300 ??
    firstImage?.url_170x135 ??
    ""
  );
}

async function fetchEtsyJson<T>(path: string, apiKey: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ETSY_REQUEST_TIMEOUT_MS);

  const response = await fetch(`${ETSY_API_BASE}${path}`, {
    headers: {
      "x-api-key": apiKey
    },
    cache: "no-store",
    signal: controller.signal
  }).finally(() => clearTimeout(timeout));

  if (!response.ok) {
    throw new Error(`Etsy API ${response.status} on ${path}`);
  }

  return (await response.json()) as T;
}

async function fetchListingImages(listingId: string, apiKey: string) {
  const imagesResponse = await fetchEtsyJson<EtsyListResponse<EtsyImage>>(
    `/listings/${listingId}/images`,
    apiKey
  );

  return extractResults(imagesResponse);
}

async function fetchEtsyProducts() {
  const missingVariables = [
    "ETSY_KEYSTRING",
    "ETSY_SHARED_SECRET",
    "ETSY_SHOP_ID"
  ].filter((key) => !process.env[key]);

  if (missingVariables.length > 0) {
    throw new Error(`Missing server env vars: ${missingVariables.join(", ")}`);
  }

  const apiKey = `${process.env.ETSY_KEYSTRING}:${process.env.ETSY_SHARED_SECRET}`;
  const shopId = process.env.ETSY_SHOP_ID;

  const listingsResponse = await fetchEtsyJson<EtsyListResponse<EtsyListing>>(
    `/shops/${shopId}/listings/active?limit=100`,
    apiKey
  );
  const listings = extractResults(listingsResponse);

  const normalizedProducts = await Promise.all(
    listings.map(async (listing) => {
      const id = String(listing.listing_id ?? "");
      const title = listing.title?.trim() || `Listing ${id}`;
      const productCopy = getProductCopyForListing({ id, title });
      const { price, currency } = normalizePrice(
        listing.price,
        listing.currency_code
      );
      const images = listing.images?.length
        ? listing.images
        : await fetchListingImages(id, apiKey);

      return {
        id,
        title,
        price,
        currency,
        shortDescription:
          productCopy?.shortDescription ??
          truncateDescription(listing.description, title),
        image: imageUrlFrom(images),
        etsyUrl: listing.url ?? `https://www.etsy.com/fr/listing/${id}`
      };
    })
  );

  return normalizedProducts.filter((product) => product.id && product.etsyUrl);
}

export async function GET() {
  const cachedProducts = getCachedProducts();

  if (cachedProducts) {
    return jsonResponse(cachedProducts.data, cachedProducts.source);
  }

  try {
    const etsyProducts = await fetchEtsyProducts();
    setCachedProducts(etsyProducts, "etsy");

    return jsonResponse(etsyProducts, "etsy");
  } catch (error) {
    logEtsyError(
      "Unable to fetch active Etsy listings. Using data/products-fallback.json",
      error
    );
    setCachedProducts(fallback, "fallback");

    return jsonResponse(fallback, "fallback");
  }
}
