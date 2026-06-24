/**
 * Seed script — run with `npm run seed`.
 *  • Upserts the admin account (from ADMIN_EMAIL / ADMIN_PASSWORD, defaults
 *    adminfifa@gmail.com / 123456) — safe to re-run, it resets the password.
 *  • Populates the News collection on first run only, so it never wipes items
 *    an admin has added. Pass `--force-news` to overwrite the news collection.
 */
import { env } from "../config/env";
import { upsertAdmin } from "../modules/auth";
import { getNewsStore, type News } from "../modules/news";
import { closeDb } from "../shared/db/mongo";

const FIFA =
  "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026";

// Illustrative FIFA World Cup 2026 items in the site's curated style.
// (The source site codingofworld.in/sports renders its articles client-side
//  from a private API, so these are written to match, not scraped. Replace or
//  add the real stories any time from the admin dashboard.)
const SEED_NEWS: News[] = [
  {
    title: "Canada open with a statement win in Vancouver",
    date: "2026-06-18",
    summary:
      "The co-hosts thrilled a packed BC Place, with the crowd and fan festival turning downtown Vancouver into a sea of red.",
    url: FIFA,
    source: "FIFA",
    image: "/images/news/canada_stadium.png",
  },
  {
    title: "Switzerland find their rhythm in Los Angeles",
    date: "2026-06-18",
    summary:
      "A four-goal display at SoFi Stadium gives the Swiss early momentum as the Western region heats up.",
    url: FIFA,
    source: "FIFA",
    image:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Atlanta kicks off as Czechia and South Africa share the points",
    date: "2026-06-18",
    summary:
      "Mercedes-Benz Stadium hosted a tense opener, with MARTA carrying thousands of fans from downtown to the gates.",
    url: FIFA,
    source: "FIFA",
    image:
      "https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Mexico City roars as Estadio Azteca makes World Cup history",
    date: "2026-06-17",
    summary:
      "Estadio Azteca becomes the first stadium to host matches across three different World Cups, with a record crowd for the opener.",
    url: FIFA,
    source: "FIFA One Point",
    image:
      "https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Record ticket demand across all 16 host cities",
    date: "2026-06-15",
    summary:
      "FIFA confirms the 2026 edition has drawn the highest ticket demand in tournament history as the expanded 48-team format gets under way.",
    url: `${FIFA}/tickets`,
    source: "FIFA",
    image:
      "https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Dallas readies AT&T Stadium for a marquee run of fixtures",
    date: "2026-06-14",
    summary:
      "Arlington gears up for one of the busiest match schedules of the tournament, with DART shuttles and fan zones across the metroplex.",
    url: FIFA,
    source: "FIFA One Point",
    image:
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "New York / New Jersey to host the 2026 Final at MetLife Stadium",
    date: "2026-06-12",
    summary:
      "The Meadowlands prepares for the showpiece on July 19, with NJ Transit running expanded match-day service from Manhattan.",
    url: FIFA,
    source: "FIFA",
    image:
      "https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=800&q=80",
  },
];

async function main() {
  const forceNews = process.argv.includes("--force-news");

  const admin = await upsertAdmin(env.ADMIN_EMAIL, env.ADMIN_PASSWORD);
  console.log(`[seed] admin ready → ${admin.email}`);

  const store = await getNewsStore();
  const existing = await store.count();
  if (forceNews || existing === 0) {
    const rows = await store.replaceAll(SEED_NEWS);
    console.log(
      `[seed] news seeded → ${rows.length} items${forceNews ? " (forced)" : ""}`,
    );
  } else {
    console.log(
      `[seed] news left as-is → ${existing} existing items (use --force-news to overwrite)`,
    );
  }

  console.log(`[seed] storage → ${env.MONGODB_URI ? "MongoDB" : "JSON file"}`);
  console.log("[seed] done.");
}

main()
  .catch((err) => {
    console.error("[seed] failed:", err);
    process.exitCode = 1;
  })
  .finally(() => closeDb());
