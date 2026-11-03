import type { Metadata } from "next";
import { Suspense } from "react";
import { PageIntro } from "@/components/layout/page-intro";
import { MyTrip } from "@/components/my-trip/my-trip";

export const metadata: Metadata = {
  title: "Manage my trip",
  description: "Check your Through Vacations booking or quote request: status, dates, payments and your office contact.",
  robots: { index: false },
};

export default function MyTripPage() {
  return (
    <>
      <PageIntro eyebrow="My trip" title="Your trip, *in one place*">
        Check your booking status, travel dates and payments, and reach your office in one tap.
      </PageIntro>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Suspense fallback={<div className="min-h-[30rem]" />}>
          <MyTrip />
        </Suspense>
      </div>
    </>
  );
}
