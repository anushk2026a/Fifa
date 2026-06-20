import { OutboundLink } from "@/components/common/OutboundLink";
import type { NewsItem } from "@/data/types";
import { prettyDate } from "@/lib/schedule";
import { MdOpenInNew } from "react-icons/md";
import { RiNewspaperLine } from "react-icons/ri";
import { HiOutlineCalendar } from "react-icons/hi";
import { TbSourceCode } from "react-icons/tb";

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-black/5">

      {/* Image */}
      {item.image ? (
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
          {/* Gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          {/* Source badge over image */}
          {item.source && (
            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
              <TbSourceCode size={12} aria-hidden="true" />
              {item.source}
            </span>
          )}
        </div>
      ) : (
        /* No-image fallback: decorative header strip */
        <div className="relative flex h-14 items-center justify-between overflow-hidden bg-gradient-to-r from-accent/10 via-accent/5 to-transparent px-5">
          <RiNewspaperLine
            size={28}
            className="text-accent/30 transition-transform duration-300 group-hover:scale-110 group-hover:text-accent/50"
            aria-hidden="true"
          />
          {item.source && (
            <span className="text-[11px] font-medium uppercase tracking-widest text-muted">
              {item.source}
            </span>
          )}
          {/* Decorative dots */}
          <div className="absolute right-0 top-0 flex gap-2 opacity-20">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="mt-2 h-1.5 w-1.5 rounded-full bg-accent"
                style={{ marginTop: `${(i % 3) * 6 + 4}px` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-5">

        {/* Meta row */}
        <div className="flex items-center gap-3">
          {/* Live pulse dot — signals recency */}
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-faint">
            <HiOutlineCalendar size={12} aria-hidden="true" />
            {prettyDate(item.date)}
          </span>
          {/* Source shown here only when there's an image (badge handles it otherwise) */}
          {item.source && item.image && (
            <>
              <span className="text-faint/40">·</span>
              <span className="text-xs text-faint">{item.source}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold leading-snug text-ink transition-colors duration-150 group-hover:text-accent">
          {item.title}
        </h3>

        {/* Summary */}
        <p className="flex-1 text-sm leading-relaxed text-muted line-clamp-3">
          {item.summary}
        </p>

        {/* Divider */}
        <div className="mt-1 h-px w-full bg-line" />

        {/* CTA */}
        <div className="flex items-center justify-between pt-1">
          <OutboundLink
            href={item.url}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-all duration-150 hover:gap-2.5"
          >
            Read full story
            <MdOpenInNew
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </OutboundLink>
          {/* External link indicator */}
          <span className="rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-widest text-faint">
            External
          </span>
        </div>
      </div>
    </article>
  );
}