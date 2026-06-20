"use client";

import { useState } from "react";
import { CITIES } from "@/data/cities";
import { Container } from "../common/Container";
import Image from "next/image";

// Backend API route (internal Next.js route)
const API_URL = "/api/contact";

const fieldClass =
  "w-full rounded-[var(--radius-card)] border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle",
  );

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
      <div className="max-w-4xl mx-auto rounded-[var(--radius-card)] border border-accent bg-accent-soft px-4 py-6 text-sm text-ink">
        Thanks — we&apos;ve received your details and will get back to you to
        help with your match location.
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden py-16">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-white/10 " />

      <Container className="relative z-10">
        <div className="flex justify-center">
          <form
            onSubmit={onSubmit}
            className="w-full max-w-2xl rounded-2xl border border-black/20 bg-gray-300/20 p-8 backdrop-blur-xl shadow-xl"
          >
            {/* honeypot */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden
            />

            <h2 className="mb-8 text-center text-3xl font-bold text-[#0057b8]">
              Share Your Experience
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className={`${fieldClass} bg-white/90`}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={`${fieldClass} bg-white/90`}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Country
                </label>
                <input
                  id="country"
                  name="country"
                  required
                  className={`${fieldClass} bg-white/90`}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className={`${fieldClass} bg-white/90`}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  required
                  className={`${fieldClass} bg-white/90`}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  YouTube Link
                </label>
                <input
                  id="youtube"
                  name="youtube"
                  type="url"
                  className={`${fieldClass} bg-white/90`}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Facebook Link
                </label>
                <input
                  id="facebook"
                  name="facebook"
                  type="url"
                  className={`${fieldClass} bg-white/90`}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Instagram Link
                </label>
                <input
                  id="instagram"
                  name="instagram"
                  type="url"
                  className={`${fieldClass} bg-white/90`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-black">
                  X (Twitter) Link
                </label>
                <input
                  id="x"
                  name="x"
                  type="url"
                  className={`${fieldClass} bg-white/90`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-black">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className={`${fieldClass} resize-none bg-white/90`}
                  placeholder="Share your FIFA World Cup experience..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-8 w-full rounded-lg bg-accent py-3 text-sm font-semibold text-black transition hover:bg-accent-strong disabled:opacity-60"
            >
              {status === "sending" ? "Sending..." : "Submit Experience"}
            </button>

            {status === "error" && (
              <p className="mt-4 text-center text-sm text-red-300">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        </div>
      </Container>
    </div>
  );
}
