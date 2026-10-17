"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, CalendarDays, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/brand/link-button";
import { estimate, isTooSoon } from "@/lib/pricing";
import { toast } from "sonner";
import { formatINR, whatsappLink } from "@/lib/site";
import { shownPrice } from "@/lib/data/packages";
import type { TravelPackage } from "@/lib/types";

export function BookingWidget({ pkg }: { pkg: TravelPackage }) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const total = estimate(pkg, adults, children);
  const price = shownPrice(pkg);

  function reserve() {
    if (date && isTooSoon(date)) return toast.error("Please choose a start date at least 3 days from today");
    const p = new URLSearchParams({ adults: String(adults), children: String(children) });
    if (date) p.set("date", date);
    router.push(`/book/${pkg.slug}?${p}`);
  }

  return (
    <div className="rounded-3xl border bg-card p-6 shadow-xl shadow-brand/5">
      <div className="flex items-baseline justify-between">
        {price ? (
          <p>
            <span className="text-xs tracking-widest text-muted-foreground uppercase">From </span>
            <span className="font-display text-4xl font-extrabold">{formatINR(price)}</span>
            <span className="text-sm text-muted-foreground"> /person</span>
          </p>
        ) : (
          <p className="font-display text-3xl font-extrabold">Quote on request</p>
        )}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{pkg.priceNote}</p>

      <div className="mt-5 space-y-3">
        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            <CalendarDays className="size-3.5" /> Preferred start date
          </span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-11 w-full rounded-xl border bg-background px-3 text-sm"
          />
        </label>
        <Counter label="Adults" sub="12+ years" value={adults} min={1} max={12} onChange={setAdults} />
        <Counter label="Children" sub="Under 12" value={children} min={0} max={8} onChange={setChildren} />
      </div>

      {total && (
        <div className="mt-5 flex items-center justify-between rounded-xl bg-secondary px-4 py-3 text-sm">
          <span className="text-secondary-foreground">Indicative total</span>
          <span className="font-display text-2xl font-extrabold text-secondary-foreground">{formatINR(total)}</span>
        </div>
      )}

      <Button onClick={reserve} size="lg" className="mt-5 h-12 w-full rounded-full text-base">
        Reserve this trip <ArrowUpRight />
      </Button>
      <LinkButton
        href={`/plan?trip=${pkg.slug}`}
        variant="outline"
        size="lg"
        className="mt-2.5 h-12 w-full rounded-full text-base"
      >
        Customise &amp; get a quote
      </LinkButton>
      <a
        href={whatsappLink(`Hi! I'm interested in the ${pkg.title} holiday (${pkg.durationLabel}).`)}
        target="_blank"
        rel="noreferrer"
        className="mt-4 block text-center text-sm text-brand underline-offset-4 hover:underline"
      >
        Ask a planner on WhatsApp
      </a>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        No payment now. We confirm availability, then share payment details.
      </p>
    </div>
  );
}

export function Counter({
  label, sub, value, min, max, onChange,
}: { label: string; sub: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center justify-between rounded-xl border px-3 py-2">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" size="icon-sm" className="rounded-full" aria-label={`Fewer ${label.toLowerCase()}`} disabled={value <= min} onClick={() => onChange(value - 1)}>
          <Minus />
        </Button>
        <span className="w-5 text-center text-sm font-medium tabular-nums" aria-live="polite">{value}</span>
        <Button type="button" variant="outline" size="icon-sm" className="rounded-full" aria-label={`More ${label.toLowerCase()}`} disabled={value >= max} onClick={() => onChange(value + 1)}>
          <Plus />
        </Button>
      </div>
    </div>
  );
}
