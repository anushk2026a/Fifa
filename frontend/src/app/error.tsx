"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/common/Container";

// Route-level error boundary. Without this, a client-side render error leaves the
// App Router wedged (links stop working until a hard refresh). This recovers it.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the real error in the console for debugging.
    console.error("[app error boundary]", error);
  }, [error]);

  return (
    <section className="relative isolate overflow-hidden border-b border-line">
      <div className="absolute inset-0 -z-10 hidden md:block">
        <Image
          src="/banner/new_fifabanner.png"
          alt="FIFA World Cup 2026"
          fill
          priority
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 -z-10 md:hidden">
        <Image
          src="/banner/new_fifamobile.png"
          alt="FIFA World Cup 2026"
          fill
          priority
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-black/65" />

      <Container className="flex min-h-[70vh] items-center py-20 sm:py-28">
        <div className="max-w-3xl text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
            Something went wrong
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            We hit a snag
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
            Sorry — something broke while loading this page. Try again, or head back home and
            continue exploring the tournament information.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={reset}
              className="rounded-full border border-accent bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
            >
              Try again
            </button>
            <Link
              href="/"
              className="rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
            >
              Go home
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
