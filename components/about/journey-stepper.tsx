"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

const steps = [
  { n: "01", t: "You tell us", you: "Share dates, who is travelling and the feeling you want. A message, a call or the three-step form all work.", us: "We read it properly, ask a few questions and note anything that matters: an occasion, a worry, a favourite place." },
  { n: "02", t: "We shape it", you: "Relax. If you like, play with the Trip Shaper to see how much trip your days can hold.", us: "A planner builds a route around your answers: stays, transfers and experiences in an order that makes sense." },
  { n: "03", t: "You approve it", you: "Read the itinerary and quote. Change what you like, ask what you want, say no to what does not fit.", us: "We list what is included and what is not, adjust the plan and keep refining until it feels right." },
  { n: "04", t: "We stay on call", you: "Travel. Message us if something changes or you want a better dinner idea.", us: "We confirm details before you leave and stay reachable while you are away." },
];

export function JourneyStepper() {
  const [i, setI] = useState(0);
  const s = steps[i];
  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <ol className="grid gap-2" role="tablist" aria-label="Trip steps">
        {steps.map((x, k) => (
          <li key={x.n}>
            <button type="button" role="tab" aria-selected={k === i} onClick={() => setI(k)} className={cn("flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition", k === i ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "bg-card hover:border-primary/60")}>
              <span className={cn("font-display text-3xl leading-none font-extrabold italic", k === i ? "text-sun" : "text-brand")}>{x.n}</span>
              <span className="font-display text-xl leading-none font-extrabold uppercase">{x.t}</span>
            </button>
          </li>
        ))}
      </ol>
      <div key={s.n} className="fade-up grid gap-4 sm:grid-cols-2">
        <div className="card-lift rounded-[1.5rem] border bg-card p-6">
          <p className="text-xs font-bold tracking-[0.2em] text-brand uppercase">What you do</p>
          <p className="mt-3 text-lg leading-relaxed">{s.you}</p>
        </div>
        <div className="grain relative overflow-hidden rounded-[1.5rem] bg-primary p-6 text-white">
          <p className="text-xs font-bold tracking-[0.2em] text-sun uppercase">What we do</p>
          <p className="mt-3 text-lg leading-relaxed">{s.us}</p>
        </div>
      </div>
    </div>
  );
}
