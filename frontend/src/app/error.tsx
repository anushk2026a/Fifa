"use client";

import { useEffect } from "react";
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
    <Container className="py-24 text-center sm:py-32">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent">
        Something went wrong
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        We hit a snag
      </h1>
      <p className="mx-auto mt-3 max-w-md text-muted">
        Sorry — something broke while loading this page. Try again, or head back home.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="rounded border border-accent bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-strong"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded border border-line bg-surface px-4 py-2 text-sm font-medium text-ink hover:border-accent hover:text-accent"
        >
          Go home
        </Link>
      </div>
    </Container>
  );
}
