import Link from "next/link";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { OutboundLink } from "@/components/common/OutboundLink";
import { MatchList } from "@/components/home/MatchList";
import { ExperienceBoxes } from "@/components/home/ExperienceBoxes";
import { Faq } from "@/components/home/Faq";
import { NewsCard } from "@/components/news/NewsCard";
import { NEWS } from "@/data/news";
import { SITE } from "@/data/site";

export default function HomePage() {
  return (
    <>
      {/* 1 — Banner */}
      <section className="border-b border-line bg-accent-soft">
        <Container className="py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            FIFA World Cup 2026 · USA · Canada · Mexico
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
            One point for everything World Cup 2026.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted sm:text-lg">
            Find your host city and plan your match day — matches, restaurants, hotels,
            transport, tickets and fan zones near every stadium.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/locations"
              className="rounded border border-accent bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-strong"
            >
              Browse host cities
            </Link>
            <OutboundLink
              href={SITE.fifaScheduleUrl}
              showIcon={false}
              className="rounded border border-line bg-surface px-4 py-2 text-sm font-medium text-ink no-underline hover:border-accent hover:text-accent"
            >
              Full schedule ↗
            </OutboundLink>
          </div>
        </Container>
      </section>

      {/* 2 — About */}
      <section className="border-b border-line">
        <Container className="py-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-faint">About</p>
          <p className="mt-2 max-w-3xl text-lg text-ink">
            Find places near your match location. We gather the official links and local
            know-how for all 16 host cities so you can eat, sleep, get to the stadium, grab
            tickets and find where to watch — all in one place.
          </p>
        </Container>
      </section>

      {/* 3 — Matches */}
      <section className="border-b border-line">
        <Container className="py-12">
          <SectionHeading
            eyebrow="Matches"
            title="Today & tomorrow"
            action={<OutboundLink href={SITE.fifaScheduleUrl}>Full schedule</OutboundLink>}
          />
          <MatchList />
        </Container>
      </section>

      {/* 4 — Experience */}
      <section className="border-b border-line bg-paper">
        <Container className="py-12">
          <SectionHeading eyebrow="Plan your trip" title="Experience FIFA World Cup 2026" />
          <ExperienceBoxes />
        </Container>
      </section>

      {/* 5 — News */}
      <section className="border-b border-line">
        <Container className="py-12">
          <SectionHeading
            eyebrow="News"
            title="From the tournament"
            action={<Link href="/news" className="text-accent hover:text-accent-strong">All news →</Link>}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {NEWS.slice(0, 3).map((item) => (
              <NewsCard key={item.title} item={item} />
            ))}
          </div>
        </Container>
      </section>

      {/* 6 — FAQ */}
      <section>
        <Container className="py-12">
          <SectionHeading eyebrow="Help" title="Frequently asked questions" />
          <Faq />
        </Container>
      </section>
    </>
  );
}
