import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart, BedDouble, Briefcase, GraduationCap, Plane, Route, Stamp, Gauge, CloudSun, FileCheck2 } from "lucide-react";
import { getPackage, getPackages } from "@/lib/data/packages";
import { branches, IG, monthName, siteDefaults, siteUrl } from "@/lib/site";
import { stories } from "@/lib/mock/stories";
import { HeroPostcards, type PostcardSlide } from "@/components/home/hero-postcards";
import { EscapeFinder } from "@/components/home/escape-finder";
import { PackageCard } from "@/components/packages/package-card";
import { SectionHeading } from "@/components/brand/section-heading";
import { Wave } from "@/components/brand/wave";
import { ExternalButton, LinkButton } from "@/components/brand/link-button";
import { Reveal } from "@/components/fx/reveal";
import { PhotoMarquee } from "@/components/home/photo-marquee";
import { RouteGlobe, type GlobeStop } from "@/components/home/route-globe";
import { FlightSteps } from "@/components/home/flight-steps";
import { StatsWaves } from "@/components/home/stats-waves";
import { BoardingPassCta } from "@/components/home/boarding-pass-cta";
import { geo } from "@/lib/mock/geo";
import { Offices } from "@/components/contact/offices";
import { RecentlyViewed } from "@/components/packages/recently-viewed";
import { OffersStrip } from "@/components/offers/offers";

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

export default async function HomePage() {
  const all = await getPackages();
  const destinations = [...new Set(all.map((p) => p.destination))];
  const stops: GlobeStop[] = all
    .filter((p) => p.facts && geo[p.slug])
    .map((p) => ({ slug: p.slug, title: p.title, code: p.facts!.code, region: p.region, flight: p.facts!.fromChennai, months: p.bestMonths.slice(0, 4).map((m) => monthName(m).slice(0, 3)).join(", "), location: geo[p.slug] }));
  // Counted from the published catalogue, never invented.
  const countries = new Set(all.filter((p) => p.region === "International").map((p) => (p.slug === "phuket-krabi" || p.slug === "bangkok-pattaya" ? "Thailand" : p.destination))).size + 1;
  const stats = [
    { value: all.length, label: "Holidays ready to tailor" },
    { value: countries, label: "Countries, India included" },
    { value: all.filter((p) => p.region === "India").length, label: "Indian getaways" },
    { value: 2, label: "Offices, Pondicherry and Chennai" },
  ];

  const slides: PostcardSlide[] = (
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
        } satisfies PostcardSlide;
      }),
    )
  ).filter((x): x is PostcardSlide => x !== null);

  // Structured data with only facts we can state: name, contact, and the two office cities.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Through Vacations",
    url: siteUrl,
    logo: `${siteUrl}/icons/icon-512.png`,
    email: siteDefaults.email,
    telephone: siteDefaults.phone.replace(/\s/g, ""),
    sameAs: [IG],
    areaServed: ["India", "Worldwide"],
    department: branches.map((b) => ({
      "@type": "TravelAgency",
      name: `Through Vacations ${b.name}`,
      telephone: b.phone.replace(/\s/g, ""),
      address: { "@type": "PostalAddress", addressLocality: b.city, ...(b.address && { streetAddress: b.address }), addressCountry: "IN" },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <HeroPostcards slides={slides} destinations={destinations} />

      {/* Couples hook */}
      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="grid overflow-hidden rounded-[1.75rem] bg-[#070b24] text-white lg:grid-cols-[1fr_1.1fr]">
            <div className="flex flex-col justify-center p-7 sm:p-12">
              <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-rose-500 px-3.5 py-1.5 text-[0.7rem] font-bold tracking-[0.18em] text-white uppercase"><Heart className="size-3.5 fill-current" /> Couples and honeymoons</p>
              <h2 className="text-4xl leading-[0.96] font-extrabold sm:text-6xl">Two of you. <span className="accent-word text-sun">One trip.</span></h2>
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
                  <span className="absolute inset-x-2 bottom-3 font-display text-base leading-none font-extrabold text-white min-[400px]:inset-x-3 min-[400px]:text-lg sm:text-2xl">{name}</span>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <OffersStrip />

      <PhotoMarquee packages={all} />

      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <EscapeFinder />
      </section>

      <RecentlyViewed className="mx-auto max-w-7xl px-4 pt-20 sm:px-6" />

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
                <h2 className="text-4xl leading-[1] font-extrabold sm:text-6xl">How much trip is <span className="accent-word text-sun">too much</span> trip?</h2>
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

      <RouteGlobe stops={stops} />

      <FlightSteps />

      <StatsWaves stats={stats} />

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

      {/* Offices */}
      <section className="mx-auto max-w-7xl px-4 pt-28 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Visit us" title="Two offices, *one* team">Plan over WhatsApp from anywhere, or sit down with a planner in Pondicherry or Chennai.</SectionHeading>
          <LinkButton href="/contact" variant="outline" className="h-11 border-2 border-foreground px-6">Contact & offices <ArrowUpRight /></LinkButton>
        </div>
        <Offices compact className="mt-10" />
      </section>

      <BoardingPassCta />
    </>
  );
}
