"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { moods } from "@/lib/mock/packages";
import { cn } from "@/lib/utils";

export function EscapeFinder() {
  const [active, setActive] = useState(moods[0]);
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
      <div>
        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-3.5 py-1.5 text-[0.7rem] font-bold tracking-[0.18em] text-secondary-foreground uppercase"><span className="size-2 rounded-full bg-sun ring-2 ring-sun/40" />Pick your escape</p>
        <h2 className="text-4xl leading-[0.95] font-extrabold uppercase sm:text-6xl">What does your next holiday <em className="serif-i font-extrabold text-brand">feel like?</em></h2>
        <div role="tablist" aria-label="Holiday mood" className="mt-8 grid grid-cols-2 gap-2.5">
          {moods.map((m) => (
            <button
              key={m.id}
              role="tab"
              aria-selected={active.id === m.id}
              onClick={() => setActive(m)}
              className={cn(
                "rounded-2xl border-2 px-4 py-3.5 text-left text-sm font-bold transition",
                active.id === m.id
                  ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-card hover:border-primary",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <Link
        href={`/packages?style=${encodeURIComponent(active.styles[0])}`}
        className="group relative block aspect-[5/4] overflow-hidden rounded-3xl"
      >
        {moods.map((m) => (
          <Image
            key={m.id}
            src={m.image}
            alt=""
            fill
            sizes="(min-width:1024px) 50vw, 100vw"
            className={cn(
              "object-cover transition-opacity duration-700",
              m.id === active.id ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-white">
          <div>
            <p className="font-display text-4xl font-extrabold uppercase">{active.label}</p>
            <p className="mt-1 text-sm text-white/80">{active.blurb}</p>
          </div>
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-sun text-sun-foreground transition group-hover:scale-110">
            <ArrowUpRight />
          </span>
        </div>
      </Link>
    </div>
  );
}
