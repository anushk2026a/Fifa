import type { MetadataRoute } from "next";
import { CITIES } from "@/data/cities";
import { SITE } from "@/data/site";

const base = `https://${SITE.domain}`;

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/locations", "/news", "/contact"].map((path) => ({
    url: `${base}${path}/`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const cityRoutes = CITIES.map((c) => ({
    url: `${base}/cities/${c.slug}/`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...cityRoutes];
}
