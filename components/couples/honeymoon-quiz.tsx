"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight, Heart, RotateCcw } from "lucide-react";
import { monthName } from "@/lib/site";
import type { Vibe } from "@/lib/mock/romance";
import { cn } from "@/lib/utils";

export type QuizTrip = { slug: string; title: string; destination: string; image: string; region: "India" | "International"; nights: number; bestMonths: number[]; vibes: Vibe[]; line: string; notBabymoon?: boolean; tagline: string };

const vibeOptions: { v: Vibe; title: string; sub: string }[] = [
  { v: "water", title: "Wake up beside water", sub: "Sea, lagoons and long beaches" },
  { v: "snow", title: "Hot tea and big mountains", sub: "Snow, lakes and cool air" },
  { v: "culture", title: "Streets, palaces and cafés", sub: "Heritage and slow wandering" },
  { v: "green", title: "Mist, forest and hills", sub: "Green, quiet and cosy" },
];
const regionOptions = [{ v: "India", title: "Stay in India" }, { v: "International", title: "Go abroad" }, { v: "either", title: "Either is fine" }] as const;
const lengthOptions = [{ v: 4, title: "3 to 4 nights" }, { v: 6, title: "5 to 6 nights" }, { v: 9, title: "A week or more" }] as const;
const occasionOptions = [{ v: "honeymoon", title: "Honeymoon" }, { v: "anniversary", title: "Anniversary" }, { v: "babymoon", title: "Babymoon" }, { v: "just-us", title: "Just us" }] as const;

type A = { vibe?: Vibe; region?: "India" | "International" | "either"; length?: number; month?: number; occasion?: string };

function score(t: QuizTrip, a: A) {
  let s = 0;
  const why: string[] = [];
  if (a.vibe && t.vibes.includes(a.vibe)) { s += 4; why.push(`Matches your ${vibeOptions.find((v) => v.v === a.vibe)!.title.toLowerCase()} mood`); }
  if (a.region && a.region !== "either") { if (t.region === a.region) { s += 2; } else s -= 3; }
  if (a.month) {
    if (t.bestMonths.includes(a.month)) { s += 3; why.push(`${monthName(a.month)} is a great month for it`); }
    else if (t.bestMonths.some((m) => Math.abs(m - a.month!) === 1 || Math.abs(m - a.month!) === 11)) { s += 1; why.push(`${monthName(a.month)} is shoulder season, still lovely`); }
    else s -= 1;
  }
  if (a.length) {
    const diff = Math.abs(t.nights - a.length);
    if (diff <= 1) { s += 2; why.push(`${t.nights} nights fits your time`); } else if (diff <= 2) s += 1;
  }
  if (a.occasion === "babymoon") { if (t.notBabymoon) s -= 5; else { s += 1; why.push("A gentle pace with no big altitude"); } }
  return { s, why };
}

