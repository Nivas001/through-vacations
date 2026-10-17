// Repository layer. Swap these bodies for Supabase queries later; signatures stay the same.
import { packages } from "../mock/packages";
import type { Region, TravelPackage, TravelStyle } from "../types";

export type PackageFilters = {
  q?: string;
  region?: Region;
  style?: TravelStyle;
  maxNights?: number;
  maxPrice?: number;
  month?: number;
  sort?: "featured" | "price-asc" | "price-desc" | "duration";
};

export async function getPackages(f: PackageFilters = {}): Promise<TravelPackage[]> {
  return filterPackages(packages.filter((p) => p.published), f);
}

export async function getPackage(slug: string): Promise<TravelPackage | null> {
  return packages.find((p) => p.slug === slug && p.published) ?? null;
}

export async function getFeaturedPackages(): Promise<TravelPackage[]> {
  return packages.filter((p) => p.published && p.featured);
}

export async function getDestinations() {
  const map = new Map<string, TravelPackage[]>();
  for (const p of packages.filter((x) => x.published)) {
    map.set(p.destination, [...(map.get(p.destination) ?? []), p]);
  }
  return [...map.entries()].map(([name, list]) => ({
    name,
    slug: slugify(name),
    region: list[0].region,
    image: list[0].image,
    packages: list,
  }));
}

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Pure filter so the client-side listing can reuse it without a round trip. */
export function filterPackages(list: TravelPackage[], f: PackageFilters): TravelPackage[] {
  const q = f.q?.trim().toLowerCase();
  let out = list.filter((p) => {
    if (q && !`${p.title} ${p.destination} ${p.tagline} ${p.summary} ${p.highlights.join(" ")}`.toLowerCase().includes(q)) return false;
    if (f.region && p.region !== f.region) return false;
    if (f.style && !p.styles.includes(f.style)) return false;
    if (f.maxNights && p.nights > f.maxNights) return false;
    if (f.maxPrice && (p.price === null || p.price > f.maxPrice)) return false;
    if (f.month && !p.bestMonths.includes(f.month)) return false;
    return true;
  });
  switch (f.sort) {
    case "price-asc":
      out = [...out].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
      break;
    case "price-desc":
      out = [...out].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
      break;
    case "duration":
      out = [...out].sort((a, b) => a.nights - b.nights);
      break;
    default:
      out = [...out].sort((a, b) => Number(b.featured) - Number(a.featured));
  }
  return out;
}

/** Pass `today` (ISO date) to enforce validUntil; omitted during prerender so pages stay static. */
export function shownPrice(p: TravelPackage, today?: string): number | null {
  return p.price && (!today || !p.validUntil || p.validUntil >= today) ? p.price : null;
}
