import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESEND_EMAILS_ENDPOINT = "https://api.resend.com/emails";
const RESEND_TIMEOUT_MS = 10000;
const unavailableMessage =
  "Le formulaire est temporairement indisponible. Vous pouvez nous contacter via Etsy ou Instagram.";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
};

type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, message }, { status });
}

function sanitize(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

  if (!name) {
    return "Le nom est requis.";
  }

  if (!email) {
    return "L'email est requis.";
  }

  if (!isValidEmail(email)) {
    return "L'email n'est pas valide.";
  }

  if (!message) {
    return "Le message est requis.";
  }

  return {
    name: name.slice(0, 120),
    email: email.slice(0, 180),
    message: message.slice(0, 3000)
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
  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!resendApiKey || !toEmail || !fromEmail) {
    const missingVariables = [
      !resendApiKey ? "RESEND_API_KEY" : null,
      !toEmail ? "CONTACT_TO_EMAIL" : null,
      !fromEmail ? "CONTACT_FROM_EMAIL" : null
    ].filter(Boolean);

    console.error(
      `[contact] Missing server env vars: ${missingVariables.join(", ")}`
    );
    throw new Error("CONTACT_FORM_UNAVAILABLE");
  }

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
      const errorText = await response.text();
      console.error(`[contact] Resend error ${response.status}: ${errorText}`);
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
    let payload: unknown;

    try {
      payload = await request.json();
    } catch {
      return jsonError("Requête invalide.", 400);
    }

    const validated = validatePayload(toContactPayload(payload));

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
