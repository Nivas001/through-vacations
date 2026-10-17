import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPackage } from "@/lib/data/packages";
import { BookingFlow } from "@/components/booking/booking-flow";
import { PageIntro } from "@/components/layout/page-intro";

export const metadata: Metadata = { title: "Reserve your trip" };

export default async function BookPage({ params, searchParams }: PageProps<"/book/[slug]">) {
  const pkg = await getPackage((await params).slug);
  if (!pkg) notFound();
  const sp = await searchParams;
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k][0] : sp[k]);
  const initial = {
    ...(one("date") && { date: one("date") }),
    ...(one("adults") && { adults: Math.min(12, Math.max(1, Number(one("adults")) || 2)) }),
    ...(one("children") && { children: Math.min(8, Math.max(0, Number(one("children")) || 0)) }),
  };
  return (
    <>
      <PageIntro eyebrow="Reserve" title={`Let's plan ${pkg.destination}`} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6"><BookingFlow pkg={pkg} initial={initial} /></div>
    </>
  );
}
