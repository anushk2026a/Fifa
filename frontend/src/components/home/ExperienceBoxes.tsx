import Link from "next/link";

const BOXES: { label: string; blurb: string }[] = [
  { label: "Restaurants", blurb: "Eat near the stadium — within 1, 2, 5 or 10 miles." },
  { label: "Hotels", blurb: "Find a place to stay close to the match." },
  { label: "Transportation", blurb: "Rideshare, metro, parking and getting there." },
  { label: "Tickets", blurb: "Official FIFA ticket links for every host city." },
  { label: "Match Screening Zone", blurb: "Fan festivals and public viewing spots." },
];

export function ExperienceBoxes() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {BOXES.map((box) => (
        <Link
          key={box.label}
          href="/locations"
          className="group flex flex-col rounded-[var(--radius-card)] border border-line bg-surface p-5 transition-colors hover:border-accent hover:bg-accent-soft"
        >
          <span className="text-base font-semibold text-ink group-hover:text-accent-strong">
            {box.label}
          </span>
          <span className="mt-1 text-sm text-muted">{box.blurb}</span>
          <span className="mt-3 text-sm font-medium text-accent">Choose a city →</span>
        </Link>
      ))}
    </div>
  );
}
