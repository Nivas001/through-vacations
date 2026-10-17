import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart, BedDouble, Briefcase, GraduationCap, Plane, Route, Stamp, Gauge, CloudSun, FileCheck2 } from "lucide-react";
import { getPackage, getPackages } from "@/lib/data/packages";
import { IG, monthName, whatsappLink } from "@/lib/site";
import { stories } from "@/lib/mock/stories";
import { HeroSearch } from "@/components/home/hero-search";
import { HeroGate, type GateSlide } from "@/components/home/hero-gate";
import { EscapeFinder } from "@/components/home/escape-finder";
import { PackageCard } from "@/components/packages/package-card";
import { SectionHeading } from "@/components/brand/section-heading";
import { Wave } from "@/components/brand/wave";
import { ExternalButton, LinkButton } from "@/components/brand/link-button";
import { Reveal } from "@/components/fx/reveal";
import { Marquee } from "@/components/fx/marquee";

const steps = [
  { n: "01", title: "Pick or describe", body: "Browse a holiday you like, or tell us the trip you have in mind." },
  { n: "02", title: "Reserve your dates", body: "Choose dates and travellers. We hold your request while we confirm details." },
  { n: "03", title: "We tailor it", body: "Your planner refines stays, transfers and activities and sends a personal quote." },
  { n: "04", title: "Go through it", body: "Pay the team directly once you are happy, then travel with support on call." },
];

const services = [
  { icon: Route, label: "Itinerary planning" },
  { icon: BedDouble, label: "Hotel stays" },
  { icon: Plane, label: "Flights & transfers" },
  { icon: Stamp, label: "Visa & passport help" },
  { icon: Briefcase, label: "Corporate trips" },
  { icon: GraduationCap, label: "Student industrial visits" },
];

/** Hero slides: specific places, each backed by a published trip. */
const gate: { slug: string; place: string; image: string; alt: string }[] = [
  { slug: "phuket-krabi", place: "Phi Phi Islands", image: "/media/thailand-2.webp", alt: "Turquoise water between limestone cliffs at Maya Bay, Phi Phi" },
  { slug: "kashmir", place: "Dal Lake, Kashmir", image: "/media/kashmir.webp", alt: "Fishermen in boats on Dal Lake below snow-capped mountains" },
  { slug: "andaman", place: "Havelock Island", image: "/media/andaman.webp", alt: "Radhanagar Beach on Havelock Island" },
  { slug: "ladakh", place: "Nubra Valley", image: "/media/ladakh.webp", alt: "Camels crossing the Nubra Valley dunes" },
  { slug: "munnar-alleppey", place: "Alleppey backwaters", image: "/media/munnar-alleppey-2.webp", alt: "A Kerala houseboat on the backwaters" },
  { slug: "udaipur-jaipur", place: "Udaipur", image: "/media/udaipur-jaipur.webp", alt: "City Palace and Lake Pichola in Udaipur" },
  { slug: "maldives", place: "Maldives", image: "/media/maldives.webp", alt: "Water villas along a jetty in the Maldives" },
];

const featuredOrder = ["kashmir", "phuket-krabi", "maldives", "andaman", "munnar-alleppey", "bali"];

const ticker = ["Phi Phi", "Havelock", "Gulmarg", "Alleppey", "Nubra Valley", "Ubud", "Udaipur", "Ella", "Marina Bay", "Amritsar", "Pondicherry", "Maldives"];

