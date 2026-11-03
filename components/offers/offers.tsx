"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, CalendarClock, Sparkles, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDb, useHydrated } from "@/lib/data/store";
import { packages as catalogue } from "@/lib/mock/packages";
import { formatINR, monthName } from "@/lib/site";
import type { Offer, TravelPackage } from "@/lib/types";
import { cn } from "@/lib/utils";

const today = () => new Date().toISOString().slice(0, 10);

/** Offers that are switched on, not expired, and point at a published holiday. */
export function useLiveOffers() {
  const db = useDb();
  const hydrated = useHydrated();
  const list = (db.packages ?? catalogue).filter((p) => p.published);
  const [day] = useState(today);
  const offers = db.offers
    .filter((o) => o.active && (!o.validUntil || o.validUntil >= day))
    .map((o) => ({ o, p: list.find((p) => p.slug === o.packageSlug) }))
    .filter((x): x is { o: Offer; p: TravelPackage } => !!x.p);
  return { offers, hydrated };
}

function daysLeft(iso: string) {
  return Math.ceil((new Date(iso).getTime() - new Date(today()).getTime()) / 864e5);
}

export function OfferCard({ o, p, compact }: { o: Offer; p: TravelPackage; compact?: boolean }) {
  const left = o.validUntil ? daysLeft(o.validUntil) : null;
  return (
    <article className="group card-lift flex min-w-0 flex-col overflow-hidden rounded-[1.5rem] border bg-card">
      <Link href={`/packages/${p.slug}`} className={cn("relative block overflow-hidden", compact ? "aspect-[16/9]" : "aspect-[4/3]")}>
        <Image src={p.image} alt={p.imageAlt} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
        <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-sun px-3 py-1 text-[0.7rem] font-bold tracking-wide text-sun-foreground uppercase"><Tag className="size-3.5" />{o.badge || "Offer"}</span>
        {left !== null && left <= 14 && <span className="absolute top-3 right-3 rounded-full bg-rose-500 px-2.5 py-1 text-[0.7rem] font-bold text-white">{left <= 1 ? "Last day" : `${left} days left`}</span>}
        <span className="absolute bottom-3 left-4 text-sm font-semibold text-white">{p.durationLabel} · {p.destination}</span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-2xl leading-tight font-extrabold">{o.title}</h3>
        {!compact && <p className="mt-2 text-sm text-muted-foreground">{o.description}</p>}
        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-3 border-t-2 border-dashed pt-4">
            <div>
              <p className="text-xs text-muted-foreground">From, per person</p>
              <p className="font-display text-3xl font-extrabold text-brand">{o.price ? formatINR(o.price) : "On request"}{o.was && o.price && o.was > o.price ? <span className="ml-2 align-middle text-base font-semibold text-muted-foreground line-through">{formatINR(o.was)}</span> : null}</p>
            </div>
            <Link href={`/plan?trip=${p.slug}`} className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground transition hover:bg-sun hover:text-sun-foreground">Claim <ArrowUpRight className="size-4" /></Link>
          </div>
          {o.validUntil && <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarClock className="size-3.5" /> Valid until {new Date(o.validUntil).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>}
        </div>
      </div>
    </article>
  );
}

export function OffersGrid() {
  const { offers, hydrated } = useLiveOffers();
  if (!hydrated) return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-[28rem] rounded-[1.5rem]" />)}</div>;
  if (!offers.length)
    return (
      <div className="rounded-[1.5rem] border border-dashed bg-card p-10 text-center">
        <Sparkles className="mx-auto size-8 text-brand" />
        <p className="mt-3 text-xl font-extrabold">New offers are on the way</p>
        <p className="mt-1 text-sm text-muted-foreground">Subscribe at the bottom of the page and we will send them first.</p>
      </div>
    );
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {offers.map(({ o, p }) => <OfferCard key={o.id} o={o} p={p} />)}
      <Link href="/plan" className="group grain relative flex min-h-80 flex-col justify-between overflow-hidden rounded-[1.5rem] bg-primary p-6 text-white transition hover:-translate-y-1">
        <Sparkles className="size-8 text-sun" />
        <div>
          <p className="font-display text-3xl leading-tight font-extrabold">Your own deal</p>
          <p className="mt-2 text-sm text-white/80">Tell us where, when and your budget per person. We find the best value dates and stays for you.</p>
          <span className="mt-5 inline-flex h-10 items-center gap-1.5 rounded-full bg-sun px-5 text-sm font-bold text-sun-foreground transition group-hover:bg-white">Get a custom quote <ArrowUpRight className="size-4" /></span>
        </div>
      </Link>
    </div>
  );
}

