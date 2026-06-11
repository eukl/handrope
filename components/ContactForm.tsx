"use client";

import { FormEvent, useState } from "react";

const unavailableMessage =
  "Le formulaire est temporairement indisponible. Vous pouvez nous contacter via Etsy ou Instagram.";

type FormStatus = "idle" | "sending" | "success" | "error";

type ContactFormState = {
  name: string;
  email: string;
  message: string;
};

type ApiResponse = {
  ok?: boolean;
  message?: string;
};

const initialForm: ContactFormState = {
  name: "",
  email: "",
  message: ""
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormState>(initialForm);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState("");

  const isSending = status === "sending";

  function updateField(field: keyof ContactFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validateForm() {
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

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

    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setStatus("error");
      setFeedback(validationError);
      return;
    }

    setStatus("sending");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim()
        })
      });

      const data = (await response.json().catch(() => null)) as ApiResponse | null;

      if (!response.ok) {
        throw new Error(data?.message ?? unavailableMessage);
      }

      setForm(initialForm);
      setStatus("success");
      setFeedback(
        data?.message ?? "Message envoyé. Merci, je te répondrai rapidement."
      );
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : unavailableMessage);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-border bg-surface/82 p-6 sm:p-8"
    >
      <p className="mb-6 text-sm leading-6 text-muted">
        Le message part directement par email. Pour une commande, le paiement et
        le suivi restent gérés par Etsy.
      </p>

      <div className="grid gap-5">
        <label className="grid gap-2 text-sm font-semibold text-foreground">
          Nom
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            disabled={isSending}
            autoComplete="name"
            placeholder="Ton nom"
            className="rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none transition placeholder:text-muted-dark focus:border-accent-purple/70 focus:ring-2 focus:ring-accent-purple/20 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-foreground">
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            disabled={isSending}
            autoComplete="email"
            placeholder="ton@email.fr"
            className="rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none transition placeholder:text-muted-dark focus:border-accent-purple/70 focus:ring-2 focus:ring-accent-purple/20 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-foreground">
          Message
          <textarea
            name="message"
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
            disabled={isSending}
            rows={6}
            placeholder="Taille, couleur, idée cadeau..."
            className="resize-none rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none transition placeholder:text-muted-dark focus:border-accent-purple/70 focus:ring-2 focus:ring-accent-purple/20 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>

        {feedback ? (
          <p
            role="status"
            aria-live="polite"
            className={`rounded-lg border px-4 py-3 text-sm leading-6 ${
              status === "success"
                ? "border-accent-purple/35 bg-accent-purple/10 text-accent-purple-soft"
                : "border-accent-orange/35 bg-accent-orange/10 text-sand"
            }`}
          >
            {feedback}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSending}
          className="rounded-full bg-warm-gradient px-6 py-3 text-sm font-bold text-[#130f1f] shadow-glow transition hover:scale-[1.02] disabled:cursor-wait disabled:opacity-70 disabled:hover:scale-100"
        >
          {isSending ? "Envoi en cours..." : "Envoyer le message"}
        </button>
      </div>
    </form>
  );
}
