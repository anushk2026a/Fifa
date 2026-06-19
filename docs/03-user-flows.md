# 03 — User Flows (Phase 1: Static Site)

Each flow is the shortest path from intent to answer. On a static site every "action" is either a page navigation or an outbound link — there are no logins or API waits.

## Flow A — "I have a match tomorrow in Dallas"
```
Home (Sports)
  → "Tomorrow" match block shows Dallas (AT&T Stadium, kickoff time)
  → click the city link  OR  Locations ▾ → Dallas
City: Dallas
  → Restaurants (Within 1 mi) → pick a place → [Map ↗] opens Google Maps
  → Hotels (5 mi) → [Website ↗] to book
  → Transportation → Parking / Getting there → outbound link
  → Tickets → official FIFA tickets ↗
Done — eat, sleep, get-there, tickets, all from one page.
```

## Flow B — Local fan with no ticket
```
Home → Locations ▾ → Seattle
City: Seattle → anchor chip "Match Screening Zone"
  → FIFA Fan Festival location/hours + outbound link
  → public viewing / local watch parties
```

## Flow C — Browsing by category from Home
```
Home → "Experience FIFA World Cup 2026" → click [ Restaurants ]
Locations page (the boxes all lead here)
  → pick a city → City page → Restaurants section
```

## Flow D — Trip-planning tourist
```
Home → reads About + News
  → Locations → Los Angeles
City: LA → Transportation (Metro, getting there) → Hotels (10 mi)
```

## Flow E — Returning fan checks today's matches
```
Home
  → "Today" block (auto by date) shows scores/kickoffs + city links
  → "Full schedule ↗" to FIFA for the rest of the tournament
```

## Flow F — Local business / fan gets in touch
```
Any page → Contact Us
  → reads "share your details and we'll guide you for your location"
  → fills form (name, email, city, message) → submit
  → backend (POST /api/contact) emails the team via SMTP; success message shown
```

## Cross-cutting rules
- **Outbound links open the fan's real destination** (FIFA, Google Maps, hotel/transit/ticket sites), clearly marked as leaving the site, `rel="noopener"`, new tab.
- **Graceful empty states:** if a city section has no entries yet, show a helpful line ("Listings coming soon — see the official city guide ↗") rather than a blank box.
- **No dead ends:** city footers cross-link to nearby cities and the full schedule.
- **No accounts, no loading spinners for content** — pages are pre-rendered and instant.
