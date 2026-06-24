"use client";

import { useState } from "react";
import {
  Globe,
  Trophy,
  Camera,
  User,
  Mail,
  MapPin,
  Phone,
  Building2,
  Send,
  Link2,
} from "lucide-react";

const API_URL = "/api/contact";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle",
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("sending");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        form.reset();
        setStatus("ok");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="grid lg:grid-cols-[380px_1fr]">
            {/* LEFT PANEL */}

            <div className="bg-gradient-to-b from-[#012A6B] to-[#001B44] p-10 text-white">
              <h2 className="mb-5 text-5xl font-bold leading-tight">
                Share Your FIFA Experiences
              </h2>

              <p className="mb-10 text-lg !text-white/70 font-medium">
                Your story. Your memories. Inspire millions of football fans
                around the world.
              </p>

              <div className="space-y-4">
                <Feature
                  icon={<Globe size={20} />}
                  title="Be Heard Worldwide"
                  text="Your experience can reach football fans across the globe."
                />



                {/* <Feature
                  icon={<Users size={20} />}
                  title="Join The Community"
                  text="Become a part of a passionate football community."
                /> */}

                <Feature
                  icon={<Camera size={20} />}
                  title="Share Your Moments"
                  text="Share your stories and make every moments unforgettable. Your stories will be featured on fifaonepoint.com"
                />

                <Feature
                  icon={<User size={20} />}
                  title="Fans Helping Fans"
                  text="Provide useful info related to hotels, restaurants, transports, and more — from fans, for fans."
                />
              </div>
            </div>

            {/* RIGHT PANEL */}

            <div className="p-8 lg:p-12">
              <h2 className="text-5xl font-bold text-[#012A6B]">
                Share Your Experiences
              </h2>

              <div className="mt-3 mb-10 h-1 w-16 rounded bg-blue-600"></div>

              {status === "ok" && (
                <div className="mb-6 rounded-xl bg-green-100 p-4 text-green-700">
                  Experience submitted successfully.
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <InputField
                    icon={<User size={18} />}
                    name="name"
                    label="Name"
                    placeholder="Your full name"
                    required
                  />

                  <InputField
                    icon={<Mail size={18} />}
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="You@example.com"
                    required
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <InputField
                    icon={<Globe size={18} />}
                    name="country"
                    label="Country"
                    placeholder="Your country"
                    required
                  />

                  <InputField
                    icon={<Building2 size={18} />}
                    name="city"
                    label="City"
                    placeholder="Your city"
                    required
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <InputField
                    icon={<Phone size={18} />}
                    name="phone"
                    type="tel"
                    label="Phone"
                    placeholder="Your phone number"
                    inputMode="numeric"
                    pattern="[0-9+\-\s()]*"
                    onInput={(e) => {
                      const el = e.currentTarget as HTMLInputElement;
                      el.value = el.value.replace(/[^0-9+\-\s()]/g, "");
                    }}
                  />

                  <InputField
                    icon={<MapPin size={18} />}
                    name="stadium"
                    label="Match Location"
                    placeholder="1 AMB Dr NW, Atlanta, GA 30313, U.S."
                  />
                </div>

                {/* SOCIAL LINK */}

                <div>
                  <div className="">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Social Profile / URL
                    </label>
                    <InputField
                      icon={<Link2 size={18} />}
                      name="socialUrl"
                      type="url"
                      placeholder="Enter Your Social Profile URL"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Message
                    <span className="ml-0.5 text-red-500">*</span>
                  </label>

                  <textarea
                    name="message"
                    rows={3}
                    required
                    placeholder="Share your FIFA experiences 50 words"
                    className="w-full rounded-xl border border-slate-300 p-4 outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#0057B8] text-lg font-semibold text-white transition hover:bg-[#00479A]"
                >
                  {status === "sending"
                    ? "Submitting..."
                    : "Submit Your Experience"}

                  <Send size={18} />
                </button>

                {status === "error" && (
                  <p className="text-center text-red-500">
                    Something went wrong. Please try again.
                  </p>
                )}

                <p className="text-center text-sm text-slate-500">
                  🔒 Your information is safe with us.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FEATURE ---------------- */

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="border-b border-white/20 pb-6">
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0A5CFF] text-white shadow-lg shadow-blue-500/30">
          {icon}
        </div>

        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <span className="mt-1 text-white/70">{text}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- INPUT ---------------- */

function InputField({
  icon,
  label,
  placeholder,
  name,
  type = "text",
  required = false,
  ...rest
}: {
  icon: React.ReactNode;
  label?: string;
  placeholder: string;
  name: string;
  type?: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      {label && (
        <div className="mb-2 block text-sm font-semibold text-slate-700">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </div>
      )}

      <label className="flex h-12 cursor-text items-center gap-3 rounded-xl border border-slate-300 px-4 transition-all focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">
        <span className="text-slate-500 shrink-0">{icon}</span>

        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className="w-full bg-transparent p-0 !outline-none focus:!outline-none !border-none focus:!border-none !ring-0 focus:!ring-0 !shadow-none focus:!shadow-none"
          {...rest}
        />
      </label>
    </div>
  );
}
