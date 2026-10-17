import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, Briefcase, GraduationCap, Heart, MapPin, Mountain, Sun, Users } from "lucide-react";
import { IG, about, siteDefaults, whatsappLink } from "@/lib/site";
import { getPackage } from "@/lib/data/packages";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ExternalButton, LinkButton } from "@/components/brand/link-button";
import { SectionHeading } from "@/components/brand/section-heading";
import { Reveal } from "@/components/fx/reveal";
import { SpotlightCard } from "@/components/fx/spotlight-card";
import { Carousel } from "@/components/fx/carousel";
import { Wave } from "@/components/brand/wave";
import { JourneyStepper } from "@/components/about/journey-stepper";

export const metadata: Metadata = { title: "About", description: "Through Vacations plans holidays across India and abroad from Pondicherry. How we think about trips, how we work and who we plan for." };

const beliefs = [
  { t: "Slow beats packed", d: "A good trip leaves gaps. We would rather give you a long dinner than a fourth viewpoint." },
  { t: "Honest about weather", d: "Seas, snow and roads decide a lot. We tell you which months suit what, and we rewrite a day rather than push through it." },
  { t: "Planned by people", d: "A planner you can message, from your first idea until you are home. Not a form that disappears." },
  { t: "Your trip, not a template", d: "The packages are starting points. We change the pace, the stays and the order to fit the people going." },
];

const forWho = [
  { icon: Heart, t: "Couples and honeymooners", d: "Quiet, romantic trips with the little touches you want.", img: "/media/maldives.webp", href: "/couples" },
  { icon: Users, t: "Families and friends", d: "Easy plans that every age enjoys, in places that work for groups.", img: "/media/singapore.webp", href: "/packages?style=Family" },
  { icon: Mountain, t: "Adventurers and groups", d: "Mountains, islands and road trips that need good logistics.", img: "/media/ladakh.webp", href: "/packages?style=Friends" },
  { icon: Briefcase, t: "Corporate trips", d: "Offsites and incentive travel, planned from stays to transfers.", img: "/media/udaipur-jaipur.webp", href: "/plan" },
  { icon: GraduationCap, t: "Student industrial visits", d: "Safe, organised group travel for institutions.", img: "/media/shimla-manali-amritsar.webp", href: "/plan" },
];

const choose = [
  { t: "Season", d: "Is the month actually good for this place?" },
  { t: "Pace", d: "How many early starts, hotel changes and long drives are we asking for?" },
  { t: "Getting there", d: "Flights, ferries, passes and road conditions, and how forgiving they are." },
  { t: "Paperwork", d: "Passport, permits and entry rules, checked for your dates." },
  { t: "Fit", d: "Who is travelling, and what do they actually enjoy?" },
];

const faqs = [
  { q: "Where are you based?", a: "In Pondicherry. We welcome travellers from Pondicherry, Chennai, across India and abroad." },
  { q: "Do you only sell fixed packages?", a: "No. The holidays on the site are starting points. We tailor the stays, pace and activities, and we also plan trips that are not listed." },
  { q: "Do you handle flights, visas and hotels?", a: "We arrange stays, transfers and sightseeing, and support flights, visas and passport work where needed. Inclusions vary by trip and are confirmed in your quote." },
  { q: "When do I pay?", a: "You get a personal quote first. Payment is arranged directly with the team once you are happy, not on the website." },
  { q: "Can I change my plan after I get the quote?", a: "Yes. Quotes are a conversation. Tell your planner what to change and they will revise it." },
  { q: "Do you plan student and corporate trips?", a: "Yes. We support student industrial visits and corporate travel. Share group size, dates and goals through the plan form." },
];

