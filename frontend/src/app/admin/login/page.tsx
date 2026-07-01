"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Container } from "@/components/common/Container";
import { apiUrl } from "@/lib/api";

const loginSchema = z.object({
  email: z.email("Enter a valid email").max(254),
  password: z.string().min(1, "Password is required").max(128),
});

type LoginFields = z.infer<typeof loginSchema>;

const fieldClass =
  "w-full rounded-[var(--radius-card)] border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent";

export default function AdminLoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFields>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFields) {
    setServerError("");
    try {
      const res = await fetch(apiUrl("/auth/login"), {
        method: "POST",
        // credentials: "include" lets the browser receive and store the HttpOnly
        // accessToken + refreshToken cookies set by the server.
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        router.push("/admin");
      } else {
        setServerError(
          data.error === "INVALID_CREDENTIALS"
            ? "Wrong email or password."
            : "Login failed — please try again.",
        );
      }
    } catch {
      setServerError("Could not reach the server. Is the backend running?");
    }
  }

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-xl rounded-[var(--radius-card)] border border-line bg-surface p-6">
        <h1 className="text-xl font-semibold text-ink">FIFA OnePoint Admin</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              className={fieldClass}
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className={fieldClass}
              {...register("password")}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

          {serverError && <p className="text-sm text-red-700">{serverError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded border border-accent bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-strong disabled:opacity-60 transition-colors"
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </Container>
  );
}
