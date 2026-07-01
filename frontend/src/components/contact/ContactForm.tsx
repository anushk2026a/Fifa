"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRef, useState } from "react";
import {
  Globe,
  Camera,
  User,
  Mail,
  MapPin,
  Phone,
  Building2,
  Send,
  Link2,
  Upload,
  X,
} from "lucide-react";
import { apiUrl } from "@/lib/api";

// Client-side schema mirrors the backend — prevents sending invalid data at all.
const contactSchema = z.object({
  name:      z.string().min(1, "Name is required").max(100),
  email:     z.email("Invalid email address").max(254),
  phone:     z.string().max(20).optional(),
  country:   z.string().min(1, "Country is required").max(100),
  city:      z.string().min(1, "City is required").max(100),
  stadium:   z.string().max(150).optional(),
  socialUrl: z
    .string()
    .max(500)
    .refine((v) => !v || v.startsWith("http://") || v.startsWith("https://"), {
      message: "Enter a valid URL (https://…)",
    })
    .optional(),
  message: z.string().min(1, "Message is required").max(2000),
});

type ContactFields = z.infer<typeof contactSchema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactFields>({ resolver: zodResolver(contactSchema) });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onSubmit(values: ContactFields) {
    const fd = new FormData();
    // Append all text fields
    (Object.entries(values) as [string, string | undefined][]).forEach(([k, v]) => {
      if (v !== undefined && v !== "") fd.append(k, v);
    });
    // Append image if selected
    if (imageFile) fd.append("image", imageFile);

    const res = await fetch(apiUrl("/contact"), { method: "POST", body: fd });
    if (res.ok) {
      reset();
      clearImage();
    } else {
      throw new Error("submission_failed");
    }
  }

  // react-hook-form catches thrown errors and exposes them via formState.errors.root
  // when using handleSubmit — but we can also check isSubmitSuccessful for the success state.

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
                Your story. Your memories. Inspire millions of football fans around the world.
              </p>
              <div className="space-y-4">
                <Feature
                  icon={<User size={20} />}
                  title="Fans Helping Fans"
                  text={
                    <>
                      Provide useful info related to hotels, restaurants, transports, and more.
                      <br />
                      FROM FANS, FOR FANS.
                    </>
                  }
                />
              
                <Feature
                  icon={<Camera size={20} />}
                  title="Share Your Moments"
                  text="Share your stories and make every moment unforgettable. Your stories will be featured on fifaonepoint.com"
                />
                  <Feature
                  icon={<Globe size={20} />}
                  title="Be Heard Worldwide"
                  text="Your experience can reach football fans across the globe."
                />
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="p-8 lg:p-12">
              <h2 className="text-5xl font-bold text-[#012A6B]">
                Share Your Experiences
              </h2>
              <div className="mt-3 mb-10 h-1 w-16 rounded bg-blue-600" />

              {isSubmitSuccessful && (
                <div className="mb-6 rounded-xl bg-green-100 p-4 text-green-700">
                  Experience submitted successfully.
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                <div className="grid gap-6 md:grid-cols-2">
                  <InputField
                    icon={<User size={18} />}
                    label="Name"
                    required
                    error={errors.name?.message}
                    input={
                      <input
                        type="text"
                        placeholder="Your full name"
                        maxLength={100}
                        className={inputCls}
                        {...register("name")}
                      />
                    }
                  />
                  <InputField
                    icon={<Mail size={18} />}
                    label="Email"
                    required
                    error={errors.email?.message}
                    input={
                      <input
                        type="email"
                        placeholder="you@example.com"
                        maxLength={254}
                        autoComplete="email"
                        className={inputCls}
                        {...register("email")}
                      />
                    }
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <InputField
                    icon={<Globe size={18} />}
                    label="Country"
                    required
                    error={errors.country?.message}
                    input={
                      <input
                        type="text"
                        placeholder="Your country"
                        maxLength={100}
                        className={inputCls}
                        {...register("country")}
                      />
                    }
                  />
                  <InputField
                    icon={<Building2 size={18} />}
                    label="City"
                    required
                    error={errors.city?.message}
                    input={
                      <input
                        type="text"
                        placeholder="Your city"
                        maxLength={100}
                        className={inputCls}
                        {...register("city")}
                      />
                    }
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <InputField
                    icon={<Phone size={18} />}
                    label="Phone"
                    error={errors.phone?.message}
                    input={
                      <input
                        type="tel"
                        placeholder="Your phone number"
                        maxLength={20}
                        inputMode="numeric"
                        className={inputCls}
                        {...register("phone")}
                      />
                    }
                  />
                  <InputField
                    icon={<MapPin size={18} />}
                    label="Match Location"
                    error={errors.stadium?.message}
                    input={
                      <input
                        type="text"
                        placeholder="1 AMB Dr NW, Atlanta, GA 30313, U.S."
                        maxLength={150}
                        className={inputCls}
                        {...register("stadium")}
                      />
                    }
                  />
                </div>

                <InputField
                  icon={<Link2 size={18} />}
                  label="Social Profile / URL"
                  error={errors.socialUrl?.message}
                  input={
                    <input
                      type="url"
                      placeholder="Enter your social profile URL"
                      maxLength={500}
                      className={inputCls}
                      {...register("socialUrl")}
                    />
                  }
                />

                {/* Image upload */}
                <div>
                  <div className="mb-2 block text-sm font-semibold text-slate-700">
                    Upload a Photo <span className="font-normal text-slate-400">(optional)</span>
                  </div>
                  {imagePreview ? (
                    <div className="relative w-full overflow-hidden rounded-xl border border-slate-300">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-48 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 transition hover:border-blue-400 hover:text-blue-500">
                      <Upload size={28} />
                      <span className="text-sm">Click to upload (JPEG, PNG, WebP — max 5 MB)</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={onFileChange}
                      />
                    </label>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    maxLength={2000}
                    placeholder="Share your FIFA experiences (50 words)"
                    className="w-full rounded-xl border border-slate-300 p-4 outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    {...register("message")}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#0057B8] text-lg font-semibold text-white transition hover:bg-[#00479A] disabled:opacity-60"
                >
                  {isSubmitting ? "Submitting…" : "Submit Your Experience"}
                  <Send size={18} />
                </button>

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

/* ── helpers ── */

const inputCls =
  "w-full bg-transparent p-0 !outline-none focus:!outline-none !border-none focus:!border-none !ring-0 focus:!ring-0 !shadow-none focus:!shadow-none";

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: React.ReactNode;
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

function InputField({
  icon,
  label,
  required = false,
  error,
  input,
}: {
  icon: React.ReactNode;
  label?: string;
  required?: boolean;
  error?: string;
  input: React.ReactNode;
}) {
  return (
    <div>
      {label && (
        <div className="mb-2 block text-sm font-semibold text-slate-700">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </div>
      )}
      <label className="flex h-12 cursor-text items-center gap-3 rounded-xl border border-slate-300 px-4 transition-all focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">
        <span className="shrink-0 text-slate-500">{icon}</span>
        {input}
      </label>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
