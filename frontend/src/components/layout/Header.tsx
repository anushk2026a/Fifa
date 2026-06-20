"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/common/Container";
import { LocationsDropdown } from "./LocationsDropdown";
import { MobileMenu } from "./MobileMenu";
import { SITE } from "@/data/site";

export function Header() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const navLink = (href: string) =>
    `relative pb-1 text-sm font-medium transition-colors duration-200
    ${
      isActive(href)
        ? "text-accent border-b-2 border-accent"
        : "text-ink hover:text-accent"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/80">
      <Container className="relative flex h-16 items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-ink"
        >
          FIFA-<span className="text-accent">OnePoint</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          <Link href="/" className={navLink("/")}>
            Sports
          </Link>

          <LocationsDropdown />

          <Link href="/news" className={navLink("/news")}>
            News
          </Link>

          <Link href="/contact" className={navLink("/contact")}>
            Share Your Experience
          </Link>
        </nav>

        <MobileMenu />
      </Container>

      <span className="sr-only">{SITE.tagline}</span>
    </header>
  );
}
