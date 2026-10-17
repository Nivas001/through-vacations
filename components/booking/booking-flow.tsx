"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Copy, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Counter } from "@/components/packages/booking-widget";
import { LinkButton, ExternalButton } from "@/components/brand/link-button";
import { addOnOptions, estimate, isTooSoon } from "@/lib/pricing";
import { createBooking } from "@/lib/data/store";
import { formatINR, whatsappLink } from "@/lib/site";
import { leadSchema, type LeadInput } from "@/lib/validation";
import type { AddOn, Booking, TravelPackage } from "@/lib/types";
import { cn } from "@/lib/utils";

const steps = ["Dates", "Travellers", "Add-ons", "Your details", "Review"] as const;

type Draft = { date: string; adults: number; children: number; rooms: number; addOns: AddOn[] };

export function BookingFlow({ pkg, initial }: { pkg: TravelPackage; initial: Partial<Draft> }) {
  const draftKey = `tv-draft-${pkg.slug}`;
  const [step, setStep] = useState(0);
  const [d, setD] = useState<Draft>({ date: "", adults: 2, children: 0, rooms: 1, addOns: [], ...initial });
  const [done, setDone] = useState<Booking | null>(null);
  const [busy, setBusy] = useState(false);

  const form = useForm<LeadInput>({
    resolver: zodResolver(leadSchema) as never,
    defaultValues: { name: "", email: "", phone: "", city: "", country: "India", notes: "" },
    mode: "onTouched",
  });

  // Restore a saved draft unless the page was opened with explicit values from the widget.
  useEffect(() => {
    if (Object.keys(initial).length) return;
    try {
      const saved = JSON.parse(localStorage.getItem(draftKey) ?? "null");
      // Restoring a saved draft from localStorage on mount is a legitimate external-system sync.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setD((cur) => ({ ...cur, ...saved.d }));
    } catch {}
  }, [draftKey, initial]);
  useEffect(() => {
    try { localStorage.setItem(draftKey, JSON.stringify({ d })); } catch {}
  }, [d, draftKey]);

  const total = estimate(pkg, d.adults, d.children);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }));
  const toggleAddOn = (id: AddOn) => set("addOns", d.addOns.includes(id) ? d.addOns.filter((a) => a !== id) : [...d.addOns, id]);

  async function next() {
    if (step === 0 && isTooSoon(d.date)) return toast.error("Choose a start date at least 3 days from today");
    if (step === 3 && !(await form.trigger())) return;
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit() {
    setBusy(true);
    const lead = form.getValues();
    const b = await createBooking({
      packageSlug: pkg.slug, packageTitle: pkg.title, startDate: d.date, adults: d.adults, children: d.children,
      rooms: d.rooms, addOns: d.addOns, notes: lead.notes ?? "", estimate: total,
      lead: { name: lead.name, email: lead.email, phone: lead.phone, city: lead.city, country: lead.country },
    });
    try { localStorage.removeItem(draftKey); } catch {}
    setDone(b);
    setBusy(false);
  }

  const lead = useWatch({ control: form.control }) as LeadInput;

  if (done) return <Confirmation booking={done} pkg={pkg} />;

  const errs = form.formState.errors;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <div>
        <ol className="mb-8 flex gap-2 overflow-x-auto pb-1" aria-label="Progress">
          {steps.map((s, i) => (
            <li key={s} aria-current={i === step ? "step" : undefined} className={cn("flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm", i === step ? "border-primary bg-primary text-primary-foreground" : i < step ? "bg-secondary text-secondary-foreground" : "text-muted-foreground")}>
              {i < step ? <Check className="size-3.5" /> : <span className="tabular-nums">{i + 1}</span>} {s}
            </li>
          ))}
        </ol>

        <div className="rounded-3xl border bg-card p-6 sm:p-8">
          {step === 0 && (
            <Section title="When would you like to go?" sub="Pick a preferred start date. We confirm availability before anything is final.">
              <input type="date" value={d.date} onChange={(e) => set("date", e.target.value)} aria-label="Preferred start date" className="h-12 w-full max-w-xs rounded-xl border bg-background px-4" />
              <p className="mt-3 text-sm text-muted-foreground">{pkg.durationLabel}. Your return date follows from the trip length.</p>
            </Section>
          )}
          {step === 1 && (
            <Section title="Who is travelling?" sub="Child fares and room sharing are confirmed in your quote.">
              <div className="grid max-w-md gap-3">
                <Counter label="Adults" sub="12+ years" value={d.adults} min={1} max={12} onChange={(n) => set("adults", n)} />
                <Counter label="Children" sub="Under 12" value={d.children} min={0} max={8} onChange={(n) => set("children", n)} />
                <Counter label="Rooms" sub="Needed" value={d.rooms} min={1} max={8} onChange={(n) => set("rooms", n)} />
              </div>
            </Section>
          )}
          {step === 2 && (
            <Section title="Anything else we should arrange?" sub="Optional. These are quoted separately and add nothing to the estimate.">
              <div className="grid gap-3 sm:grid-cols-2">
                {addOnOptions.map((a) => (
                  <button key={a.id} type="button" aria-pressed={d.addOns.includes(a.id)} onClick={() => toggleAddOn(a.id)} className={cn("flex items-start gap-3 rounded-2xl border p-4 text-left transition", d.addOns.includes(a.id) ? "border-primary bg-secondary" : "hover:border-primary/50")}>
                    <span className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border", d.addOns.includes(a.id) && "border-primary bg-primary text-primary-foreground")}>{d.addOns.includes(a.id) && <Check className="size-3.5" />}</span>
                    <span><span className="block font-medium">{a.label}</span><span className="text-sm text-muted-foreground">{a.hint}</span></span>
                  </button>
                ))}
              </div>
            </Section>
          )}
          {step === 3 && (
            <Section title="Your details" sub="We use these only to confirm your trip.">
              <form className="grid gap-5 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()} noValidate>
                <Field label="Full name" error={errs.name?.message}><Input autoComplete="name" {...form.register("name")} /></Field>
                <Field label="Email" error={errs.email?.message}><Input type="email" autoComplete="email" {...form.register("email")} /></Field>
                <Field label="Phone / WhatsApp" error={errs.phone?.message}><Input type="tel" autoComplete="tel" {...form.register("phone")} /></Field>
                <Field label="Departure city" error={errs.city?.message}><Input autoComplete="address-level2" {...form.register("city")} /></Field>
                <Field label="Country of residence" error={errs.country?.message}><Input autoComplete="country-name" {...form.register("country")} /></Field>
                <div className="sm:col-span-2"><Field label="Anything we should know? (optional)" error={errs.notes?.message}><Textarea rows={4} {...form.register("notes")} /></Field></div>
              </form>
            </Section>
          )}
          {step === 4 && (
            <Section title="Review your request" sub="Nothing is charged. Our team will contact you to confirm availability and share payment details.">
              <dl className="grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2">
                <Row k="Holiday" v={`${pkg.title} · ${pkg.durationLabel}`} />
                <Row k="Start date" v={new Date(d.date).toLocaleDateString("en-IN", { dateStyle: "long" })} />
                <Row k="Travellers" v={`${d.adults} adult${d.adults > 1 ? "s" : ""}${d.children ? `, ${d.children} child${d.children > 1 ? "ren" : ""}` : ""} · ${d.rooms} room${d.rooms > 1 ? "s" : ""}`} />
                <Row k="Add-ons" v={d.addOns.length ? d.addOns.map((a) => addOnOptions.find((o) => o.id === a)?.label).join(", ") : "None"} />
                <Row k="Name" v={lead.name} />
                <Row k="Contact" v={`${lead.email} · ${lead.phone}`} />
                <Row k="Travelling from" v={`${lead.city}, ${lead.country}`} />
              </dl>
            </Section>
          )}

          <div className="mt-10 flex items-center justify-between">
            <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}><ArrowLeft /> Back</Button>
            {step < 4 ? (
              <Button size="lg" className="h-11 rounded-full px-6" onClick={next}>Continue <ArrowRight /></Button>
            ) : (
              <Button size="lg" className="h-11 rounded-full px-6" disabled={busy} onClick={submit}>{busy ? "Sending…" : "Send booking request"}</Button>
            )}
          </div>
        </div>
      </div>

      <Summary pkg={pkg} d={d} total={total} />
    </div>
  );
}

