"use client";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export type Faq = { q: string; a: string; topic: string };

/** Searchable, topic-filtered FAQ list. */
export function FaqBrowser({ faqs, topics }: { faqs: Faq[]; topics: string[] }) {
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("All");
  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return faqs.filter((f) => (topic === "All" || f.topic === topic) && (!t || `${f.q} ${f.a}`.toLowerCase().includes(t)));
  }, [faqs, q, topic]);

  return (
    <div>
      <label className="relative block">
        <span className="sr-only">Search questions</span>
        <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search, e.g. visa, payment, cancel"
          className="h-14 w-full rounded-2xl border bg-card pr-12 pl-12 text-base outline-none focus-visible:ring-4 focus-visible:ring-ring/30 [&::-webkit-search-cancel-button]:hidden" />
        {q && <button type="button" aria-label="Clear search" onClick={() => setQ("")} className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground"><X className="size-5" /></button>}
      </label>
      <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Topics">
        {["All", ...topics].map((t) => (
          <button key={t} type="button" aria-pressed={topic === t} onClick={() => setTopic(t)}
            className={cn("h-9 shrink-0 rounded-full border px-4 text-sm font-semibold transition", topic === t ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary/50")}>
            {t} <span className="opacity-60">{t === "All" ? faqs.length : faqs.filter((f) => f.topic === t).length}</span>
          </button>
        ))}
      </div>
      {rows.length ? (
        <Accordion className="mt-6 rounded-2xl border bg-card px-5">
          {rows.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="py-5 text-left text-base font-bold">
                <span><span className="mb-1 block text-[0.65rem] font-bold tracking-[0.18em] text-brand uppercase">{f.topic}</span>{f.q}</span>
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <p className="mt-6 rounded-2xl border border-dashed bg-card p-8 text-center text-muted-foreground">No questions match “{q}”. Ask us directly and we will answer.</p>
      )}
    </div>
  );
}
