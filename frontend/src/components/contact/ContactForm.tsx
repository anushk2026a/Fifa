"use client";

import { useState } from "react";
import { CITIES } from "@/data/cities";

// Backend API route (internal Next.js route)
const API_URL = "/api/contact";

const fieldClass =
  "w-full rounded-[var(--radius-card)] border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.company) return; // honeypot

    setStatus("sending");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
      <div className="max-w-xl rounded-[var(--radius-card)] border border-accent bg-accent-soft px-4 py-6 text-sm text-ink">
        Thanks — we&apos;ve received your details and will get back to you to help with your
        match location.
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
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-ink">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="e.g. Which stadium hosts the Dallas matches, and how do I get there?"
          className={fieldClass}
        />
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
          Something went wrong sending your message. Please try again shortly.
        </p>
      )}
    </form>
  );
}