function Summary({ pkg, d, total }: { pkg: TravelPackage; d: Draft; total: number | null }) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="ticket bg-primary p-6 text-primary-foreground">
        <p className="text-xs tracking-[0.2em] text-white/70 uppercase">Your trip</p>
        <p className="mt-1 font-display text-3xl leading-tight font-extrabold">{pkg.title}</p>
        <p className="text-sm text-white/80">{pkg.durationLabel}</p>
        <div className="my-5 border-t-2 border-dashed border-white/50" />
        <p className="text-sm">{d.date ? new Date(d.date).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "Date to be chosen"}</p>
        <p className="text-sm">{d.adults} adult{d.adults > 1 ? "s" : ""}{d.children ? ` + ${d.children} child${d.children > 1 ? "ren" : ""}` : ""}</p>
        <div className="my-5 border-t-2 border-dashed border-white/50" />
        {total ? (
          <>
            <p className="font-display text-4xl font-extrabold">{formatINR(total)}</p>
            <p className="mt-1 text-xs text-white/75">Indicative estimate. The team confirms the final price.</p>
          </>
        ) : (
          <p className="text-sm text-white/85">Price confirmed in your personal quote.</p>
        )}
      </div>
    </aside>
  );
}

function Confirmation({ booking, pkg }: { booking: Booking; pkg: TravelPackage }) {
  return (
    <div className="mx-auto max-w-2xl rounded-3xl border bg-card p-8 text-center sm:p-12">
      <CheckCircle2 className="mx-auto size-14 text-brand" />
      <h2 className="mt-5 text-5xl font-extrabold">Request received</h2>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">
        Thank you, {booking.lead.name.split(" ")[0]}. Our team will contact you to confirm availability and collect payment. No payment has been taken.
      </p>
      <div className="mx-auto mt-8 inline-flex items-center gap-3 rounded-2xl bg-secondary px-6 py-4">
        <div className="text-left">
          <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Booking reference</p>
          <p className="font-display text-3xl font-extrabold text-secondary-foreground">{booking.reference}</p>
        </div>
        <Button variant="ghost" size="icon" aria-label="Copy reference" onClick={() => { navigator.clipboard?.writeText(booking.reference); toast.success("Reference copied"); }}><Copy /></Button>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ExternalButton href={whatsappLink(`Hi! My booking reference is ${booking.reference} for ${pkg.title}.`)} className="h-11 rounded-full px-6"><MessageCircle /> Message us on WhatsApp</ExternalButton>
        <LinkButton href="/packages" variant="outline" className="h-11 rounded-full px-6">Keep browsing</LinkButton>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">Demo mode: this request is stored in your browser only until the database is connected. <Link href="/admin/bookings" className="underline">View in admin</Link></p>
    </div>
  );
}

const Section = ({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) => (
  <div><h2 className="text-4xl font-extrabold sm:text-5xl">{title}</h2><p className="mt-2 mb-7 text-muted-foreground">{sub}</p>{children}</div>
);
const Row = ({ k, v }: { k: string; v: string }) => (<div><dt className="text-xs tracking-[0.16em] text-muted-foreground uppercase">{k}</dt><dd className="mt-0.5 font-medium">{v}</dd></div>);
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (<div className="space-y-1.5"><Label>{label}</Label>{children}{error && <p role="alert" className="text-xs text-destructive">{error}</p>}</div>);
}
