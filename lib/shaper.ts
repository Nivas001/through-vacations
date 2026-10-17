import type { DayPace, TravelPackage } from "./types";

export type Pace = "Relaxed" | "Balanced" | "Packed";
export type ShaperInput = { days: number; month: number; adults: number; kids: number; seniors: boolean; pace: Pace };

export type EffortPart = { label: string; value: number; note: string }; // value 0..1
export type Season = { level: "great" | "shoulder" | "off"; note: string };

const effortLabels = ["", "Easy-going", "Gentle", "Balanced", "Busy", "Full-on"];

export function effortLabel(n: number) {
  return effortLabels[Math.min(5, Math.max(1, Math.round(n)))];
}

export function season(pkg: TravelPackage, month: number): Season {
  if (!month) return { level: "great", note: "Pick a month to check the season." };
  if (pkg.bestMonths.includes(month)) return { level: "great", note: "A great month to go. This is when the trip tends to be at its best." };
  const near = pkg.bestMonths.some((m) => Math.abs(m - month) === 1 || Math.abs(m - month) === 11);
  return near
    ? { level: "shoulder", note: "Shoulder season. Often quieter and still lovely, with a bit more weather risk. We plan around it." }
    : { level: "off", note: "Off-season for this trip. Weather can limit activities, so we would suggest alternatives or a different month." };
}

/** Planning effort, not money. Combines the trip's own facts with who is travelling and how packed the days are. */
export function effort(pkg: TravelPackage, i: ShaperInput) {
  const f = pkg.facts;
  const nights = i.days - 1;
  const [minN, maxN] = f?.nights ?? [pkg.nights, pkg.nights];
  const hotels = Math.max(0, (f?.bases.length ?? 1) - 1);
  const active = pkg.itinerary.filter((d) => d.pace === "Active" || d.pace === "Adventure").length;
  const activeShare = pkg.itinerary.length ? active / pkg.itinerary.length : 0.3;
  const rush = nights < minN ? Math.min(1, (minN - nights) / Math.max(1, minN)) : 0;
  const slack = nights > maxN ? Math.min(1, (nights - maxN) / Math.max(1, maxN)) : 0;

  const parts: EffortPart[] = [
    { label: "Getting there", value: ((f?.transfer ?? 2) - 1) / 4, note: f?.fromChennai ?? "Confirmed in your quote" },
    { label: "Hotel changes", value: Math.min(1, hotels / 4), note: hotels === 0 ? "One base, unpack once" : `${hotels + 1} bases: ${f?.bases.join(" → ")}` },
    { label: "Busy days", value: Math.min(1, activeShare * 1.5), note: `${active} of ${pkg.itinerary.length} planned days are active or adventurous` },
    { label: "Days squeezed", value: rush, note: rush > 0 ? `${nights} nights is tight for this route (we suggest ${minN} to ${maxN})` : slack > 0 ? "Plenty of room, add rest days or an extra stop" : "Your days fit the route well" },
  ];

  let score = 1 + parts[0].value * 1.1 + parts[1].value * 1 + parts[2].value * 1 + rush * 1.6;
  score += i.pace === "Packed" ? 0.9 : i.pace === "Relaxed" ? -0.7 : 0;
  score += (i.kids > 0 ? 0.4 : 0) + (i.seniors ? 0.5 : 0);
  score -= slack * 0.4;
  const rounded = Math.min(5, Math.max(1, Math.round(score)));
  return { score: rounded, label: effortLabel(rounded), parts };
}

export type DayChoice = { index: number; title: string; pace?: DayPace; kept: boolean };

/** Which of the published days stay, if you have fewer (or more) days than the route. */
export function shape(pkg: TravelPackage, days: number): { days: DayChoice[]; extra: number } {
  const plan = pkg.itinerary;
  const cut = Math.max(0, plan.length - days);
  const order = plan
    .map((d, index) => ({ d, index }))
    .filter(({ index }) => index !== 0 && index !== plan.length - 1)
    .sort((a, b) => cutRank(a.d.pace) - cutRank(b.d.pace));
  const dropped = new Set(order.slice(0, cut).map((x) => x.index));
  return {
    days: plan.map((d, index) => ({ index, title: d.title, pace: d.pace, kept: !dropped.has(index) })),
    extra: Math.max(0, days - plan.length),
  };
}
// Lower rank is dropped first: easy and free days go before adventures; travel days last.
const cutRank = (p?: DayPace) => ({ Free: 0, Easy: 1, Active: 2, Adventure: 3, "Travel day": 4 }[p ?? "Easy"]);

export function paperwork(pkg: TravelPackage): string[] {
  const f = pkg.facts;
  const list = [f?.paperwork ?? "Government photo ID for every traveller."];
  list.push(f?.international ? "Tickets and hotel confirmations saved offline" : "Tickets and hotel confirmations saved offline, plus a printout of your ID");
  if (f?.international) list.push("Some foreign currency or a travel card that works abroad", "Travel insurance is strongly recommended");
  if (pkg.slug === "ladakh") list.push("Ask your doctor about altitude medicine before you go");
  list.push("Any regular medicines, in original packaging");
  return list;
}

export function packing(pkg: TravelPackage, month: number): string[] {
  const cold = ["kashmir", "ladakh", "shimla-manali-amritsar"].includes(pkg.slug) || (pkg.slug === "coorg" && [12, 1, 2].includes(month));
  const wet = [6, 7, 8, 9].includes(month) && pkg.region === "India" && !["ladakh", "udaipur-jaipur"].includes(pkg.slug);
  const out = ["Comfortable walking shoes", "Phone charger and a power bank", "A reusable water bottle"];
  if (pkg.styles.includes("Beach")) out.push("Swimwear and a quick-dry towel", "Reef-safe sunscreen and a hat");
  if (cold) out.push("Warm layers and a windproof jacket", "Moisturiser and lip balm for dry air");
  if (wet) out.push("A light rain jacket or compact umbrella");
  if (pkg.styles.includes("Nature") && !cold) out.push("Shoes with grip for uneven paths");
  if (pkg.styles.includes("Culture")) out.push("A light scarf or stole for temples");
  if (pkg.facts?.international) out.push("A universal travel adapter");
  return out;
}
