import type { TravelPackage } from "./types";
import { shownPrice } from "./data/packages";

export const addOnOptions = [
  { id: "flights", label: "Flights", hint: "We quote flights from your city" },
  { id: "visa", label: "Visa assistance", hint: "Guidance and paperwork support" },
  { id: "extra-nights", label: "Extra nights", hint: "Extend your stay" },
  { id: "travel-insurance", label: "Travel insurance", hint: "Options shared in your quote" },
] as const;

/** Indicative only: published per-person price x travellers. The team confirms the final amount. */
export function estimate(pkg: TravelPackage, adults: number, children: number): number | null {
  const price = shownPrice(pkg);
  return price ? price * (adults + children) : null;
}

/** Call from event handlers only (reads the clock). */
export const isTooSoon = (iso: string) => !iso || iso < new Date(Date.now() + 2 * 864e5).toISOString().slice(0, 10);
