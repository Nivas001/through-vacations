import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/page-intro";
import { WorldClock } from "@/components/clock/world-clock";

export const metadata: Metadata = {
  title: "World clock",
  description: "See the time in Dubai, the Maldives, Thailand, Bali, Singapore and anywhere else at a glance, slide through the day, and find the best time to call home.",
};

export default function TimeZonesPage() {
  return (
    <>
      <PageIntro eyebrow="World clock" title="What time is it *there*?">
        Every city you care about, side by side. Drag the clocks to plan a call, a flight or a surprise, and see the best time to ring home.
      </PageIntro>
      <div className="mx-auto max-w-7xl px-2 sm:px-6">
        <WorldClock />
      </div>
    </>
  );
}
