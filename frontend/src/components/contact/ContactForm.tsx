"use client";

import { useState } from "react";
import { CITIES } from "@/data/cities";
import { Container } from "../common/Container";

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
      <div className="max-w-4xl mx-auto rounded-[var(--radius-card)] border border-accent bg-accent-soft px-4 py-6 text-sm text-ink">
        Thanks — we&apos;ve received your details and will get back to you to help with your
        match location.
      </div>
    );
  }

  return (
    <div className=" space-y-6">
      <Container className="">
        {/* Top Grid: Left Side Content & Right Side Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch py-10">

          {/* Left Side Content - Balanced size with the form */}
          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 flex flex-col justify-between text-sm text-ink">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold mb-1">Get in Touch</h3>
                <p className="text-muted text-xs">Have questions about locations, venues, or host cities? Drop us a line.</p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <span className="block font-medium text-xs uppercase tracking-wider text-muted mb-0.5">Location Name</span>
                  <p className="font-semibold">One Main Place</p>
                </div>

                <div>
                  <span className="block font-medium text-xs uppercase tracking-wider text-muted mb-0.5">Address</span>
                  <p>1201 Main St, Dallas, TX 75202</p>
                </div>

                <div>
                  <span className="block font-medium text-xs uppercase tracking-wider text-muted mb-0.5">Phone</span>
                  <p>+1 (214) 744-9800</p>
                </div>

                <div>
                  <span className="block font-medium text-xs uppercase tracking-wider text-muted mb-0.5">Email</span>
                  <p>support@worldcupmatch.com</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-line space-y-1 text-xs">
              <span className="block font-medium uppercase tracking-wider text-muted mb-1">Working Hours</span>
              <div className="flex justify-between">
                <span>Mon - Fri</span>
                <span>6:00 AM - 7:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sat</span>
                <span>6:00 AM - 1:00 PM</span>
              </div>
              <div className="flex justify-between text-red-500 font-medium">
                <span>Sun</span>
                <span>Closed</span>
              </div>
            </div>
          </div>

          {/* Right Side Form */}
          <form onSubmit={onSubmit} className="space-y-4 flex flex-col justify-between">
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

            
              <div className="">
                <label htmlFor="phone" className="mb-1 block text-sm font-medium text-ink">
                  Phone <span className="font-normal text-muted">(optional)</span>
                </label>
                <input id="phone" name="phone" type="tel" className={fieldClass} />
              </div>
              <div className="">
                <label htmlFor="country" className="mb-1 block text-sm font-medium text-ink">Country</label>
                <input id="country" name="country" type="text" required className={fieldClass} />
              </div>
              <label htmlFor="city" className="mb-1 block text-sm font-medium text-ink">City</label>
              <input type="text" name="city" id="city" required className={fieldClass} />
            
            <div>
              <label htmlFor="message" className="mb-1 block text-sm font-medium text-ink">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                placeholder="e.g. Which stadium hosts the Dallas matches, and how do I get there?"
                className={`${fieldClass} resize-none`}
              />
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full rounded border border-accent bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-strong disabled:opacity-60 transition-colors"
              >
                {status === "sending" ? "Sending…" : "Send details"}
              </button>
            </div>

            {status === "error" && (
              <p className="text-sm text-red-700 mt-2">
                Something went wrong sending your message. Please try again shortly.
              </p>
            )}
          </form>

        </div>

        {/* Map Section at the Bottom - Full Width of container */}
        <div className="w-full rounded-[var(--radius-card)] border border-line overflow-hidden bg-surface">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d202857.0957746974!2d-96.73209605000001!3d32.81850405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c19f77b45974b%3A0xb9ec9ba4f647678f!2sDallas%2C%20TX%2C%20USA!5e1!3m2!1sen!2sin!4v1781881516882!5m2!1sen!2sin"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Container>
    </div>
  );
}