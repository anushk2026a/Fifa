"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/common/Container";
import { apiUrl } from "@/lib/api";
import { setToken } from "@/lib/admin-auth";

const fieldClass =
  "w-full rounded-[var(--radius-card)] border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent";

export default function AdminLoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const form = e.currentTarget;
    const body = {
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
    };
    try {
      const res = await fetch(apiUrl("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok && data.ok && data.token) {
        setToken(data.token);
        router.push("/admin");
      } else {
        setStatus("error");
        setError(data.error === "INVALID_CREDENTIALS" ? "Wrong email or password." : "Login failed.");
      }
    } catch {
      setStatus("error");
      setError("Could not reach the server. Is the backend running?");
    }
  }

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-sm rounded-[var(--radius-card)] border border-line bg-surface p-6">
        <h1 className="text-xl font-semibold text-ink">Admin sign in</h1>
        <p className="mt-1 text-sm text-muted">Manage the News section.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">Email</label>
            <input id="email" name="email" type="email" required autoComplete="username" className={fieldClass} />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink">Password</label>
            <input id="password" name="password" type="password" required autoComplete="current-password" className={fieldClass} />
          </div>

          {status === "error" && <p className="text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded border border-accent bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-strong disabled:opacity-60 transition-colors"
          >
            {status === "sending" ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </Container>
  );
}
