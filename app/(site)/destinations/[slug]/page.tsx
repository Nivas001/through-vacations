import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowUpRight, CalendarDays, FileCheck2, Plane, Timer } from "lucide-react";
import { getDestinations } from "@/lib/data/packages";
import { monthName } from "@/lib/site";
import { PackageCard } from "@/components/packages/package-card";
import { LinkButton } from "@/components/brand/link-button";
import { SectionHeading } from "@/components/brand/section-heading";
import { Reveal } from "@/components/fx/reveal";

export async function generateStaticParams() {
  return (await getDestinations()).map((d) => ({ slug: d.slug }));
}
export async function generateMetadata({ params }: PageProps<"/destinations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = (await getDestinations()).find((x) => x.slug === slug);
  return d ? { title: d.name, description: d.packages[0].summary } : {};
}

export default async function DestinationPage({ params }: PageProps<"/destinations/[slug]">) {
  const { slug } = await params;
  const d = (await getDestinations()).find((x) => x.slug === slug);
  if (!d) notFound();
  const p = d.packages[0];
  const f = p.facts;
  const firstDay = p.itinerary[0];
  const facts = [
    { icon: Plane, k: "From Chennai", v: f ? `${f.fromChennai}` : "Confirmed in your quote", sub: f ? `Arrive at ${f.gateway} (${f.code})` : "" },
    { icon: CalendarDays, k: "Best months", v: p.bestMonths.map((m) => monthName(m).slice(0, 3)).join(", "), sub: "When the trip is at its best" },
    { icon: Timer, k: "Nights", v: f ? `${f.nights[0]} to ${f.nights[1]}` : `${p.nights}`, sub: "A comfortable range for this route" },
    { icon: FileCheck2, k: "Paperwork", v: f?.international ? "Passport needed" : "Photo ID", sub: f?.paperwork ?? "" },
  ];
  return (
    <>
      <section className="mx-2 sm:mx-4">
        <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-ink text-white" style={{ minHeight: "min(78svh, 680px)" }}>
          <Image src={p.image} alt={p.imageAlt} fill priority sizes="100vw" quality={85} className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />
          <div className="relative flex min-h-[inherit] flex-col justify-end p-6 sm:p-12">
            <p className="inline-flex w-fit rounded-full bg-sun px-3.5 py-1.5 text-[0.7rem] font-bold tracking-[0.18em] text-sun-foreground uppercase">{d.region}</p>
            <h1 className="serif mt-4 text-[3.2rem] leading-[0.95] sm:text-[7.5rem]">{d.name}</h1>
            <p className="mt-3 max-w-xl text-lg text-white/85">{p.summary}</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <ul className="-mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map(({ icon: Icon, k, v, sub }) => (
            <li key={k} className="card-lift relative z-10 rounded-[1.25rem] border bg-card p-5">
              <span className="grid size-10 place-items-center rounded-xl bg-secondary text-brand"><Icon className="size-5" /></span>
              <p className="mt-4 text-[0.65rem] font-bold tracking-[0.2em] text-muted-foreground uppercase">{k}</p>
              <p className="font-display text-xl leading-tight font-extrabold">{v}</p>
              {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
            </li>
          ))}
        </ul>

        {p.gallery.length > 0 && (
          <div className="mt-16 grid auto-rows-[200px] gap-3 sm:auto-rows-[230px] sm:grid-cols-3">
            {p.gallery.slice(0, 3).map((g, i) => (
              <Reveal key={g} delay={i * 80} className={i === 0 ? "sm:col-span-2 sm:row-span-2" : ""}>
                <div className="relative h-full min-h-[200px] overflow-hidden rounded-[1.5rem] bg-secondary">
                  <Image src={g} alt="" fill sizes="(min-width:640px) 40vw, 100vw" quality={85} className="object-cover" />
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {firstDay && (
          <section className="mt-20 grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading eyebrow="Day one" title={`How it *begins*`} />
            <div className="card-lift rounded-[1.5rem] border bg-card p-6 sm:p-8">
              <p className="serif text-3xl leading-none">{firstDay.title}</p>
              <p className="mt-4 text-muted-foreground">{firstDay.description}</p>
              {firstDay.tip && <p className="mt-4 rounded-xl bg-accent p-4 text-sm text-accent-foreground ring-1 ring-sun/60"><b>Planner&apos;s note.</b> {firstDay.tip}</p>}
            </div>
          </section>
        )}

        <section className="mt-24">
          <SectionHeading eyebrow="Journeys" title={`${d.name}, *planned*`} />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{d.packages.map((x) => <PackageCard key={x.id} pkg={x} />)}</div>
          <div className="mt-10 flex flex-wrap gap-3">
            <LinkButton href={`/trip-shaper?trip=${p.slug}`} size="lg" className="h-12 px-6">Shape this trip <ArrowUpRight /></LinkButton>
            <LinkButton href={`/plan?trip=${p.slug}`} variant="outline" size="lg" className="h-12 border-2 border-foreground px-6">Want something different in {d.name}?</LinkButton>
          </div>
        </section>
      </div>
    </>
  );
}