export default async function HomePage() {
  const all = await getPackages();
  const destinations = [...new Set(all.map((p) => p.destination))];
  const india = all.filter((p) => p.region === "India").slice(0, 5);
  const intl = all.filter((p) => p.region === "International").slice(0, 5);

  const slides: GateSlide[] = (
    await Promise.all(
      gate.map(async (g) => {
        const p = await getPackage(g.slug);
        if (!p || !p.facts) return null;
        return {
          slug: g.slug,
          place: g.place,
          title: p.title,
          image: g.image,
          alt: g.alt,
          code: p.facts.code,
          nights: p.nights,
          flight: p.facts.fromChennai,
          months: p.bestMonths.slice(0, 3).map((m) => monthName(m).slice(0, 3)).join(", "),
        } satisfies GateSlide;
      }),
    )
  ).filter((x): x is GateSlide => x !== null);

  return (
    <>
      <div className="relative">
        <HeroGate slides={slides} />
        <div className="relative z-10 mx-auto -mt-16 max-w-5xl px-3 sm:-mt-12 sm:px-8">
          <HeroSearch destinations={destinations} />
        </div>
      </div>

      {/* Couples hook */}
      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="grid overflow-hidden rounded-[1.75rem] bg-[#070b24] text-white lg:grid-cols-[1fr_1.1fr]">
            <div className="flex flex-col justify-center p-7 sm:p-12">
              <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-rose-500 px-3.5 py-1.5 text-[0.7rem] font-bold tracking-[0.18em] text-white uppercase"><Heart className="size-3.5 fill-current" /> Couples and honeymoons</p>
              <h2 className="text-4xl leading-[0.92] font-extrabold uppercase sm:text-6xl">Two of you. <span className="serif-i font-extrabold text-sun">One trip.</span></h2>
              <p className="mt-5 max-w-md text-white/75">Romantic date ideas for Maldives, Bali, Kashmir and more, a five-question honeymoon match and little touches planned around your occasion.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <LinkButton href="/couples#quiz" variant="sun" size="lg" className="h-12 px-7 text-base">Find our match <ArrowUpRight /></LinkButton>
                <LinkButton href="/couples" variant="outline" size="lg" className="h-12 border-2 border-white bg-transparent px-6 text-base text-white hover:bg-white hover:text-ink">Date ideas</LinkButton>
              </div>
            </div>
            <div className="grid min-h-[320px] grid-cols-3 gap-2 p-2 sm:min-h-[440px]">
              {[["/media/maldives.webp", "Maldives"], ["/media/kashmir.webp", "Kashmir"], ["/media/bali.webp", "Bali"]].map(([src, name], i) => (
                <Link key={name} href="/couples" className={`group relative overflow-hidden rounded-[1.25rem] ${i === 1 ? "mt-8" : ""}`}>
                  <Image src={src} alt="" fill sizes="(min-width:1024px) 20vw, 33vw" quality={85} className="object-cover transition duration-700 group-hover:scale-110" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute inset-x-3 bottom-3 font-display text-lg leading-none font-extrabold text-white uppercase sm:text-2xl">{name}</span>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <div className="mt-24 overflow-x-clip py-6"><Marquee items={ticker} /></div>

      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <EscapeFinder />
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-28 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Featured holidays" title="Journeys we *love* planning" />
          <LinkButton href="/packages" variant="outline" className="h-11 border-2 border-foreground px-6">View all holidays <ArrowUpRight /></LinkButton>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredOrder.map((s) => all.find((p) => p.slug === s)).filter((p): p is NonNullable<typeof p> => !!p).map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 90}><PackageCard pkg={p} priority={i < 3} /></Reveal>
          ))}
        </div>
      </section>

      {/* Trip Shaper teaser */}
      <section className="mx-auto max-w-7xl px-4 pt-28 sm:px-6">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-[1.75rem] bg-primary p-8 text-white sm:p-14">
            <Wave className="opacity-[0.08]" />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-sun px-3.5 py-1.5 text-[0.7rem] font-bold tracking-[0.18em] text-sun-foreground uppercase">New · Trip Shaper</p>
                <h2 className="text-4xl leading-[0.95] font-extrabold uppercase sm:text-6xl">How much trip is <span className="serif-i font-extrabold text-sun">too much</span> trip?</h2>
                <p className="mt-5 max-w-lg text-white/80">Pick a place, a month and how many days you have. We show the effort the plan asks of you, whether the season is kind and what to sort before you go. No prices, just honest planning.</p>
                <LinkButton href="/trip-shaper" variant="sun" size="lg" className="mt-8 h-12 px-7 text-base">Shape my trip <ArrowUpRight /></LinkButton>
              </div>
              <ul className="grid gap-3">
                {[
                  { icon: Gauge, t: "Effort meter", d: "Flights, transfers and hotel changes, rated 1 to 5." },
                  { icon: CloudSun, t: "Season check", d: "Is your month great, shoulder or off-season?" },
                  { icon: FileCheck2, t: "Paperwork and packing", d: "What to sort and carry for that place." },
                ].map(({ icon: Icon, t, d }) => (
                  <li key={t} className="flex items-center gap-4 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-sun text-sun-foreground"><Icon className="size-6" /></span>
                    <span><span className="block font-bold">{t}</span><span className="text-sm text-white/75">{d}</span></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      {/* India / International */}
      <section className="mx-auto max-w-7xl px-4 pt-28 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          {[{ t: "Closer to *home*", e: "India", l: india }, { t: "Further *afield*", e: "International", l: intl }].map((g) => (
            <div key={g.e} className="min-w-0">
              <div className="flex items-end justify-between gap-4">
                <SectionHeading eyebrow={g.e} title={g.t} />
                <Link href={`/packages?region=${g.e}`} className="text-sm font-bold text-brand underline-offset-4 hover:underline">See all</Link>
              </div>
              <div className="grain relative mt-6 divide-y divide-white/15 overflow-hidden rounded-[1.75rem] bg-primary text-white">
                {g.l.map((p) => (
                  <Link key={p.id} href={`/packages/${p.slug}`} className="group relative flex items-center gap-4 p-3 transition hover:bg-white/10">
                    <Image src={p.image} alt="" width={120} height={120} sizes="96px" className="size-20 rounded-2xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-2xl leading-none font-extrabold uppercase">{p.destination}</p>
                      <p className="mt-1 truncate text-sm text-white/75"><span className="serif-i">{p.tagline}</span> · {p.durationLabel}</p>
                    </div>
                    <ArrowUpRight className="size-6 text-sun transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative mt-28 overflow-hidden bg-[#070b24] py-24 text-white">
        <Wave className="opacity-[0.06]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="How it works" title="From idea to *boarding pass*" align="center" className="[&_em]:text-sun [&>p]:bg-white/10 [&>p]:text-white" />
          <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <li key={s.n} className="rounded-3xl border border-white/15 bg-white/5 p-6 transition duration-300 hover:-translate-y-2 hover:border-sun hover:bg-white/10">
                <span className="text-outline font-display text-7xl leading-none font-extrabold text-sun italic">{s.n}</span>
                <h3 className="mt-5 text-2xl font-extrabold uppercase">{s.title}</h3>
                <p className="mt-2 text-sm text-white/70">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <SectionHeading eyebrow="What we arrange" title="Everything around the trip, *handled*" />
        <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {services.map(({ icon: Icon, label }) => (
            <li key={label} className="group card-lift flex flex-col items-start gap-4 rounded-2xl border bg-card p-5 transition hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-white">
              <span className="grid size-12 place-items-center rounded-xl bg-secondary text-brand transition group-hover:bg-sun group-hover:text-sun-foreground"><Icon className="size-6" /></span>
              <span className="text-sm font-bold">{label}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">Inclusions vary by package and are confirmed in your personal quote.</p>
      </section>

      {/* Journal */}
      <section className="mx-auto max-w-7xl px-4 pt-28 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Journal" title="The journey starts *before* you go" />
          <ExternalButton href={IG} variant="outline" className="h-11 border-2 border-foreground px-6">Follow @throughvacations <ArrowUpRight /></ExternalButton>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {stories.slice(0, 3).map((j) => (
            <Link key={j.slug} href={`/journal/${j.slug}`} className="group card-lift block rounded-[1.5rem] border bg-card p-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.1rem] bg-secondary">
                <Image src={j.image} alt="" fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="p-4">
                <p className="text-xs font-bold tracking-[0.2em] text-brand uppercase">{j.kicker}</p>
                <p className="mt-1 flex items-start justify-between gap-2 font-display text-2xl leading-tight font-extrabold">{j.title}<ArrowUpRight className="mt-1 size-5 shrink-0 text-brand" /></p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-28 max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-sun px-6 py-16 text-center text-sun-foreground sm:px-16 sm:py-24">
          <Wave className="opacity-[0.25] invert" />
          <div className="relative">
            <h2 className="mx-auto max-w-3xl text-5xl leading-[0.9] font-extrabold uppercase sm:text-7xl">Tell us where you <span className="serif-i font-extrabold">want to go.</span></h2>
            <p className="mx-auto mt-6 max-w-lg text-sun-foreground/80">A three-step form, a personal quote and a planner to shape the details.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <LinkButton href="/plan" size="lg" className="h-12 bg-ink px-7 text-base text-white hover:bg-white hover:text-ink dark:bg-ink dark:text-background">Plan my trip <ArrowUpRight /></LinkButton>
              <ExternalButton href={whatsappLink()} size="lg" variant="outline" className="h-12 border-2 border-ink bg-transparent px-7 text-base text-ink hover:bg-ink hover:text-white">WhatsApp us</ExternalButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
