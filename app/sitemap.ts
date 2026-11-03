import type { MetadataRoute } from "next";
import { getDestinations, getPackages } from "@/lib/data/packages";
import { stories } from "@/lib/mock/stories";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/packages", "/couples", "/destinations", "/trip-shaper", "/journal", "/about", "/how-it-works", "/plan", "/contact", "/offers", "/groups", "/faq", "/time-zones", "/terms", "/travel-information", "/privacy", "/credits"];
  return [
    ...pages.map((p) => ({ url: `${siteUrl}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...(await getPackages()).map((p) => ({ url: `${siteUrl}/packages/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...(await getDestinations()).map((d) => ({ url: `${siteUrl}/destinations/${d.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...stories.map((s) => ({ url: `${siteUrl}/journal/${s.slug}`, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
