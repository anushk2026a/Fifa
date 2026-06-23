import Link from "next/link";
import { Container } from "@/components/common/Container";
import { OutboundLink } from "@/components/common/OutboundLink";
import { SITE } from "@/data/site";
import { citiesByCountry, COUNTRY_ORDER } from "@/data/cities";
import logo from "../../../public/logo/fifalogo.png";
import Image from "next/image";
export function Footer() {
  const grouped = citiesByCountry();
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <Container className="grid grid-cols-1 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image src={logo} alt="FIFA 2026" width={110} height={100} />
          <p className="mt-2 max-w-xs text-sm text-muted">{SITE.tagline}</p>
          <p className="mt-3 text-xs text-faint">
            Always buy tickets only from official FIFA sources.
          </p>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-faint">
            Explore
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="text-ink hover:text-accent">
                FIFA
              </Link>
            </li>
            <li>
              <Link href="/locations" className="text-ink hover:text-accent">
                Locations
              </Link>
            </li>
            <li>
              <Link href="/news" className="text-ink hover:text-accent">
                News
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-ink hover:text-accent">
                Contact Us
              </Link>
            </li>
            <li>
              <OutboundLink href={SITE.fifaScheduleUrl}>
                Full FIFA schedule
              </OutboundLink>
            </li>
          </ul>
        </div>

        <div className="sm:col-span-2 lg:col-span-2">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-faint">
            Host cities
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-3">
            {COUNTRY_ORDER.flatMap((country) => grouped[country]).map((c) => (
              <Link
                key={c.slug}
                href={`/cities/${c.slug}`}
                className="text-ink hover:text-accent"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col items-start justify-between gap-1 py-4 text-xs text-faint sm:flex-row sm:items-center">
          <span>
            © {new Date().getFullYear()} {SITE.name}. Not affiliated with FIFA.
          </span>
          <span>{SITE.domain}</span>
        </Container>
      </div>
    </footer>
  );
}
