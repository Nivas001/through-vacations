"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, CalendarDays, Compass, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { monthName } from "@/lib/site";

const styles = ["Couples", "Honeymoon", "Family", "Friends", "Beach", "Nature", "City", "Culture"];
const field =
  "h-11 w-full rounded-lg border-0 bg-transparent px-0 text-sm font-medium text-foreground outline-none focus-visible:ring-0";

export function HeroSearch({ destinations }: { destinations: string[] }) {
  const router = useRouter();
  const [dest, setDest] = useState("");
  const [month, setMonth] = useState("");
  const [style, setStyle] = useState("");

  function go(e: React.FormEvent) {
    e.preventDefault();
    const p = new URLSearchParams();
    if (dest) p.set("q", dest);
    if (month) p.set("month", month);
    if (style) p.set("style", style);
    router.push(`/packages${p.size ? `?${p}` : ""}`);
  }

  return (
    <form
      onSubmit={go}
      className="grid gap-2 rounded-[1.5rem] border border-white/40 bg-card/85 p-3 text-card-foreground shadow-2xl shadow-black/25 backdrop-blur-xl sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-center sm:p-2.5"
    >
      <Field icon={<Compass className="size-4" />} label="Where to?">
        <select className={field} value={dest} onChange={(e) => setDest(e.target.value)} aria-label="Where to?">
          <option value="">I&apos;m open to inspiration</option>
          {destinations.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </Field>
      <Field icon={<CalendarDays className="size-4" />} label="When?">
        <select className={field} value={month} onChange={(e) => setMonth(e.target.value)} aria-label="When?">
          <option value="">Any month</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i + 1}>{monthName(i + 1)}</option>
          ))}
        </select>
      </Field>
      <Field icon={<Sparkles className="size-4" />} label="Kind of holiday">
        <select className={field} value={style} onChange={(e) => setStyle(e.target.value)} aria-label="Kind of holiday">
          <option value="">Any style</option>
          {styles.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </Field>
      <Button type="submit" size="lg" className="h-12 px-7 text-base sm:h-14">
        Find trips <ArrowUpRight />
      </Button>
    </form>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-0.5 rounded-xl px-4 py-1.5 hover:bg-muted sm:border-r sm:last:border-r-0">
      <span className="flex items-center gap-1.5 text-[0.65rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
        {icon} {label}
      </span>
      {children}
    </label>
  );
}
