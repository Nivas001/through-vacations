import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock } from "lucide-react";
import { getStory, stories } from "@/lib/mock/stories";
import { getPackage } from "@/lib/data/packages";
import { LinkButton } from "@/components/brand/link-button";
import { Reveal } from "@/components/fx/reveal";
import { ReadingProgress } from "@/components/journal/reading-progress";
import { Carousel } from "@/components/fx/carousel";

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const s = getStory((await params).slug);
  return s ? { title: s.title, description: s.body[0] } : {};
}

export default async function StoryPage({ params }: PageProps<"/journal/[slug]">) {
  const s = getStory((await params).slug);
  if (!s) notFound();
  const pkg = await getPackage(s.packageSlug);
  const i = stories.findIndex((x) => x.slug === s.slug);
  const prev = stories[(i - 1 + stories.length) % stories.length];
  const next = stories[(i + 1) % stories.length];
  return (
    <article>
      <ReadingProgress />
      <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6">
        <Link href="/journal" className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Journal</Link>
        <p className="mt-8 flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-brand uppercase">{s.kicker}<span className="text-muted-foreground">·</span><Clock className="size-3.5" />{s.read}</p>
        <h1 className="serif mt-3 text-4xl leading-[1.02] uppercase sm:text-6xl">{s.title}</h1>
      </div>
      <div className="mx-auto mt-10 max-w-6xl px-4 sm:px-6">
        <Carousel
          priority
          className="overflow-hidden rounded-[1.75rem] card-lift"
          aspect="aspect-[4/3] sm:aspect-[16/8]"
          slides={[s.image, ...(pkg?.gallery ?? [])].map((src, k) => ({ src, alt: k === 0 ? pkg?.imageAlt : "", caption: s.captions?.[k] }))}
        />
        <p className="mt-3 text-center text-xs text-muted-foreground">Swipe or drag to see more photos from this route.</p>
      </div>
      <div className="mx-auto mt-14 grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_300px]">
        <div className="max-w-2xl space-y-6 text-lg leading-relaxed">
          {s.body.map((p, k) =>
            p.startsWith("## ") ? (
              <Reveal key={k}><h2 className="pt-8 text-3xl font-extrabold uppercase">{p.slice(3)}</h2></Reveal>
            ) : p.startsWith("> ") ? (
              <Reveal key={k}><blockquote className="serif-i border-l-4 border-sun pl-6 text-3xl leading-tight font-bold text-brand">{p.slice(2)}</blockquote></Reveal>
            ) : (
              <Reveal key={k}><p className={k === 0 ? "drop-cap text-xl leading-snug text-foreground" : "text-muted-foreground"}>{p}</p></Reveal>
            ),
          )}
          <p className="border-t pt-6 text-xs text-muted-foreground">
            Written from the itinerary we publish, not a customer review. Details are confirmed in your quote.{" "}
            {(s.sourceUrl.includes("/p/") || s.sourceUrl.includes("/reel/")) && <a className="underline underline-offset-4" href={s.sourceUrl} target="_blank" rel="noreferrer">Original on Instagram <ArrowUpRight className="inline size-3" /></a>}
          </p>
        </div>
        {pkg && (
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="card-lift rounded-[1.5rem] border bg-card p-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.1rem]">
                <Image src={pkg.image} alt="" fill sizes="300px" className="object-cover" />
              </div>
              <div className="p-4">
                <p className="text-[0.65rem] font-bold tracking-[0.2em] text-brand uppercase">This trip</p>
                <p className="mt-1 font-display text-2xl leading-tight font-extrabold uppercase">{pkg.title}</p>
                <p className="serif-i text-lg text-muted-foreground">{pkg.tagline} · {pkg.durationLabel}</p>
                <LinkButton href={`/packages/${pkg.slug}`} className="mt-4 h-11 w-full">See the day-by-day plan <ArrowUpRight /></LinkButton>
                <LinkButton href={`/trip-shaper?trip=${pkg.slug}`} variant="outline" className="mt-2 h-11 w-full border-2">Shape this trip</LinkButton>
              </div>
            </div>
          </aside>
        )}
      </div>
      <nav aria-label="More stories" className="mx-auto mt-24 grid max-w-6xl gap-4 px-4 sm:grid-cols-2 sm:px-6">
        {[{ s: prev, dir: "Previous", Icon: ArrowLeft }, { s: next, dir: "Next", Icon: ArrowRight }].map(({ s: x, dir, Icon }) => (
          <Link key={dir} href={`/journal/${x.slug}`} className="group card-lift flex items-center gap-4 rounded-[1.5rem] border bg-card p-3 transition hover:border-primary">
            <span className="relative size-24 shrink-0 overflow-hidden rounded-2xl"><Image src={x.image} alt="" fill sizes="96px" className="object-cover" /></span>
            <span className="min-w-0 flex-1">
              <span className="text-[0.65rem] font-bold tracking-[0.2em] text-muted-foreground uppercase">{dir}</span>
              <span className="serif block truncate text-xl leading-tight">{x.title}</span>
            </span>
            <Icon className="size-5 text-brand" />
          </Link>
        ))}
      </nav>
    </article>
  );
}