export default async function AboutPage() {
  const pondy = await getPackage("pondicherry");
  const pondySlides = [pondy?.image ?? "/media/pondicherry.webp", ...(pondy?.gallery ?? [])].map((src) => ({ src }));
  const hasStory = about.founder || about.founderStory;

  return (
    <>
      {/* hero */}
      <section className="mx-auto max-w-7xl px-4 pt-6 pb-4 sm:px-6 sm:pt-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-sun px-3.5 py-1.5 text-[0.7rem] font-bold tracking-[0.18em] text-sun-foreground uppercase">About us</p>
            <h1 className="text-5xl leading-[0.9] font-extrabold uppercase sm:text-7xl lg:text-[5.5rem]">
              We plan trips like we&apos;d plan <span className="serif-i font-extrabold text-brand">our own.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">Through Vacations designs holidays across India and abroad from a small base on the Coromandel coast. Slow where it should be, precise where it has to be, and always built around the people going.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/plan" size="lg" className="h-12 px-7">Plan a trip with us <ArrowUpRight /></LinkButton>
              <ExternalButton href={IG} variant="outline" size="lg" className="h-12 border-2 border-foreground px-6">See our trips on Instagram</ExternalButton>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="card-lift relative aspect-[4/5] overflow-hidden rounded-[2rem] border bg-secondary sm:aspect-[5/5]">
              <Image src="/media/travel-illustration.webp" alt="Decorative paper-cut style travel illustration" fill priority sizes="(min-width:1024px) 40vw, 90vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-5 -left-3 -rotate-6 rounded-full border-[3px] border-dashed border-primary bg-sun px-5 py-3 text-center text-sun-foreground shadow-lg sm:-left-6">
              <p className="text-[0.6rem] font-bold tracking-[0.3em] uppercase">Based in</p>
              <p className="font-display text-2xl leading-none font-extrabold uppercase">Pondicherry</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* beliefs */}
        <section className="mt-28">
          <SectionHeading eyebrow="What we believe" title="Four ideas behind *every trip*" />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {beliefs.map((b, i) => (
              <li key={b.t} className="list-none">
                <Reveal delay={i * 70} className="h-full">
                  <SpotlightCard className="card-lift h-full rounded-[1.5rem] border bg-card p-7">
                    <span className="font-display text-6xl leading-none font-extrabold text-brand italic">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-5 text-3xl leading-none font-extrabold uppercase">{b.t}</h3>
                    <p className="mt-3 text-muted-foreground">{b.d}</p>
                  </SpotlightCard>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        {/* stepper */}
        <section className="mt-28">
          <SectionHeading eyebrow="How we work" title="From first message to *back home*" />
          <div className="mt-10"><JourneyStepper /></div>
        </section>

        {/* choose */}
        <section className="mt-28 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading eyebrow="How we choose" title="Five questions before *any* itinerary">The same checks sit behind our Trip Shaper tool. Try it, and you will see what we see.</SectionHeading>
          <ol className="grid gap-3">
            {choose.map((c, i) => (
              <li key={c.t} className="card-lift flex items-center gap-4 rounded-2xl border bg-card p-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-sun font-display text-xl font-extrabold text-sun-foreground">{i + 1}</span>
                <span><span className="font-bold">{c.t}</span><span className="block text-sm text-muted-foreground">{c.d}</span></span>
              </li>
            ))}
            <li><LinkButton href="/trip-shaper" variant="outline" className="mt-2 h-11 border-2 border-foreground px-6">Try the Trip Shaper <ArrowUpRight /></LinkButton></li>
          </ol>
        </section>
      </div>

      {/* pondicherry */}
      <section className="grain relative mt-28 overflow-hidden bg-primary py-20 text-white">
        <Wave className="opacity-[0.08]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-sun px-3.5 py-1.5 text-[0.7rem] font-bold tracking-[0.18em] text-sun-foreground uppercase"><MapPin className="size-3.5" /> Our home</p>
            <h2 className="text-4xl leading-[0.92] font-extrabold uppercase sm:text-6xl">Why <span className="serif-i font-extrabold text-sun">Pondicherry?</span></h2>
            <div className="mt-6 space-y-4 text-lg text-white/85">
              <p>It is a town that teaches you how to travel: walk instead of drive, linger at the table, ask the way and enjoy the detour. French-quarter streets, a long seafront promenade and the quiet of nearby Auroville.</p>
              <p>It is also a handy base. Chennai is about three to four hours away by road, and many of our travellers start from there. We plan trips for Pondicherry and Chennai travellers first, and travellers across India and abroad too.</p>
            </div>
            <ul className="mt-6 flex flex-wrap gap-2 text-sm font-bold">
              {["French Quarter", "Promenade", "Auroville", "Bike days"].map((t) => <li key={t} className="rounded-full border border-white/35 bg-white/10 px-4 py-1.5">{t}</li>)}
            </ul>
          </div>
          <Carousel slides={pondySlides} className="overflow-hidden rounded-[1.75rem]" aspect="aspect-[4/3]" />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* who for */}
        <section className="mt-28">
          <SectionHeading eyebrow="Who we plan for" title="A trip for *everyone*" />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {forWho.map(({ icon: Icon, t, d, img, href }, i) => (
              <li key={t} className="list-none">
                <Reveal delay={i * 60} className="h-full">
                  <a href={href} className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-[1.5rem] text-white">
                    <Image src={img} alt="" fill sizes="(min-width:1024px) 20vw, 50vw" quality={85} className="object-cover transition duration-700 group-hover:scale-110" />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <span className="relative p-4">
                      <span className="grid size-9 place-items-center rounded-full bg-sun text-sun-foreground"><Icon className="size-4" /></span>
                      <span className="mt-3 block font-display text-xl leading-none font-extrabold uppercase">{t}</span>
                      <span className="mt-1 block text-xs text-white/80">{d}</span>
                    </span>
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        {/* people */}
        <section className="mt-28">
          <div className="card-lift grid overflow-hidden rounded-[1.75rem] border bg-card lg:grid-cols-[0.8fr_1.2fr]">
            <div className="grain relative flex min-h-[260px] items-end bg-[#070b24] p-8 text-white">
              <Sun className="absolute top-6 right-6 size-10 text-sun" />
              <p className="font-display text-4xl leading-[0.95] font-extrabold uppercase">{hasStory && about.founder ? about.founder : "The people behind your trip"}</p>
            </div>
            <div className="p-8 sm:p-12">
              {about.founderStory ? (
                <p className="text-xl leading-snug">{about.founderStory}</p>
              ) : (
                <>
                  <p className="text-xl leading-snug">Behind every itinerary is a planner who has thought about your dates, your pace and the weather. You can message them, ask silly questions and change your mind.</p>
                  <p className="mt-4 text-muted-foreground">Want to know who will plan your trip? Ask when you enquire, and we will introduce you before you commit to anything.</p>
                </>
              )}
              <ExternalButton href={whatsappLink("Hi Through Vacations! I'd like to talk to a planner.")} className="mt-6 h-12 px-6">Talk to a planner <ArrowUpRight /></ExternalButton>
            </div>
          </div>
        </section>

        {/* faq */}
        <section className="mt-28 grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <SectionHeading eyebrow="Questions" title="Things people *ask*" />
          <Accordion className="card-lift rounded-[1.5rem] border bg-card px-5">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`f${i}`}>
                <AccordionTrigger className="py-5 text-left text-base font-bold">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* find us */}
        <section className="mt-28 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Find us" title="Say *hello*" />
            <ul className="mt-8 space-y-3 text-lg">
              <li className="flex items-center gap-3"><MapPin className="size-5 text-brand" /> {about.address || siteDefaults.location}</li>
              <li><a href={`mailto:${siteDefaults.email}`} className="text-brand underline underline-offset-4">{siteDefaults.email}</a></li>
              <li><a href={`tel:${siteDefaults.phone.replace(/\s/g, "")}`} className="text-brand underline underline-offset-4">{siteDefaults.phone}</a></li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <ExternalButton href={whatsappLink()} size="lg" className="h-12 px-6">Chat on WhatsApp <ArrowUpRight /></ExternalButton>
              <ExternalButton href={IG} variant="outline" size="lg" className="h-12 border-2 border-foreground px-6">Instagram</ExternalButton>
            </div>
          </div>
          <div className="card-lift overflow-hidden rounded-[1.75rem] border bg-card">
            <iframe title="Pondicherry on the map" loading="lazy" className="h-[380px] w-full" src="https://www.openstreetmap.org/export/embed.html?bbox=79.78%2C11.88%2C79.88%2C11.97&layer=mapnik" />
          </div>
        </section>
      </div>
    </>
  );
}
