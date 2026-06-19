"use client";

import { useState } from "react";
import { CITIES } from "@/data/cities";

// Set NEXT_PUBLIC_FORMSPREE_ENDPOINT in .env.local to your Formspree/Web3Forms URL.
const ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ?? "";

const fieldClass =
  "w-full rounded-[var(--radius-card)] border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if ((form.elements.namedItem("company") as HTMLInputElement)?.value) return; // honeypot
    if (!ENDPOINT) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (res.ok) {
        setStatus("ok");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-[var(--radius-card)] border border-accent bg-accent-soft px-4 py-6 text-sm text-ink">
        Thanks — we&apos;ve received your details and will get back to you to help with your location.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4">
      {/* honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-ink">Name</label>
        <input id="name" name="name" required className={fieldClass} />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">Email</label>
        <input id="email" name="email" type="email" required className={fieldClass} />
      </div>
      <div>
        <label htmlFor="city" className="mb-1 block text-sm font-medium text-ink">City (optional)</label>
        <select id="city" name="city" defaultValue="" className={fieldClass}>
          <option value="">Select a host city…</option>
          {CITIES.map((c) => (
            <option key={c.slug} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-ink">Message</label>
        <textarea id="message" name="message" required rows={5} className={fieldClass} />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded border border-accent bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-strong disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send details"}
      </button>

      {status === "error" && (
        <p className="text-sm text-red-700">
          {ENDPOINT
            ? "Something went wrong. Please try again or email us directly."
            : "Form is not configured yet (set NEXT_PUBLIC_FORMSPREE_ENDPOINT)."}
        </p>
      )}
    </form>
  );
}
