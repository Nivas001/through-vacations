"use client";
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { Plane } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { n: "01", code: "IDEA", title: "Pick or describe", body: "Browse a holiday you like, or tell us the trip you have in mind." },
  { n: "02", code: "DATE", title: "Reserve your dates", body: "Choose dates and travellers. We hold your request while we confirm details." },
  { n: "03", code: "PLAN", title: "We tailor it", body: "Your planner refines stays, transfers and activities and sends a personal quote." },
  { n: "04", code: "GO", title: "Go through it", body: "Pay the team directly once you are happy, then travel with support on call." },
];

/** "How it works" as a flight: a plane follows your scroll along the route and lights up each step. */
export function FlightSteps() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 55%"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.4 });
  const pct = useTransform(p, (v) => `${Math.min(100, Math.max(0, v * 100))}%`);
  const [at, setAt] = useState(-1);
  useMotionValueEvent(p, "change", (v) => setAt(Math.min(steps.length - 1, Math.floor(v * steps.length + 0.15) - (v < 0.04 ? 1 : 0))));

  return (
    <section className="relative mt-28 overflow-hidden bg-[linear-gradient(180deg,#dfe8ff_0%,#f1f3fa_100%)] py-24 dark:bg-[linear-gradient(180deg,#0b1340_0%,#050817_100%)]">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-3.5 py-1.5 text-[0.7rem] font-bold tracking-[0.18em] text-secondary-foreground uppercase"><span className="size-2 rounded-full bg-sun ring-2 ring-sun/40" />How it works</p>
          <h2 className="text-4xl leading-[1] font-extrabold sm:text-6xl">From idea to <span className="accent-word text-brand">boarding pass</span></h2>
        </div>

        <div ref={ref} className="relative mt-16">
          {/* desktop: horizontal route */}
          <div className="relative mx-[12.5%] hidden h-10 lg:block" aria-hidden>
            <div className="absolute top-1/2 inset-x-0 border-t-2 border-dashed border-primary/30" />
            <motion.div className="absolute top-1/2 left-0 h-0.5 -translate-y-px bg-primary" style={{ width: pct }} />
            <motion.div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: pct }}>
              <span className="grid size-10 place-items-center rounded-full bg-sun text-sun-foreground shadow-[0_8px_20px_-6px_rgb(255_210_63/.9)]"><Plane className="size-5 rotate-45" /></span>
            </motion.div>
          </div>

          <div className="relative lg:mt-8">
            {/* phone: vertical route */}
            <div className="absolute top-0 bottom-0 left-5 lg:hidden" aria-hidden>
              <div className="absolute inset-y-0 border-l-2 border-dashed border-primary/30" />
              <motion.div className="absolute top-0 -ml-px w-0.5 bg-primary" style={{ height: pct }} />
              <motion.div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: pct, left: 1 }}>
                <span className="grid size-9 place-items-center rounded-full bg-sun text-sun-foreground shadow-lg"><Plane className="size-4 rotate-[135deg]" /></span>
              </motion.div>
            </div>
            <ol className="relative grid grid-cols-1 gap-5 lg:grid-cols-4">
            {steps.map((s, i) => {
              const on = i <= at;
              return (
                <li key={s.n} className={cn("relative ml-12 flex overflow-hidden rounded-3xl border bg-card transition-all duration-500 lg:ml-0", on ? "border-primary shadow-[0_18px_40px_-20px_rgb(30_75_230/.6)] lg:-translate-y-1" : "opacity-70")}>
                  <div className="min-w-0 flex-1 p-5">
                    <p className="font-mono text-[0.65rem] font-bold tracking-[0.25em] text-muted-foreground uppercase">Step {s.n}</p>
                    <h3 className="mt-2 text-2xl font-extrabold">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                  </div>
                  <div className={cn("flex w-14 shrink-0 flex-col items-center justify-center gap-1 border-l-2 border-dashed transition-colors duration-500", on ? "border-primary/40 bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                    <span className="font-mono text-xs font-bold [writing-mode:vertical-rl]">{s.code}</span>
                    <span className="font-display text-lg font-extrabold">{s.n}</span>
                  </div>
                </li>
              );
            })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
