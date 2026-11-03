"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowUpRight, MapPin, Plane } from "lucide-react";

export type FlyPhoto = { src: string; title: string; slug: string };

const GAP = 900; // depth between photos, px
const FADE_IN = -5600; // a photo starts to appear this far ahead of the camera
const PASS = 650; // and is gone once it is this far behind it

/** Pinned 3D scene: scrolling flies the camera forward through destination photos while the story plays out. */
export function Flythrough({ photos, holidays, countries }: { photos: FlyPhoto[]; holidays: number; countries: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const depth = photos.length * GAP + 1400;
  const worldZ = useTransform(scrollYProgress, [0, 1], [0, depth]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const chapters = [
    { k: "Our story", icon: MapPin, t: "It started on the Coromandel coast.", d: "Through Vacations began in Pondicherry, planning trips the way we would plan our own." },
    { k: "Two offices", icon: MapPin, t: "Now from Chennai too.", d: "A second desk in Chennai, so more travellers can sit down with a planner." },
    { k: "Where we go", icon: Plane, t: `${holidays} holidays. ${countries} countries.`, d: "Andaman beaches, Kashmir lakes, Bali rice terraces and the Dubai skyline, all shaped around you." },
    { k: "Next stop", icon: Plane, t: "Your trip is next.", d: "Tell us where you are dreaming of. We will plan the rest.", cta: true },
  ];

  if (reduce) return <StaticStory chapters={chapters} photos={photos} />;

  return (
    <section ref={ref} className="relative mt-24 h-[520vh] bg-[#050817]" aria-label="Our story">
      <div className="sticky top-0 h-dvh overflow-hidden">
        {/* night sky */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,#16246b_0%,#070b24_55%,#03040d_100%)]" />
        <div aria-hidden className="absolute inset-0 opacity-70 [background-image:radial-gradient(1px_1px_at_10%_20%,#fff_50%,transparent),radial-gradient(1px_1px_at_80%_30%,#fff_50%,transparent),radial-gradient(1.5px_1.5px_at_30%_70%,#ffd23f_50%,transparent),radial-gradient(1px_1px_at_60%_85%,#fff_50%,transparent),radial-gradient(1px_1px_at_90%_60%,#fff_50%,transparent),radial-gradient(1px_1px_at_45%_15%,#fff_50%,transparent),radial-gradient(1.5px_1.5px_at_70%_50%,#c7d4ff_50%,transparent),radial-gradient(1px_1px_at_20%_45%,#fff_50%,transparent)]" />

        {/* 3D world */}
        <div className="absolute inset-0 [perspective:1000px] [perspective-origin:50%_45%]">
          <motion.div className="absolute inset-0 [transform-style:preserve-3d]" style={{ z: worldZ }}>
            {photos.map((p, i) => <PhotoCard key={p.src} p={p} i={i} depth={depth} progress={scrollYProgress} />)}
          </motion.div>
        </div>

        {/* vignette keeps the story readable */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(3_4_13/.85)_0%,rgb(3_4_13/.55)_30%,transparent_62%)]" />

        {/* chapters */}
        <div className="absolute inset-0 grid place-items-center px-6">
          {chapters.map((c, i) => <Chapter key={c.k} c={c} i={i} n={chapters.length} progress={scrollYProgress} />)}
        </div>

        {/* progress */}
        <div className="absolute bottom-8 left-1/2 flex w-[min(80vw,420px)] -translate-x-1/2 items-center gap-3 text-[0.65rem] font-bold tracking-[0.2em] text-white/60 uppercase">
          <span>PNY</span>
          <div className="relative h-0.5 flex-1 rounded-full bg-white/15">
            <motion.div className="absolute inset-y-0 left-0 rounded-full bg-sun" style={{ width: bar }} />
            <motion.div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-sun" style={{ left: bar }}><Plane className="size-4 rotate-45" /></motion.div>
          </div>
          <span>You</span>
        </div>
      </div>
    </section>
  );
}

function PhotoCard({ p, i, depth, progress }: { p: FlyPhoto; i: number; depth: number; progress: MotionValue<number> }) {
  const side = i % 2 ? 1 : -1;
  const x = side * (24 + ((i * 37) % 16)); // vw from centre, kept off the text
  const y = ((i * 53) % 44) - 22; // vh
  const z0 = -(i + 1) * GAP;
  // progress at which this card reaches a given distance from the camera
  const at = (rel: number) => Math.min(1, Math.max(0, (rel - z0) / depth));
  const a = at(FADE_IN), b = Math.max(a + 0.001, at(FADE_IN + 1500)), c = Math.max(b + 0.001, at(PASS - 350)), d = Math.max(c + 0.001, at(PASS));
  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0]);
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 w-[clamp(150px,24vw,360px)]"
      style={{ opacity, transform: `translate(-50%, -50%) translate3d(${x}vw, ${y}vh, ${z0}px) rotateY(${side * -14}deg) rotateZ(${side * 2}deg)` }}
    >
      <Link href={`/packages/${p.slug}`} className="group block overflow-hidden rounded-2xl bg-white p-2 pb-3 shadow-[0_30px_60px_-20px_rgb(0_0_0/.8)]">
        <span className="relative block aspect-[4/5] overflow-hidden rounded-xl">
          <Image src={p.src} alt="" fill sizes="(min-width:1024px) 24vw, 40vw" className="object-cover transition duration-500 group-hover:scale-105" />
        </span>
        <span className="mt-2 block truncate px-1 font-display text-sm font-extrabold text-[#070b24] sm:text-base">{p.title}</span>
      </Link>
    </motion.div>
  );
}

