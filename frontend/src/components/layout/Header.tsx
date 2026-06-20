import Link from "next/link";
import { Container } from "@/components/common/Container";
import { LocationsDropdown } from "./LocationsDropdown";
import { MobileMenu } from "./MobileMenu";
import { SITE } from "@/data/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/80">
      <Container className="relative flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight text-ink">
          Sports<span className="text-accent">One</span>Point
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          <Link href="/" className="text-sm font-medium text-ink hover:text-accent">
            Sports
          </Link>
          
          <LocationsDropdown />
          <Link href="/news" className="text-sm font-medium text-ink hover:text-accent">
            News
          </Link>
          
          <Link
            href="/contact"
            className="rounded border border-accent px-3 py-1.5 text-sm font-medium text-accent hover:bg-accent hover:text-white"
          >
            Contact Us
          </Link>
        </nav>

        <MobileMenu />
      </Container>
      <span className="sr-only">{SITE.tagline}</span>
    </header>
  );
}
