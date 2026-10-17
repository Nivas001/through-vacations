"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CheckCircle2, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Counter } from "@/components/packages/booking-widget";
import { LinkButton } from "@/components/brand/link-button";
import { createEnquiry } from "@/lib/data/store";
import { quoteSchema, type QuoteInput } from "@/lib/validation";
import type { Enquiry, TravelStyle } from "@/lib/types";
import { cn } from "@/lib/utils";

const styles: TravelStyle[] = ["Couples", "Honeymoon", "Family", "Friends", "Group", "Corporate", "Student"];
const currencies = ["INR", "USD", "SGD", "AED", "GBP"];
const stepFields: (keyof QuoteInput)[][] = [["destinations", "dates"], ["travellers", "budget"], ["name", "email", "phone", "departureCity", "departureCountry"]];
const titles = ["Where to?", "Who and how much?", "How do we reach you?"];

export function QuoteForm({ prefill, dates, travellers, notes, presetStyles }: { prefill?: string; dates?: string; travellers?: number; notes?: string; presetStyles?: string[] }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<Enquiry | null>(null);
  const [busy, setBusy] = useState(false);
  const form = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema) as never,
    defaultValues: {
      destinations: prefill ?? "", dates: dates ?? "", flexibleDates: false, travellers: travellers ?? 2, budget: "", currency: "INR",
      styles: (presetStyles ?? []) as never, name: "", email: "", phone: "", departureCity: "", departureCountry: "India", notes: notes ?? "",
    },
    mode: "onTouched",
  });
  const { register, control, formState: { errors } } = form;

  async function next() {
    if (!(await form.trigger(stepFields[step]))) return;
    setStep((s) => s + 1);
  }
  async function submit() {
    if (!(await form.trigger())) return;
    setBusy(true);
    const v = form.getValues();
    setDone(await createEnquiry({ ...v, styles: v.styles as TravelStyle[] }));
    setBusy(false);
  }

  if (done)
    return (
      <div className="rounded-3xl border bg-card p-8 text-center sm:p-12">
        <CheckCircle2 className="mx-auto size-14 text-brand" />
        <h2 className="mt-5 text-5xl font-extrabold">Quote request sent</h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">A planner will review it and get in touch with a personal itinerary and price. Nothing has been charged.</p>
        <button className="mx-auto mt-7 inline-flex items-center gap-2 rounded-2xl bg-secondary px-5 py-3 font-display text-3xl font-extrabold text-secondary-foreground" onClick={() => { navigator.clipboard?.writeText(done.reference); toast.success("Reference copied"); }}>
          {done.reference} <Copy className="size-4" />
        </button>
        <div className="mt-8"><LinkButton href="/packages" variant="outline" className="h-11 rounded-full px-6">Browse holidays meanwhile</LinkButton></div>
      </div>
    );

  return (
    <div className="rounded-3xl border bg-card p-6 sm:p-10">
      <div className="mb-8 flex items-center gap-3" aria-label={`Step ${step + 1} of 3`}>
        {[0, 1, 2].map((i) => <span key={i} className={cn("h-1.5 flex-1 rounded-full", i <= step ? "bg-primary" : "bg-muted")} />)}
      </div>
      <h2 className="mb-7 text-4xl font-extrabold sm:text-5xl">{titles[step]}</h2>

      <form onSubmit={(e) => e.preventDefault()} noValidate className="grid gap-5 sm:grid-cols-2">
        {step === 0 && (
          <>
            <div className="sm:col-span-2"><Field label="Destination(s) or idea" error={errors.destinations?.message}><Input placeholder="e.g. Bali, or 'somewhere with mountains'" {...register("destinations")} /></Field></div>
            <Field label="Travel dates"><Input placeholder="e.g. 10–17 December" {...register("dates")} /></Field>
            <label className="flex items-center gap-2.5 self-end pb-2.5 text-sm"><input type="checkbox" className="size-4 accent-[var(--primary)]" {...register("flexibleDates")} /> My dates are flexible</label>
            <div className="sm:col-span-2">
              <Label className="mb-2 block">Kind of trip</Label>
              <Controller control={control} name="styles" render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {styles.map((s) => {
                    const on = field.value.includes(s);
                    return <button key={s} type="button" aria-pressed={on} onClick={() => field.onChange(on ? field.value.filter((x) => x !== s) : [...field.value, s])} className={cn("rounded-full border px-4 py-1.5 text-sm transition", on ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary/50")}>{s}</button>;
                  })}
                </div>
              )} />
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <div className="sm:col-span-2 sm:max-w-sm">
              <Controller control={control} name="travellers" render={({ field }) => <Counter label="Travellers" sub="Including children" value={field.value} min={1} max={60} onChange={field.onChange} />} />
            </div>
            <Field label="Budget per person (optional)"><Input inputMode="numeric" placeholder="e.g. 40000" {...register("budget")} /></Field>
            <Field label="Currency">
              <select className="h-8 w-full rounded-lg border bg-background px-2.5 text-sm" {...register("currency")}>{currencies.map((c) => <option key={c}>{c}</option>)}</select>
            </Field>
            <div className="sm:col-span-2"><Field label="Anything else? (optional)"><Textarea rows={4} placeholder="Occasion, must-dos, dietary needs…" {...register("notes")} /></Field></div>
          </>
        )}
        {step === 2 && (
          <>
            <Field label="Full name" error={errors.name?.message}><Input autoComplete="name" {...register("name")} /></Field>
            <Field label="Email" error={errors.email?.message}><Input type="email" autoComplete="email" {...register("email")} /></Field>
            <Field label="Phone / WhatsApp" error={errors.phone?.message}><Input type="tel" autoComplete="tel" {...register("phone")} /></Field>
            <Field label="Departure city" error={errors.departureCity?.message}><Input {...register("departureCity")} /></Field>
            <Field label="Country of residence" error={errors.departureCountry?.message}><Input {...register("departureCountry")} /></Field>
          </>
        )}
      </form>

      <div className="mt-10 flex items-center justify-between">
        <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}><ArrowLeft /> Back</Button>
        {step < 2 ? <Button size="lg" className="h-11 rounded-full px-6" onClick={next}>Continue <ArrowRight /></Button> : <Button size="lg" className="h-11 rounded-full px-6" disabled={busy} onClick={submit}>{busy ? "Sending…" : "Request my quote"}</Button>}
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (<div className="space-y-1.5"><Label>{label}</Label>{children}{error && <p role="alert" className="text-xs text-destructive">{error}</p>}</div>);
}