export function HoneymoonQuiz({ trips }: { trips: QuizTrip[] }) {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<A>({});
  const total = 5;
  const results = useMemo(() => trips.map((t) => ({ t, ...score(t, a) })).sort((x, y) => y.s - x.s).slice(0, 3), [trips, a]);
  const set = (patch: A) => { setA((c) => ({ ...c, ...patch })); setStep((n) => n + 1); };
  const now = new Date().getMonth() + 1;
  const months = Array.from({ length: 12 }, (_, i) => ((now - 1 + i) % 12) + 1);

  return (
    <div className="grain relative overflow-hidden rounded-[1.75rem] bg-primary p-5 text-white sm:p-10">
      <div className="relative">
        {step < total && (
          <div>
            <div className="flex items-center gap-3">
              {step > 0 && <button type="button" onClick={() => setStep((n) => n - 1)} aria-label="Back" className="grid size-9 place-items-center rounded-full border border-white/40 hover:bg-white/10"><ArrowLeft className="size-4" /></button>}
              <div className="flex flex-1 gap-1.5" aria-label={`Question ${step + 1} of ${total}`}>
                {Array.from({ length: total }, (_, k) => <span key={k} className={cn("h-1.5 flex-1 rounded-full transition-colors duration-500", k <= step ? "bg-sun" : "bg-white/25")} />)}
              </div>
            </div>
            <div key={step} className="fade-up mt-8">
              {step === 0 && <Q title="What does your first morning look like?"><Grid>{vibeOptions.map((o) => <Opt key={o.v} onClick={() => set({ vibe: o.v })} title={o.title} sub={o.sub} />)}</Grid></Q>}
              {step === 1 && <Q title="How far do you want to go?"><Grid>{regionOptions.map((o) => <Opt key={o.v} onClick={() => set({ region: o.v })} title={o.title} />)}</Grid></Q>}
              {step === 2 && <Q title="When are you thinking of travelling?"><div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">{months.map((m) => <Opt key={m} onClick={() => set({ month: m })} title={monthName(m).slice(0, 3)} small />)}</div></Q>}
              {step === 3 && <Q title="How many nights do you have?"><Grid>{lengthOptions.map((o) => <Opt key={o.v} onClick={() => set({ length: o.v })} title={o.title} />)}</Grid></Q>}
              {step === 4 && <Q title="What are you celebrating?"><Grid>{occasionOptions.map((o) => <Opt key={o.v} onClick={() => set({ occasion: o.v })} title={o.title} />)}</Grid></Q>}
            </div>
          </div>
        )}

        {step >= total && (
          <div className="fade-up">
            <p className="flex items-center gap-2 text-xs font-bold tracking-[0.25em] text-sun uppercase"><Heart className="size-4 fill-sun" /> Your matches</p>
            <h3 className="mt-3 text-4xl leading-[0.95] font-extrabold uppercase sm:text-5xl">{results[0]?.t.destination} <span className="serif-i font-extrabold text-sun">first.</span></h3>
            <ol className="mt-8 grid gap-4 lg:grid-cols-3">
              {results.map(({ t, why }, k) => (
                <li key={t.slug} className={cn("overflow-hidden rounded-[1.5rem] bg-card text-card-foreground card-lift", k === 0 && "ring-4 ring-sun")}>
                  <div className="relative aspect-[4/3]"><Image src={t.image} alt="" fill sizes="(min-width:1024px) 30vw, 100vw" className="object-cover" />{k === 0 && <span className="absolute top-3 left-3 rounded-full bg-sun px-3 py-1 text-[0.65rem] font-bold tracking-wider text-sun-foreground uppercase">Best match</span>}</div>
                  <div className="p-5">
                    <p className="font-display text-2xl leading-none font-extrabold uppercase">{t.title}</p>
                    <p className="serif-i mt-1 text-muted-foreground">{t.tagline}</p>
                    <ul className="mt-3 space-y-1 text-sm text-muted-foreground">{(why.length ? why : [t.line]).slice(0, 3).map((w) => <li key={w}>· {w}</li>)}</ul>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link href={`/plan?trip=${t.slug}&occasion=${a.occasion ?? "just-us"}${a.month ? `&month=${a.month}` : ""}`} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground">Plan this <ArrowUpRight className="size-4" /></Link>
                      <Link href={`/packages/${t.slug}`} className="inline-flex h-10 items-center rounded-full border-2 px-4 text-sm font-bold">See route</Link>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            <button type="button" onClick={() => { setA({}); setStep(0); }} className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-white/85 underline-offset-4 hover:underline"><RotateCcw className="size-4" /> Start again</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Q({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><h3 className="text-3xl leading-[0.98] font-extrabold uppercase sm:text-5xl">{title}</h3><div className="mt-8">{children}</div></div>;
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}
function Opt({ title, sub, onClick, small }: { title: string; sub?: string; onClick: () => void; small?: boolean }) {
  return (
    <button type="button" onClick={onClick} className={cn("group rounded-2xl border-2 border-white/30 bg-white/10 text-left backdrop-blur transition hover:-translate-y-0.5 hover:border-sun hover:bg-white/20", small ? "px-4 py-4 text-center font-bold" : "p-5")}>
      <span className={cn("block font-bold", !small && "font-display text-2xl leading-tight font-extrabold uppercase")}>{title}</span>
      {sub && <span className="mt-1 block text-sm text-white/75">{sub}</span>}
    </button>
  );
}
