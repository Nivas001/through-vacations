"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Story, StoryCategory } from "@/lib/mock/stories";
import { cn } from "@/lib/utils";

const cats: (StoryCategory | "All")[] = ["All", "Islands & beaches", "Mountains & hills", "Cities & culture"];

export function JournalList({ stories }: { stories: Story[] }) {
  const [cat, setCat] = useState<(typeof cats)[number]>("All");
  const list = stories.filter((s) => cat === "All" || s.category === cat);
  const [lead, ...rest] = list;
  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Story category">
        {cats.map((c) => (
          <button key={c} role="tab" aria-selected={cat === c} type="button" onClick={() => setCat(c)} className={cn("rounded-full border-2 px-4 py-2 text-sm font-bold transition", cat === c ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary/60")}>{c}</button>
        ))}
      </div>

      {lead && (
        <Link key={lead.slug} href={`/journal/${lead.slug}`} className="group mt-8 grid overflow-hidden rounded-[1.75rem] bg-[#070b24] text-white lg:grid-cols-[1.3fr_1fr]">
          <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[420px]">
            <Image src={lead.image} alt="" fill priority sizes="(min-width:1024px) 60vw, 100vw" quality={85} className="object-cover transition duration-700 group-hover:scale-105" />
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-12">
            <p className="text-xs font-bold tracking-[0.2em] text-sun uppercase">Latest · {lead.kicker} · {lead.read}</p>
            <h2 className="serif mt-4 text-3xl leading-[1.05] uppercase sm:text-5xl">{lead.title}</h2>
            <p className="mt-5 line-clamp-3 text-white/75">{lead.body[0]}</p>
            <span className="mt-7 inline-flex items-center gap-1.5 text-sm font-bold text-sun">Read the story <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
          </div>
        </Link>
      )}

      <div className="mt-10 grid gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((s) => (
          <Link key={s.slug} href={`/journal/${s.slug}`} className="group card-lift block rounded-[1.5rem] border bg-card p-2 transition hover:-translate-y-1 hover:border-primary/60">
            <div className="relative aspect-[5/4] overflow-hidden rounded-[1.1rem] bg-secondary">
              <Image src={s.image} alt="" fill sizes="(min-width:1024px) 33vw, 50vw" quality={85} className="object-cover transition duration-700 group-hover:scale-105" />
              <span className="absolute top-3 left-3 rounded-full bg-sun px-3 py-1 text-[0.65rem] font-bold tracking-wider text-sun-foreground uppercase">{s.category}</span>
            </div>
            <div className="p-4">
              <p className="text-xs font-bold tracking-[0.2em] text-brand uppercase">{s.kicker} · {s.read}</p>
              <h3 className="serif mt-2 flex items-start justify-between gap-3 text-2xl leading-[1.08]">{s.title}<ArrowUpRight className="mt-1 size-5 shrink-0 text-brand" /></h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{s.body[0]}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
