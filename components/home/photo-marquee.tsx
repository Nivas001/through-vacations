import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { TravelPackage } from "@/lib/types";

type Tile = { src: string; title: string; slug: string };

/** Tilted, drifting columns of destination photos (3D marquee). Pure CSS motion; pauses on hover. */
export function PhotoMarquee({ packages }: { packages: TravelPackage[] }) {
  const tiles: Tile[] = packages.flatMap((p) => [p.image, ...p.gallery].map((src) => ({ src, title: p.title, slug: p.slug })));
  const cols = 5;
  const columns = Array.from({ length: cols }, (_, c) => tiles.filter((_, i) => i % cols === c).slice(0, 6));

  return (
    <section className="relative mt-24 overflow-hidden bg-[#070b24] py-10 text-white sm:py-0" aria-label="Destinations in pictures">
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:min-h-[640px] lg:grid-cols-[0.8fr_1.2fr]">
        <div className="relative z-10 py-6 lg:py-20">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-sun px-3.5 py-1.5 text-[0.7rem] font-bold tracking-[0.18em] text-sun-foreground uppercase">Your next view</p>
          <h2 className="text-4xl leading-[0.98] font-extrabold sm:text-6xl">Somewhere out there, <span className="accent-word text-sun">a window seat</span> is waiting.</h2>
          <p className="mt-5 max-w-md text-white/75">Turquoise lagoons, misty tea hills, desert skylines and old palace towns. Tap a photo to see the trip behind it.</p>
          <Link href="/destinations" className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-[#070b24] transition hover:bg-sun">See every destination <ArrowUpRight className="size-4" /></Link>
        </div>

        <div className="marquee-3d relative h-[420px] [perspective:1200px] sm:h-[520px] lg:h-[640px]">
          <div className="absolute inset-[-25%_-20%] grid grid-cols-5 gap-3 [transform:rotateX(28deg)_rotateZ(-18deg)_skewX(8deg)] [transform-style:preserve-3d] sm:gap-4">
            {columns.map((col, c) => (
              <div key={c} className="overflow-hidden">
                <ul className={c % 2 ? "marquee-down" : "marquee-up"} style={{ ["--dur" as string]: `${38 + c * 6}s` }}>
                  {[...col, ...col].map((t, i) => (
                    <li key={`${t.src}-${i}`} className="pb-3 sm:pb-4" aria-hidden={i >= col.length}>
                      <Link href={`/packages/${t.slug}`} tabIndex={i >= col.length ? -1 : undefined} className="group relative block aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-white/10">
                        <Image src={t.src} alt="" fill sizes="(min-width:1024px) 14vw, 30vw" className="object-cover transition duration-500 group-hover:scale-110" />
                        <span className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80 transition group-hover:opacity-100" />
                        <span className="absolute inset-x-2 bottom-2 truncate text-[0.7rem] font-bold sm:text-xs">{t.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {/* fade the edges into the section */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,#070b24_0%,transparent_15%,transparent_85%,#070b24_100%)]" />
        </div>
      </div>
      {/* section-wide fades: solid behind the text on large screens, soft at the right edge */}
      <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,#070b24_0%,#070b24_32%,rgb(7_11_36/.7)_44%,transparent_58%,transparent_90%,#070b24_100%)] lg:block" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#070b24_0%,transparent_12%,transparent_88%,#070b24_100%)] lg:hidden" />
    </section>
  );
}
