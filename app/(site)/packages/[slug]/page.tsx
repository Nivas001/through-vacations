import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, ChevronRight, Clock, MapPin, X } from "lucide-react";
import { ItineraryExplorer } from "@/components/packages/itinerary-explorer";
import { Reveal } from "@/components/fx/reveal";
import { getPackage, getPackages } from "@/lib/data/packages";
import { monthName } from "@/lib/site";
import { getRomance } from "@/lib/mock/romance";
import { Heart, Sunrise, Sun, Sunset, Moon } from "lucide-react";
import { BookingWidget } from "@/components/packages/booking-widget";
import { PriceTicket } from "@/components/packages/price-ticket";
import { PackageCard } from "@/components/packages/package-card";
import { SectionHeading } from "@/components/brand/section-heading";

export async function generateStaticParams() {
  return (await getPackages()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/packages/[slug]">): Promise<Metadata> {
  const pkg = await getPackage((await params).slug);
  return pkg ? { title: `${pkg.destination}: ${pkg.tagline}`, description: pkg.summary } : {};
}

export default async function PackagePage({ params }: PageProps<"/packages/[slug]">) {
  const pkg = await getPackage((await params).slug);
  if (!pkg) notFound();
  const rom = getRomance(pkg.slug);
  const whenIcon = { Morning: Sunrise, Afternoon: Sun, Sunset: Sunset, Night: Moon, "All day": Heart } as const;
  const similar = (await getPackages()).filter((p) => p.slug !== pkg.slug && (p.region === pkg.region || p.styles.some((s) => pkg.styles.includes(s)))).slice(0, 3);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/packages" className="hover:text-foreground">Holidays</Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground">{pkg.destination}</span>
        </nav>
      </div>

      <section className="mx-auto mt-4 max-w-7xl px-4 sm:px-6">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[1.75rem] sm:aspect-[21/9]">
          <Image src={pkg.image} alt={pkg.imageAlt} fill priority sizes="100vw" quality={85} className="object-cover transition duration-[2500ms] hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-sun px-3.5 py-1.5 text-[0.7rem] font-bold tracking-[0.18em] text-sun-foreground uppercase"><MapPin className="size-3.5" /> {pkg.destination} · {pkg.region}</p>
            <h1 className="mt-3 max-w-4xl text-5xl leading-[0.9] font-extrabold uppercase sm:text-7xl">{pkg.title}</h1>
            <p className="serif-i mt-2 text-2xl text-white/90 sm:text-4xl">{pkg.tagline}</p>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-10 grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0 space-y-16">
          <section>
            <ul className="flex flex-wrap gap-2.5 text-sm">
              <li className="flex items-center gap-1.5 rounded-full border bg-card px-4 py-2"><Clock className="size-4 text-brand" />{pkg.durationLabel}</li>
              {pkg.styles.map((s) => <li key={s} className="rounded-full bg-secondary px-4 py-2 text-secondary-foreground">{s}</li>)}
              <li className="rounded-full border bg-card px-4 py-2">Best: {pkg.bestMonths.map(monthName).map((m) => m.slice(0, 3)).join(", ")}</li>
            </ul>
            <p className="mt-6 text-xl leading-relaxed text-muted-foreground">{pkg.summary}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {pkg.highlights.map((h) => (
                <li key={h} className="card-lift flex items-center gap-3 rounded-2xl border bg-card p-4 font-medium">
                  <span className="grid size-8 place-items-center rounded-full bg-secondary text-brand"><Check className="size-4" /></span>
                  {h}
                </li>
              ))}
            </ul>
            {pkg.gallery.length > 0 && (
              <div className="mt-8 grid auto-rows-[170px] gap-3 sm:grid-cols-3 sm:auto-rows-[150px]">
                {pkg.gallery.slice(0, 3).map((g, i) => (
                  <div key={g} className={"relative overflow-hidden rounded-[1.25rem] bg-secondary " + (i === 0 ? "sm:col-span-2 sm:row-span-2" : "")}>
                    <Image src={g} alt="" fill sizes="(min-width:640px) 30vw, 100vw" quality={85} className="object-cover transition duration-700 hover:scale-105" />
                  </div>
                ))}
              </div>
            )}
            {pkg.facts && (
              <dl className="mt-8 grid gap-3 text-sm sm:grid-cols-3">
                <div className="card-lift rounded-2xl border bg-card p-4"><dt className="text-[0.65rem] font-bold tracking-[0.2em] text-muted-foreground uppercase">From Chennai</dt><dd className="mt-1 font-medium">{pkg.facts.fromChennai}</dd></div>
                <div className="card-lift rounded-2xl border bg-card p-4"><dt className="text-[0.65rem] font-bold tracking-[0.2em] text-muted-foreground uppercase">Arrive at</dt><dd className="mt-1 font-medium">{pkg.facts.gateway} ({pkg.facts.code})</dd></div>
                <div className="card-lift rounded-2xl border bg-card p-4"><dt className="text-[0.65rem] font-bold tracking-[0.2em] text-muted-foreground uppercase">Paperwork</dt><dd className="mt-1 font-medium">{pkg.facts.international ? "Passport needed" : "Photo ID"}</dd></div>
              </dl>
            )}
          </section>

          {rom && (
            <section>
              <SectionHeading eyebrow="For couples" title="A day for *two*">{rom.line}</SectionHeading>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {rom.dates.slice(0, 4).map((d) => {
                  const Icon = whenIcon[d.when];
                  return (
                    <li key={d.title} className="card-lift rounded-[1.25rem] border bg-card p-4">
                      <p className="flex items-center gap-2 text-[0.65rem] font-bold tracking-[0.2em] text-brand uppercase"><Icon className="size-4" /> {d.when}</p>
                      <p className="mt-1 font-display text-lg leading-tight font-extrabold uppercase">{d.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{d.text}</p>
                    </li>
                  );
                })}
              </ul>
              <Link href="/couples" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand underline-offset-4 hover:underline">More couples&apos; ideas and the honeymoon quiz <ArrowUpRight className="size-4" /></Link>
            </section>
          )}

          <section>
            <SectionHeading eyebrow="What's included" title="Your *package*" />
            <PriceTicket pkg={pkg} className="mt-8" />
            <details className="mt-6 text-sm text-muted-foreground">
              <summary className="cursor-pointer font-medium text-foreground">Not included</summary>
              <ul className="mt-3 space-y-2">
                {pkg.exclusions.map((x) => <li key={x} className="flex gap-2"><X className="mt-0.5 size-4 shrink-0" />{x}</li>)}
              </ul>
            </details>
          </section>

          <section>
            <SectionHeading eyebrow="Itinerary" title="How the days could *unfold*">A route built from our published plans. Scroll through it, or tap a pace to see only those days. Your real plan is confirmed in the quote.</SectionHeading>
            {pkg.itinerary.length ? (
              <>
              <div className="mt-8"><ItineraryExplorer days={pkg.itinerary} /></div>
              <Link href={`/trip-shaper?trip=${pkg.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand underline-offset-4 hover:underline">Fewer days than this? Shape the trip <ArrowUpRight className="size-4" /></Link>
              </>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed p-6 text-muted-foreground">
                The day-by-day plan is built around you. Share your dates and interests and your planner will send a personal itinerary with your quote.
              </div>
            )}
          </section>

          <p className="text-xs text-muted-foreground">
            {pkg.sourceUrl.includes("/p/") || pkg.sourceUrl.includes("/reel/") ? "Based on a published Through Vacations promotion. " : "Planned by Through Vacations. "}
            {(pkg.sourceUrl.includes("/p/") || pkg.sourceUrl.includes("/reel/")) && <a className="underline underline-offset-4" href={pkg.sourceUrl} target="_blank" rel="noreferrer">View on Instagram <ArrowUpRight className="inline size-3" /></a>}
          </p>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BookingWidget pkg={pkg} />
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="You might also like" title="More ways to *go*" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((p) => <PackageCard key={p.id} pkg={p} />)}
          </div>
        </section>
      )}
    </>
  );
}
