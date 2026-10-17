import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getDestinations } from "@/lib/data/packages";
import { ideaDestinations } from "@/lib/mock/packages";
import { monthName } from "@/lib/site";
import { PageIntro } from "@/components/layout/page-intro";
import { SectionHeading } from "@/components/brand/section-heading";
import { DepartureBoard, type BoardRow } from "@/components/destinations/departure-board";
import { Reveal } from "@/components/fx/reveal";

export const metadata: Metadata = { title: "Destinations" };

export default async function DestinationsPage() {
  const dests = await getDestinations();
  const rows: BoardRow[] = dests.map((d) => {
    const p = d.packages[0];
    return {
      slug: d.slug,
      name: d.name,
      region: d.region,
      code: p.facts?.code ?? d.name.slice(0, 3).toUpperCase(),
      months: p.bestMonths.slice(0, 4).map((m) => monthName(m).slice(0, 3)).join(" "),
      flight: p.facts?.fromChennai ?? "Confirmed in your quote",
      trips: d.packages.length,
      image: p.image,
      tagline: p.tagline,
    };
  });
  const bento = dests.slice(0, 7);
  const span = ["sm:col-span-2 sm:row-span-2", "", "", "", "sm:col-span-2", "", ""];
  return (
    <>
      <PageIntro eyebrow="Destinations" title="Places we plan, and places we *could*">
        Pick a row to see where it leads. Every place here has a published route; anywhere else, just ask.
      </PageIntro>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <DepartureBoard rows={rows} />

        <section className="mt-28">
          <SectionHeading eyebrow="In pictures" title="A few *views* to start with" />
          <div className="mt-10 grid auto-rows-[200px] gap-3 sm:grid-cols-4 sm:auto-rows-[220px]">
            {bento.map((d, i) => (
              <Reveal key={d.slug} delay={i * 60} className={span[i]}>
                <Link href={`/destinations/${d.slug}`} className="group relative block h-full overflow-hidden rounded-[1.5rem] bg-secondary">
                  <Image src={d.image} alt="" fill sizes="(min-width:640px) 25vw, 100vw" quality={85} className="object-cover transition duration-700 group-hover:scale-105" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute inset-x-5 bottom-4 flex items-end justify-between text-white">
                    <span className="serif text-3xl leading-none uppercase sm:text-4xl">{d.name}</span>
                    <ArrowUpRight className="mb-1 size-5 opacity-0 transition group-hover:opacity-100" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-28">
          <SectionHeading eyebrow="Ask us" title="More places we have *planned* for">
            These do not have a published package yet. Request a quote and we will shape one.
          </SectionHeading>
          <ul className="mt-8 flex flex-wrap gap-3">
            {ideaDestinations.map((n) => (
              <li key={n}><Link href={`/plan?trip=${encodeURIComponent(n)}`} className="inline-block rounded-full border-2 bg-card px-5 py-2.5 text-sm font-medium transition hover:border-primary hover:bg-primary hover:text-primary-foreground">{n}</Link></li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