/** The three months ahead, each with the holidays at their best then. */
export function SeasonalPicks() {
  const db = useDb();
  const hydrated = useHydrated();
  const [month] = useState(() => new Date().getMonth() + 1);
  if (!hydrated) return <Skeleton className="h-72 rounded-[1.5rem]" />;
  const list = (db.packages ?? catalogue).filter((p) => p.published);
  const months = [0, 1, 2].map((i) => ((month - 1 + i) % 12) + 1);
  // Each month leads with places not already shown for an earlier month, so the three lists differ.
  const shown = new Set<string>();
  const picksFor = months.map((m) => {
    const fit = list.filter((p) => p.bestMonths.includes(m));
    const picks = [...fit.filter((p) => !shown.has(p.slug)), ...fit.filter((p) => shown.has(p.slug))].slice(0, 4);
    picks.forEach((p) => shown.add(p.slug));
    return picks;
  });
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      {months.map((m, i) => {
        const picks = picksFor[i];
        return (
          <div key={m} className={cn("rounded-[1.5rem] p-5 sm:p-6", i === 0 ? "bg-primary text-white" : "border bg-card")}>
            <p className={cn("text-xs font-bold tracking-[0.2em] uppercase", i === 0 ? "text-sun" : "text-brand")}>{i === 0 ? "This month" : i === 1 ? "Next month" : "Coming up"}</p>
            <p className="mt-1 font-display text-3xl font-extrabold">{monthName(m)}</p>
            <ul className="mt-4 space-y-2">
              {picks.map((p) => (
                <li key={p.slug}>
                  <Link href={`/packages/${p.slug}`} className={cn("flex items-center gap-3 rounded-xl p-1.5 pr-2 transition", i === 0 ? "hover:bg-white/10" : "hover:bg-secondary")}>
                    <Image src={p.image} alt="" width={56} height={56} className="size-12 rounded-lg object-cover" />
                    <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{p.title}</span><span className={cn("block text-xs", i === 0 ? "text-white/70" : "text-muted-foreground")}>{p.durationLabel}</span></span>
                    <ArrowUpRight className={cn("size-4 shrink-0", i === 0 ? "text-sun" : "text-brand")} />
                  </Link>
                </li>
              ))}
              {!picks.length && <li className="text-sm opacity-70">Ask us for ideas for this month.</li>}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/** Compact strip for the homepage; hidden when there are no live offers. */
export function OffersStrip() {
  const { offers, hydrated } = useLiveOffers();
  if (!hydrated || !offers.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6" aria-label="Current offers">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-sun px-3.5 py-1.5 text-[0.7rem] font-bold tracking-[0.18em] text-sun-foreground uppercase"><Tag className="size-3.5" /> Offers</p>
          <h2 className="text-4xl leading-[1] font-extrabold sm:text-6xl">Deals <span className="accent-word text-brand">worth</span> packing for</h2>
        </div>
        <Link href="/offers" className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-foreground px-6 text-sm font-bold transition hover:bg-foreground hover:text-background">All offers <ArrowUpRight className="size-4" /></Link>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {offers.slice(0, 3).map(({ o, p }) => <OfferCard key={o.id} o={o} p={p} compact />)}
      </div>
    </section>
  );
}
