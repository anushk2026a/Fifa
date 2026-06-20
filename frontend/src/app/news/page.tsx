import type { Metadata } from "next";
import { Container } from "@/components/common/Container";
import { NewsCard } from "@/components/news/NewsCard";
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
      <section className="border-b border-line bg-accent-soft">
        <Container className="py-12 sm:py-16">
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">News</h1>
          <p className="mt-3 max-w-2xl text-base text-muted">
            Recent matches and updates from across the 16 host cities.
          </p>
        </Container>
      </section>

      <Container className="py-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <NewsCard key={item.id ?? item.title} item={item} />
          ))}
        </div>
      </Container>
    </>
  );
}
