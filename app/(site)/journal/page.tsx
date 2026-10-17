import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { IG } from "@/lib/site";
import { stories } from "@/lib/mock/stories";
import { PageIntro } from "@/components/layout/page-intro";
import { ExternalButton } from "@/components/brand/link-button";
import { JournalList } from "@/components/journal/journal-list";

export const metadata: Metadata = { title: "Journal" };

export default function JournalPage() {
  return (
    <>
      <PageIntro eyebrow="A little inspiration" title="The journey starts *before* you go">Itinerary stories, written from the routes we share on Instagram.</PageIntro>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <JournalList stories={stories} />
        <div className="mt-16"><ExternalButton href={IG} className="h-12 px-7">Follow @throughvacations <ArrowUpRight /></ExternalButton></div>
      </div>
    </>
  );
}
