import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/page-intro";

export const metadata: Metadata = { title: "Travel information" };

const items = [
  ["Passports and visas", "Entry rules vary by destination and nationality. We offer visa assistance and passport services, and confirm what applies to you in your quote."],
  ["Prices and inclusions", "Prices shown are indicative starting prices from published promotions. Inclusions vary by package. Your personal quote confirms dates, inclusions and the final price."],
  ["Weather and activities", "Island, desert and hill activities depend on local conditions and access. Itineraries are subject to change for safety and weather."],
  ["Payments", "No payment is taken on this website. After your request is confirmed, the team shares payment details with you directly."],
  ["Changes and cancellations", "Terms depend on the services booked (hotels, flights, activities). They are shared with your quote before you confirm."],
];

export default function TravelInfoPage() {
  return (
    <>
      <PageIntro eyebrow="Good to know" title="Travel information" />
      <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6">
        {items.map(([t, b]) => (
          <section key={t}><h2 className="text-3xl font-extrabold">{t}</h2><p className="mt-2 text-muted-foreground">{b}</p></section>
        ))}
      </div>
    </>
  );
}
