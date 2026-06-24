import "server-only";
import { brandUrls } from "@/lib/site-config";

type EnvResult<T> =
  | {
      ok: true;
      value: T;
      missing: [];
    }
  | {
      ok: false;
      value: null;
      missing: string[];
    };

export type EtsyEnv = {
  apiHeader: string;
  shopId: string;
};

export type ContactEnv = {
  resendApiKey: string;
  toEmail: string;
  fromEmail: string;
};

function readEnv(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

function result<T>(
  value: T | null,
  missing: string[]
): EnvResult<T> {
  if (missing.length > 0 || !value) {
    return {
      ok: false,
      value: null,
      missing
    };
  }

  return {
    ok: true,
    value,
    missing: []
  };
}

export function getEtsyEnv(): EnvResult<EtsyEnv> {
  const keystring = readEnv("ETSY_KEYSTRING");
  const sharedSecret = readEnv("ETSY_SHARED_SECRET");
  const shopId = readEnv("ETSY_SHOP_ID");
  const missing = [
    !keystring ? "ETSY_KEYSTRING" : null,
    !sharedSecret ? "ETSY_SHARED_SECRET" : null,
    !shopId ? "ETSY_SHOP_ID" : null
  ].filter(Boolean) as string[];

  return result(
    keystring && sharedSecret && shopId
      ? {
          apiHeader: `${keystring}:${sharedSecret}`,
          shopId
        }
      : null,
    missing
  );
}

export function getContactEnv(): EnvResult<ContactEnv> {
  const resendApiKey = readEnv("RESEND_API_KEY");
  const toEmail = readEnv("CONTACT_TO_EMAIL");
  const fromEmail = readEnv("CONTACT_FROM_EMAIL");
  const missing = [
    !resendApiKey ? "RESEND_API_KEY" : null,
    !toEmail ? "CONTACT_TO_EMAIL" : null,
    !fromEmail ? "CONTACT_FROM_EMAIL" : null
  ].filter(Boolean) as string[];

  return result(
    resendApiKey && toEmail && fromEmail
      ? {
          resendApiKey,
          toEmail,
          fromEmail
        }
      : null,
    missing
  );
}

export function getBrandUrls() {
  return brandUrls;
}
