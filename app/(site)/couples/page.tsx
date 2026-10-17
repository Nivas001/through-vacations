import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Cake, Camera, Flower2, Gift, Heart, Sparkles, Utensils, Waves } from "lucide-react";
import { getPackages } from "@/lib/data/packages";
import { occasions, romance } from "@/lib/mock/romance";
import { whatsappLink } from "@/lib/site";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LinkButton, ExternalButton } from "@/components/brand/link-button";
import { SectionHeading } from "@/components/brand/section-heading";
import { Reveal } from "@/components/fx/reveal";
import { SpotlightCard } from "@/components/fx/spotlight-card";
import { PackageCard } from "@/components/packages/package-card";
import { RomanceExplorer, type RomanceItem } from "@/components/couples/romance-explorer";
import { HoneymoonQuiz, type QuizTrip } from "@/components/couples/honeymoon-quiz";
import { Wave } from "@/components/brand/wave";

export const metadata: Metadata = {
  title: "Couples and honeymoons",
  description: "Honeymoons, anniversaries and first trips together. Romantic date ideas for Maldives, Bali, Kashmir and more, plus a quiz to find your match.",
};

const touches = [
  { icon: Flower2, t: "Room decoration", d: "Flowers and towel art for the first night, set up before you arrive." },
  { icon: Utensils, t: "Candlelit dinners", d: "On a beach, a houseboat deck, a rooftop or among the coffee bushes." },
  { icon: Camera, t: "A couple's photoshoot", d: "A local photographer, a golden-hour slot and photos you will actually print." },
  { icon: Waves, t: "Sunset cruise or private boat", d: "A slow evening on the water, just the two of you and a boatman." },
  { icon: Cake, t: "Cake and a surprise", d: "For an anniversary or birthday on the road. Tell us, we handle the rest." },
  { icon: Sparkles, t: "Spa for two", d: "A couples' treatment on an afternoon you left empty on purpose." },
];

const faqs = [
  { q: "We are newly married. Should we mention it?", a: "Yes, please. Tell us your wedding date in the form or on WhatsApp. We flag it to your planner so the little touches are considered from the start." },
  { q: "Do you list fixed honeymoon discounts or coupons?", a: "We do not publish fixed discounts. Honeymoon and anniversary extras are quoted case by case, so ask for current couple offers when you enquire and your planner will tell you what is available for your dates." },
  { q: "Can you arrange room decoration and a candlelit dinner?", a: "Usually yes, on request, in most of the places we plan. Availability and charges vary by hotel and date, and are confirmed in your quote." },
  { q: "Is a babymoon possible?", a: "Often, with a gentler plan: shorter transfers, a relaxed pace and no high altitude. Please check with your doctor first. Tell us the months, and we will plan around their advice." },
  { q: "How early should we plan a honeymoon?", a: "The earlier the better for popular dates, since hotels and flights fill up. Short-notice trips are sometimes possible too, so ask us what works for your dates." },
  { q: "Can we go with just a rough idea?", a: "Of course. Try the quiz above, play with the Trip Shaper or just message us what you love. We will build the rest." },
];

