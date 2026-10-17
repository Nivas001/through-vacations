"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Moon, Sparkles, Sun, Sunrise, Sunset, Heart } from "lucide-react";
import { Carousel } from "@/components/fx/carousel";
import { LinkButton } from "@/components/brand/link-button";
import type { DateIdea, Romance } from "@/lib/mock/romance";
import { cn } from "@/lib/utils";

export type RomanceItem = Romance & { title: string; destination: string; image: string; gallery: string[]; nights: number; alt: string };

const whenIcon = { Morning: Sunrise, Afternoon: Sun, Sunset: Sunset, Night: Moon, "All day": Heart } as const;

export function RomanceExplorer({ items }: { items: RomanceItem[] }) {
  const [slug, setSlug] = useState(items[0].slug);
  const cur = items.find((i) => i.slug === slug)!;
  const slides = [cur.image, ...cur.gallery].map((src, k) => ({ src, alt: k === 0 ? cur.alt : "" }));

  return (
    <div>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Choose a destination">
        {items.map((i) => (
          <button key={i.slug} role="tab" aria-selected={i.slug === slug} type="button" onClick={() => setSlug(i.slug)} className={cn("flex shrink-0 items-center gap-2.5 rounded-full border-2 py-1.5 pr-5 pl-1.5 text-sm font-bold transition", i.slug === slug ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "bg-card hover:border-primary/60")}>
            <Image src={i.image} alt="" width={48} height={48} className="size-9 rounded-full object-cover" />
            {i.destination}
          </button>
        ))}
      </div>

      <div key={cur.slug} className="fade-up mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Carousel slides={slides} className="overflow-hidden rounded-[1.75rem] card-lift" aspect="aspect-[4/3] sm:aspect-[5/4]" />
          <p className="mt-5 font-display text-3xl leading-[1] font-extrabold sm:text-4xl">{cur.line}</p>
          <p className="mt-3 text-sm text-muted-foreground"><b className="text-foreground">Good to know.</b> {cur.honest}</p>
        </div>

        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-brand uppercase">Date ideas in {cur.destination}</p>
          <ol className="mt-4 space-y-3">
            {cur.dates.map((d, k) => <Idea key={d.title} idea={d} n={k + 1} />)}
          </ol>
          <div className="mt-6 rounded-[1.5rem] bg-accent p-5 text-accent-foreground ring-1 ring-sun/60">
            <p className="flex items-center gap-2 text-sm font-bold"><Sparkles className="size-4" /> Little touches we can arrange on request</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {cur.touches.map((t) => <li key={t} className="rounded-full bg-card px-3 py-1.5 text-xs font-medium text-foreground">{t}</li>)}
            </ul>
            <p className="mt-3 text-xs opacity-70">Availability and charges are confirmed in your personal quote.</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton href={`/plan?trip=${cur.slug}&occasion=honeymoon`} size="lg" className="h-12 px-6">Plan this for two <ArrowUpRight /></LinkButton>
            <LinkButton href={`/packages/${cur.slug}`} variant="outline" size="lg" className="h-12 border-2 border-foreground px-6">See the {cur.nights}-night route</LinkButton>
            <Link href={`/trip-shaper?trip=${cur.slug}`} className="inline-flex h-12 items-center text-sm font-bold text-brand underline-offset-4 hover:underline">Shape it first</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Idea({ idea, n }: { idea: DateIdea; n: number }) {
  const Icon = whenIcon[idea.when];
  return (
    <li className="card-lift flex gap-4 rounded-[1.25rem] border bg-card p-4 transition hover:-translate-y-0.5 hover:border-primary/50">
      <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-secondary text-brand"><Icon className="size-5" /><span className="absolute -top-1.5 -left-1.5 grid size-5 place-items-center rounded-full bg-sun text-[0.65rem] font-bold text-sun-foreground">{n}</span></span>
      <span>
        <span className="flex flex-wrap items-center gap-2"><span className="font-display text-lg leading-tight font-extrabold">{idea.title}</span><span className="rounded-full bg-muted px-2.5 py-0.5 text-[0.65rem] font-bold tracking-wider text-muted-foreground uppercase">{idea.when}</span></span>
        <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">{idea.text}</span>
      </span>
    </li>
  );
}
