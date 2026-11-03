import type { Metadata } from "next";
import Image from "next/image";
import { Briefcase, Bus, ClipboardCheck, GraduationCap, Hotel, MessageCircle, Tent, UserRound, Users, Utensils } from "lucide-react";
import { PageIntro } from "@/components/layout/page-intro";
import { SectionHeading } from "@/components/brand/section-heading";
import { QuoteForm } from "@/components/plan/quote-form";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Group & corporate trips",
  description: "Corporate offsites, incentive trips, student industrial visits and family group holidays, planned by Through Vacations in Pondicherry and Chennai.",
};

const kinds = [
  { icon: Briefcase, title: "Corporate offsites", body: "Team outings, conferences and incentive trips, with venues, stays and activities in one plan.", img: "/media/dubai-3.webp" },
  { icon: GraduationCap, title: "Student industrial visits", body: "Educational tours and industrial visits for colleges and schools, with transport and safe stays.", img: "/media/coorg-2.webp" },
  { icon: Users, title: "Family & friends groups", body: "Weddings, reunions and big family holidays where everyone travels together without the hassle.", img: "/media/goa-3.webp" },
  { icon: Tent, title: "Camping & resort stays", body: "Weekend camps and resort getaways for teams, clubs and communities.", img: "/media/munnar-alleppey-3.webp" },
];

const handled = [
  { icon: Bus, t: "Group transport", d: "Coaches, tempo travellers, trains or flights for the whole group." },
  { icon: Hotel, t: "Stays together", d: "Room blocks in the same hotel or resort, with rooming lists sorted." },
  { icon: Utensils, t: "Meals", d: "Group meals and dietary needs planned in advance." },
  { icon: ClipboardCheck, t: "Itinerary and permits", d: "Day plans, entry tickets and any visit permissions arranged ahead." },
  { icon: UserRound, t: "One point of contact", d: "A single planner for the organiser before and during the trip." },
  { icon: MessageCircle, t: "Updates on WhatsApp", d: "Quick answers and changes for the organiser at any time." },
];

export default function GroupsPage() {
  return (
    <>
      <PageIntro eyebrow="Groups" title="Bigger trips, *simpler* planning" aside={
        <div className="relative hidden aspect-[4/3] overflow-hidden rounded-[1.75rem] lg:block">
          <Image src="/media/goa-2.webp" alt="Friends on a beach in Goa" fill priority sizes="40vw" className="object-cover" />
          <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-ink">Corporate · College · Family</span>
        </div>
      }>
        Corporate offsites, student industrial visits and family groups. One planner, one plan, and a group quote that covers everyone.
      </PageIntro>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {kinds.map(({ icon: Icon, title, body, img }) => (
            <li key={title} className="card-lift overflow-hidden rounded-[1.5rem] border bg-card">
              <div className="relative aspect-[16/10]"><Image src={img} alt="" fill sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" className="object-cover" /></div>
              <div className="p-5">
                <span className="-mt-11 relative grid size-12 place-items-center rounded-2xl bg-sun text-sun-foreground shadow-lg"><Icon className="size-6" /></span>
                <h2 className="mt-3 text-2xl font-extrabold">{title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </div>
            </li>
          ))}
        </ul>

        <section className="mt-24">
          <SectionHeading eyebrow="What we handle" title="Everything the *organiser* worries about" />
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {handled.map(({ icon: Icon, t, d }) => (
              <li key={t} className="flex gap-4 rounded-2xl border bg-card p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-brand"><Icon className="size-5" /></span>
                <span><span className="block font-bold">{t}</span><span className="text-sm text-muted-foreground">{d}</span></span>
              </li>
            ))}
          </ul>
        </section>

        <section id="enquire" className="mt-24 grid scroll-mt-28 grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <SectionHeading eyebrow="Group enquiry" title="Tell us about your *group*" />
            <div className="mt-8"><QuoteForm presetStyles={["Group"]} travellers={20} notes={"Group type (corporate, college, family): \nPreferred dates: \nRooming (twin/triple): "} /></div>
          </div>
          <aside className="space-y-4 lg:pt-24">
            <div className="rounded-[1.5rem] bg-ink p-6 text-white">
              <p className="font-display text-2xl leading-tight font-extrabold">Planning for a college or company?</p>
              <p className="mt-2 text-sm text-white/75">Share the headcount, dates and budget per person. We send a group quote with everything listed.</p>
              <a href={whatsappLink("Hi! I would like a quote for a group trip.")} target="_blank" rel="noreferrer" className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-bold"><MessageCircle className="size-4" /> WhatsApp the team</a>
            </div>
            <div className="rounded-[1.5rem] border bg-card p-6 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Good to know</p>
              <ul className="mt-2 space-y-1.5">
                <li>• Group rates depend on headcount and dates.</li>
                <li>• We share rooming and payment plans with the organiser.</li>
                <li>• Both our Pondicherry and Chennai offices plan group trips.</li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </>
  );
}
