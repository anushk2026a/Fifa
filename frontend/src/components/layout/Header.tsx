"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/common/Container";
import { LocationsDropdown } from "./LocationsDropdown";
import { MobileMenu } from "./MobileMenu";
import { SITE } from "@/data/site";
import logo from "../../../public/logo/fifalogo.png";
import Image from "next/image";
export function Header() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const navLink = (href: string) =>
    `relative  text-sm font-medium transition-colors duration-200
    ${isActive(href)
      ? "text-accent border-b-2 border-accent"
      : "text-ink hover:text-accent"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur ">
      <Container className="relative flex items-center justify-between py-2">
        <Link href="/" className="flex items-center">
          <div className="h-6 w-20 md:h-12 md:w-28">
            <Image
              src={logo}
              alt="FIFA One Point Logo"
              className="h-full w-full"
              priority
            />
          </div>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          <Link href="/" className={navLink("/")}>
            FIFA
          </Link>

          <div className="mb-.5">
            {" "}
            <LocationsDropdown />
          </div>

          <Link href="/news" className={navLink("/news")}>
            News
          </Link>

          <Link href="/stories" className={navLink("/stories")}>
            Stories
          </Link>

          <Link href="/contact" className={navLink("/contact")}>
            Share Experiences
          </Link>
        </nav>

        <MobileMenu />
      </Container>

      <span className="sr-only">{SITE.tagline}</span>
    </header>
  );
}
