import type { Metadata } from "next";
import { getPackages } from "@/lib/data/packages";
import { TripShaper } from "@/components/shaper/trip-shaper";
import { PageIntro } from "@/components/layout/page-intro";

export const metadata: Metadata = { title: "Trip Shaper", description: "Pick a place, a month and your days. See the effort, the season and what to sort before you go." };

export default async function TripShaperPage({ searchParams }: PageProps<"/trip-shaper">) {
  const t = (await searchParams).trip;
  const packages = await getPackages();
  return (
    <>
      <PageIntro eyebrow="Trip Shaper" title="How much trip is *too much* trip?">
        Pick a place, a month and your days. See what the plan asks of you, whether the season is kind and what to sort before you go. No prices, just planning.
      </PageIntro>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <TripShaper packages={packages} initial={typeof t === "string" ? t : undefined} />
      </div>
    </>
  );
}
