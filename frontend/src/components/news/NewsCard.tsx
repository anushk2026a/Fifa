import { OutboundLink } from "@/components/common/OutboundLink";
import type { NewsItem } from "@/data/types";
import { prettyDate } from "@/lib/schedule";

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="flex flex-col rounded-[var(--radius-card)] border border-line bg-surface p-5">
      <p className="text-xs text-faint">
        {prettyDate(item.date)}
        {item.source ? ` · ${item.source}` : ""}
      </p>
      <h3 className="mt-1 text-base font-semibold text-ink">{item.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{item.summary}</p>
      <p className="mt-3 text-sm">
        <OutboundLink href={item.url}>Read more</OutboundLink>
      </p>
    </article>
  );
}