type ChapterData = { k: string; icon: React.ComponentType<{ className?: string }>; t: string; d: string; cta?: boolean };

function Chapter({ c, i, n, progress }: { c: ChapterData; i: number; n: number; progress: MotionValue<number> }) {
  const span = 1 / n;
  const last = i === n - 1;
  const first = i === 0;
  // Fades overlap the neighbouring chapters slightly, so the story cross-dissolves instead of going blank.
  const o = span * 0.06;
  const start = Math.max(0, i * span - o), end = Math.min(1, (i + 1) * span + o);
  const keys = [start, Math.min(start + span * 0.14, end - 0.002), Math.max(end - span * 0.14, start + 0.004), end].map((k, j, a) => (j && k <= a[j - 1] ? a[j - 1] + 0.001 : k));
  const opacity = useTransform(progress, keys, [first ? 1 : 0, 1, 1, last ? 1 : 0]);
  const y = useTransform(progress, keys, [first ? 0 : 40, 0, 0, last ? 0 : -40]);
  const blur = useTransform(progress, keys, [first ? 0 : 8, 0, 0, last ? 0 : 8]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  const pointerEvents = useTransform(opacity, (o) => (o > 0.5 ? "auto" : "none"));
  const Icon = c.icon;
  return (
    <motion.div className="col-start-1 row-start-1 max-w-2xl rounded-[2rem] border border-white/10 bg-[#03040d]/45 px-6 py-8 text-center text-white shadow-[0_30px_80px_-30px_rgb(0_0_0/.9)] backdrop-blur-md sm:px-12 sm:py-10 [text-shadow:0_2px_18px_rgb(3_4_13/.7)]" style={{ opacity, y, filter, pointerEvents }}>
      <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[0.7rem] font-bold tracking-[0.2em] text-sun uppercase backdrop-blur"><Icon className="size-3.5" />{c.k}</p>
      <h2 className="mt-5 text-5xl leading-[0.95] font-extrabold sm:text-7xl">{c.t}</h2>
      <p className="mx-auto mt-5 max-w-lg text-lg text-white/80">{c.d}</p>
      {c.cta && (
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/plan" className="inline-flex h-12 items-center gap-2 rounded-full bg-sun px-7 font-bold text-sun-foreground transition hover:bg-white">Plan my trip <ArrowUpRight className="size-5" /></Link>
          <Link href="/packages" className="inline-flex h-12 items-center rounded-full border-2 border-white px-7 font-bold transition hover:bg-white hover:text-[#070b24]">Browse holidays</Link>
        </div>
      )}
      {i === 0 && <p className="mt-8 animate-bounce text-xs font-bold tracking-[0.25em] text-white/50 uppercase">Scroll to fly</p>}
    </motion.div>
  );
}

/** Same story without motion, for visitors who prefer reduced motion. */
function StaticStory({ chapters, photos }: { chapters: ChapterData[]; photos: FlyPhoto[] }) {
  return (
    <section className="mt-24 bg-[#070b24] py-20 text-white" aria-label="Our story">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <ol className="space-y-10">
          {chapters.map((c) => (
            <li key={c.k}>
              <p className="text-xs font-bold tracking-[0.2em] text-sun uppercase">{c.k}</p>
              <h2 className="mt-2 text-4xl font-extrabold">{c.t}</h2>
              <p className="mt-2 text-white/75">{c.d}</p>
            </li>
          ))}
        </ol>
        <div className="grid grid-cols-3 gap-3">
          {photos.slice(0, 9).map((p) => <div key={p.src} className="relative aspect-[4/5] overflow-hidden rounded-xl"><Image src={p.src} alt="" fill sizes="15vw" className="object-cover" /></div>)}
        </div>
      </div>
    </section>
  );
}