export default async function CouplesPage() {
  const all = await getPackages();
  const items: RomanceItem[] = romance
    .map((r) => {
      const p = all.find((x) => x.slug === r.slug);
      return p ? { ...r, title: p.title, destination: p.destination, image: p.image, gallery: p.gallery, nights: p.nights, alt: p.imageAlt } : null;
    })
    .filter((x): x is RomanceItem => !!x);
  const trips: QuizTrip[] = items.map((i) => {
    const p = all.find((x) => x.slug === i.slug)!;
    return { slug: i.slug, title: p.title, destination: p.destination, image: p.image, region: p.region, nights: p.nights, bestMonths: p.bestMonths, vibes: i.vibes, line: i.line, tagline: p.tagline, notBabymoon: ["ladakh", "kashmir"].includes(i.slug) ? true : undefined };
  });
  const couplesTrips = all.filter((p) => p.styles.includes("Honeymoon") || p.styles.includes("Couples")).slice(0, 6);

  return (
    <>
      {/* hero */}
      <section className="mx-2 sm:mx-4">
        <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-ink text-white" style={{ minHeight: "max(620px, calc(100svh - 180px))" }}>
          <Image src="/media/maldives.webp" alt="Water villas and a white sandbank in the Maldives" fill priority sizes="100vw" quality={85} className="kenburns object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-transparent" />
          <div className="relative flex min-h-[inherit] flex-col justify-end px-5 pt-28 pb-12 sm:px-12 sm:pb-16">
            <p className="fade-up inline-flex w-fit items-center gap-2 rounded-full bg-sun px-3.5 py-1.5 text-[0.7rem] font-bold tracking-[0.18em] text-sun-foreground uppercase"><Heart className="size-3.5 fill-current" /> Couples and honeymoons</p>
            <h1 className="fade-up mt-5 max-w-4xl font-display text-[2.6rem] leading-[0.95] font-extrabold sm:text-7xl lg:text-8xl" style={{ animationDelay: "80ms" }}>
              Two of you.<br /><span className="text-sun">One trip.</span>
            </h1>
            <p className="fade-up mt-6 max-w-xl text-lg text-white/90" style={{ animationDelay: "160ms" }}>Honeymoons, anniversaries and first trips together, planned slowly and personally from Pondicherry.</p>
            <div className="fade-up mt-8 flex flex-wrap gap-3" style={{ animationDelay: "240ms" }}>
              <LinkButton href="#quiz" variant="sun" size="lg" className="h-12 px-7 text-base">Find our honeymoon match <ArrowDown /></LinkButton>
              <LinkButton href="/plan?occasion=honeymoon" variant="outline" size="lg" className="h-12 border-2 border-white bg-transparent px-6 text-base text-white hover:bg-white hover:text-ink">Plan for two <ArrowUpRight /></LinkButton>
            </div>
            <ul className="mt-8 flex flex-wrap gap-2 text-xs font-bold tracking-wider uppercase">
              {occasions.map((o) => <li key={o.id} className="liquid rounded-full px-4 py-2 !text-ink">{o.label}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* intro */}
        <Reveal>
          <p className="mx-auto mt-20 max-w-3xl text-center font-display text-3xl leading-[1.05] font-extrabold sm:text-5xl">
            A good couples&apos; trip is not about <span className="accent-word text-brand">more.</span> It is about the right <span className="accent-word text-brand">pace</span> and a few moments you will talk about for years.
          </p>
        </Reveal>

        {/* explorer */}
        <section className="mt-24">
          <SectionHeading eyebrow="Date ideas" title="How a romantic day could *feel*">
            Pick a place and see what a day for two looks like there, written the way we would describe it to a friend.
          </SectionHeading>
          <div className="mt-10"><RomanceExplorer items={items} /></div>
        </section>

        {/* quiz */}
        <section id="quiz" className="mt-28 scroll-mt-28">
          <SectionHeading eyebrow="Honeymoon match" title="Five questions, three *places*">Answer quickly. We rank our trips for your mood, season, time and occasion.</SectionHeading>
          <div className="mt-10"><HoneymoonQuiz trips={trips} /></div>
        </section>

        {/* touches */}
        <section className="mt-28">
          <SectionHeading eyebrow="Little touches" title="The small things that make it *yours*">Ask for any of these when you enquire. Availability and charges are confirmed in your quote.</SectionHeading>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {touches.map(({ icon: Icon, t, d }, i) => (
              <Reveal key={t} delay={(i % 3) * 80}>
                <li className="list-none">
                  <SpotlightCard className="card-lift h-full rounded-[1.5rem] border bg-card p-6">
                    <span className="grid size-12 place-items-center rounded-2xl bg-sun text-sun-foreground"><Icon className="size-6" /></span>
                    <h3 className="mt-5 text-2xl font-extrabold">{t}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{d}</p>
                  </SpotlightCard>
                </li>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* occasions */}
        <section className="mt-28">
          <SectionHeading eyebrow="Your occasion" title="Tell us what you are *celebrating*" />
          <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {occasions.map((o, i) => (
              <li key={o.id}>
                <a href={`/plan?occasion=${o.id}`} className="group grain relative flex h-full flex-col justify-between overflow-hidden rounded-[1.5rem] bg-primary p-6 text-white transition hover:-translate-y-1">
                  <span className="text-outline font-display text-6xl leading-none font-extrabold text-sun">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mt-10 block">
                    <span className="block font-display text-3xl leading-none font-extrabold">{o.label}</span>
                    <span className="mt-2 block text-sm text-white/80">{o.note}</span>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-sun">Start planning <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* trips */}
        <section className="mt-28">
          <SectionHeading eyebrow="Ready-made routes" title="Trips couples *love*" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {couplesTrips.map((p) => <PackageCard key={p.id} pkg={p} />)}
          </div>
          <div className="mt-8"><LinkButton href="/packages?style=Honeymoon" variant="outline" className="h-11 border-2 border-foreground px-6">All honeymoon trips <ArrowUpRight /></LinkButton></div>
        </section>

        {/* offers + faq */}
        <section className="mt-28 grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeading eyebrow="Questions" title="Good to *know*" />
            <div className="card-lift mt-8 rounded-[1.5rem] border-2 border-dashed border-sun bg-accent p-6 text-accent-foreground">
              <p className="flex items-center gap-2 font-display text-2xl leading-none font-extrabold"><Gift className="size-5" /> Couple offers</p>
              <p className="mt-3 text-sm">We do not publish fixed discounts. Ask for current couple and honeymoon offers when you enquire, and mention your wedding date.</p>
              <ExternalButton href={whatsappLink("Hi Through Vacations! We're a couple planning a trip. Could you share any current couple offers?")} className="mt-4 h-11 px-5">Ask on WhatsApp <ArrowUpRight /></ExternalButton>
            </div>
          </div>
          <Accordion className="card-lift rounded-[1.5rem] border bg-card px-5">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`f${i}`}>
                <AccordionTrigger className="py-5 text-left text-base font-bold">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* cta */}
        <section className="mt-28">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-sun px-6 py-16 text-center text-sun-foreground sm:px-16 sm:py-24">
            <Wave className="opacity-[0.25] invert" />
            <div className="relative">
              <h2 className="mx-auto max-w-3xl text-5xl leading-[0.95] font-extrabold sm:text-7xl">Tell us about <span className="accent-word accent-light text-primary">the two of you.</span></h2>
              <p className="mx-auto mt-6 max-w-lg text-sun-foreground/80">A planner replies with a personal itinerary and quote, with your occasion in mind.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <LinkButton href="/plan?occasion=honeymoon" size="lg" className="h-12 bg-ink px-7 text-base text-white hover:bg-white hover:text-ink dark:bg-ink dark:text-background">Plan our trip <ArrowUpRight /></LinkButton>
                <ExternalButton href={whatsappLink("Hi Through Vacations! We'd like to plan a trip for two.")} size="lg" variant="outline" className="h-12 border-2 border-ink bg-transparent px-7 text-base text-ink hover:bg-ink hover:text-white">WhatsApp us</ExternalButton>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
