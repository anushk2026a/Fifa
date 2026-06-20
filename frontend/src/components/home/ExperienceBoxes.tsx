import Link from "next/link";

type Box = {
  label: string;
  blurb: string;
  image: string;
  gradient: string; // colorful overlay tint, shown even if the image is slow/unavailable
};

const BOXES: Box[] = [
  {
    label: "Restaurants",
    blurb: "Eat near the stadium — within 1, 2, 5 or 10 miles.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=60",
    gradient: "from-amber-500/90 to-orange-600/90",
  },
  {
    label: "Hotels",
    blurb: "Find a place to stay close to the match.",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60",
    gradient: "from-sky-500/90 to-indigo-600/90",
  },
  {
    label: "Transportation",
    blurb: "Rideshare, metro, parking and getting there.",
    image:
      "https://i.ytimg.com/vi/S1eNwqxuokA/sddefault.jpg",
    gradient: "from-emerald-500/90 to-teal-600/90",
  },
  {
    label: "Tickets",
    blurb: "Official FIFA ticket links for every host city.",
    image:
      "https://www.theglobeandmail.com/resizer/v2/4BKQYLDUKJDPZEA56GFN3JN2CQ.JPG?auth=54b15254f653e2a107aea08711036998df0b8613093727189bb3293e92269204&width=900&height=600&quality=80&smart=true",
    gradient: "from-violet-500/90 to-purple-600/90",
  },
  {
    label: "Match Screening Zone",
    blurb: "Fan festivals and public viewing spots.",
    image:
      "https://images.unsplash.com/photo-1522778526097-ce0a22ceb253?auto=format&fit=crop&w=800&q=60",
    gradient: "from-rose-500/90 to-pink-600/90",
  },
];

export function ExperienceBoxes() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {BOXES.map((box) => (
        <Link
          key={box.label}
          href="/locations"
          className="group relative isolate flex min-h-[150px] flex-col justify-end overflow-hidden rounded-[var(--radius-card)] p-5 text-white shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          {/* Photo background (zooms on hover) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={box.image}
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Colorful gradient tint — keeps the card vivid even before the photo loads */}
          <div
            className={`absolute inset-0 -z-10 bg-gradient-to-br ${box.gradient} mix-blend-multiply transition-opacity duration-300 group-hover:opacity-90`}
          />
          {/* Bottom darkening for text legibility */}
          <div className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-black/60 to-transparent" />

          <span className="text-lg font-semibold text-white tracking-tight drop-shadow-sm">{box.label}</span>
          <span className="mt-1 text-sm text-white/80">{box.blurb}</span>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-white">
            Choose a city
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
