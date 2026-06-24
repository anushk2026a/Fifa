import type { Metadata } from "next";
import { Container } from "@/components/common/Container";
import { NewsCard } from "@/components/news/NewsCard";
import { AosInit } from "@/components/common/AosInit";
import { getNews } from "@/lib/news";

export const metadata: Metadata = {
  title: "News — FIFA World Cup 2026",
  description: "Recent FIFA World Cup 2026 match news and updates from the host cities.",
};

// Always render fresh news (admin-managed, served by the backend).
export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const news = await getNews();
  return (
    <>
      <AosInit />
      <section className="bg-gradient-to-b from-[#012A6B] to-[#001B44] text-white">
        <Container className="py-12 sm:py-16">
          <h1
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
            data-aos="fade-right"
            data-aos-duration="700"
          >
            News
          </h1>
          <p
            className="mt-3 max-w-2xl text-base !text-white/70 font-medium"
            data-aos="fade-right"
            data-aos-delay="120"
            data-aos-duration="700"
          >
            Recent matches and updates from across the 16 host cities.
          </p>
        </Container>
      </section>

      <Container className="py-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item, i) => (
            <NewsCard key={item.id ?? item.title} item={item} index={i} />
          ))}
        </div>
      </Container>
    </>
  );
}
