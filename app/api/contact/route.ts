import { NextResponse } from "next/server";
import { getContactEnv } from "@/lib/server/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESEND_EMAILS_ENDPOINT = "https://api.resend.com/emails";
const RESEND_TIMEOUT_MS = 10000;
const CONTACT_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const CONTACT_RATE_LIMIT_MAX_REQUESTS = 5;
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 180;
const MAX_MESSAGE_LENGTH = 3000;
const unavailableMessage =
  "Le formulaire est temporairement indisponible. Vous pouvez nous contacter via Etsy ou Instagram.";
const blockedMessage =
  "Le message n'a pas pu être envoyé pour le moment. Réessaie dans quelques minutes.";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  company?: unknown;
};

type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, message }, { status });
}

function sanitize(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwardedFor?.split(",")[0]?.trim() || realIp?.trim() || "local";
}

function isRateLimited(clientKey: string) {
  const now = Date.now();
  const currentEntry = rateLimitStore.get(clientKey);

  if (!currentEntry || currentEntry.resetAt <= now) {
    rateLimitStore.set(clientKey, {
      count: 1,
      resetAt: now + CONTACT_RATE_LIMIT_WINDOW_MS
    });
    return false;
  }

  if (currentEntry.count >= CONTACT_RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  currentEntry.count += 1;
  rateLimitStore.set(clientKey, currentEntry);
  return false;
}

function toContactPayload(payload: unknown): ContactPayload {
  if (!payload || typeof payload !== "object") {
    return {};
  }

  return payload as ContactPayload;
}

function validatePayload(payload: ContactPayload): ContactFormData | string {
  const name = typeof payload.name === "string" ? sanitize(payload.name) : "";
  const email =
    typeof payload.email === "string" ? sanitize(payload.email).toLowerCase() : "";
  const message =
    typeof payload.message === "string" ? payload.message.trim() : "";
  const company =
    typeof payload.company === "string" ? payload.company.trim() : "";

  if (company) {
    return "CONTACT_FORM_SPAM";
  }

  if (!name) {
    return "Le nom est requis.";
  }

  if (!email) {
    return "L'email est requis.";
  }

  if (name.length > MAX_NAME_LENGTH) {
    return "Le nom est trop long.";
  }

  if (email.length > MAX_EMAIL_LENGTH) {
    return "L'email est trop long.";
  }

  if (!isValidEmail(email)) {
    return "L'email n'est pas valide.";
  }

  if (!message) {
    return "Le message est requis.";
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return "Le message est trop long.";
  }

  return {
    name,
    email,
    message
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function contactEmailHtml({ name, email, message }: ContactFormData) {
  const escapedName = escapeHtml(name);
  const escapedEmail = escapeHtml(email);
  const escapedMessage = escapeHtml(message).replace(/\n/g, "<br />");

  return `
    <div style="font-family: Inter, Arial, sans-serif; line-height: 1.6; color: #171717;">
      <h1 style="font-size: 20px; margin: 0 0 16px;">Nouveau message HandRope</h1>
      <p><strong>Nom :</strong> ${escapedName}</p>
      <p><strong>Email :</strong> ${escapedEmail}</p>
      <p><strong>Message :</strong></p>
      <div style="padding: 16px; border: 1px solid #ddd; border-radius: 8px; background: #fafafa;">
        ${escapedMessage}
      </div>
    </div>
  `;
}

function contactEmailText({ name, email, message }: ContactFormData) {
  return `Nouveau message HandRope

Nom : ${name}
Email : ${email}

Message :
${message}`;
}

async function sendContactEmail(data: ContactFormData) {
  const contactEnv = getContactEnv();

  if (!contactEnv.ok) {
    console.error(
      `[contact] Missing server env vars: ${contactEnv.missing.join(", ")}`
    );
    throw new Error("CONTACT_FORM_UNAVAILABLE");
  }

  const { resendApiKey, toEmail, fromEmail } = contactEnv.value;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RESEND_TIMEOUT_MS);

  try {
    const response = await fetch(RESEND_EMAILS_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: `HandRope <${fromEmail}>`,
        to: [toEmail],
        reply_to: data.email,
        subject: `Nouveau message HandRope - ${data.name}`,
        html: contactEmailHtml(data),
        text: contactEmailText(data)
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      console.error(`[contact] Resend error ${response.status}.`);
      throw new Error("RESEND_SEND_FAILED");
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      console.error("[contact] Resend request timed out.");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: Request) {
  try {
    if (isRateLimited(getClientKey(request))) {
      console.warn("[contact] Rate limit exceeded.");
      return jsonError(blockedMessage, 429);
    }

    let payload: unknown;

    try {
      payload = await request.json();
    } catch {
      return jsonError("Requête invalide.", 400);
    }

    const validated = validatePayload(toContactPayload(payload));

    if (validated === "CONTACT_FORM_SPAM") {
      console.warn("[contact] Honeypot triggered.");
      return jsonError(blockedMessage, 400);
    }

    if (typeof validated === "string") {
      return jsonError(validated, 400);
    }

    await sendContactEmail(validated);

    return NextResponse.json({
      ok: true,
      message: "Message envoyé. Merci, je te répondrai rapidement."
    });
  } catch (error) {
    if (error instanceof Error && error.message === "CONTACT_FORM_UNAVAILABLE") {
      return jsonError(unavailableMessage, 503);
    }

    console.error("[contact] Unable to send contact message.", error);

    return jsonError(unavailableMessage, 500);
  }
}
