import Link from "next/link";
import { Container } from "@/components/common/Container";

export default function NotFound() {
  return (
    <Container className="py-24 text-center sm:py-32">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Page not found
      </h1>
      <p className="mx-auto mt-3 max-w-md text-muted">
        That page isn&apos;t here. Pick a host city or head back to the home page.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded border border-accent bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-strong"
        >
          Go home
        </Link>
        <Link
          href="/locations"
          className="rounded border border-line bg-surface px-4 py-2 text-sm font-medium text-ink hover:border-accent hover:text-accent"
        >
          Browse host cities
        </Link>
      </div>
    </Container>
  );
}
