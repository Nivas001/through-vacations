"use client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, Check, CircleAlert, Clock, KeyRound, LogOut, MapPin, MessageCircle, Phone, Plane, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { findTrip, useDb, useHydrated } from "@/lib/data/store";
import { packages as catalogue } from "@/lib/mock/packages";
import { paperwork, packing } from "@/lib/shaper";
import { formatINR, tel } from "@/lib/site";
import type { Booking, Enquiry } from "@/lib/types";
import { cn } from "@/lib/utils";

const KEY = "tv-my-trip";
const long = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" });

/** Customer sign-in with booking reference + phone or email, then a personal trip page. */
export function MyTrip() {
  const params = useSearchParams();
  const hydrated = useHydrated();
  useDb(); // re-render when records change, e.g. the team marks a payment
  const [creds, setCreds] = useState<{ ref: string; contact: string } | null>(null);
  const [ref, setRef] = useState(params.get("ref") ?? "");
  const [contact, setContact] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(KEY) ?? "null");
      // Restoring the signed-in trip for this tab from sessionStorage on mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved?.ref) setCreds(saved);
    } catch {}
  }, []);

  const found = hydrated && creds ? findTrip(creds.ref, creds.contact) : null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!ref.trim() || !contact.trim()) return setError("Enter your booking reference and the phone number or email you used.");
    setBusy(true);
    await new Promise((r) => setTimeout(r, 350));
    setBusy(false);
    if (!findTrip(ref, contact)) return setError("We could not find a trip with those details. Check the reference (for example TV-8K2QF or Q-8K3AB) and use the same phone number or email.");
    const c = { ref: ref.trim().toUpperCase(), contact: contact.trim() };
    setCreds(c);
    try { sessionStorage.setItem(KEY, JSON.stringify(c)); } catch {}
  }

  function signOut() {
    setCreds(null);
    setContact("");
    try { sessionStorage.removeItem(KEY); } catch {}
  }

  if (found) return found.kind === "booking" ? <BookingView b={found.row} onSignOut={signOut} /> : <EnquiryView e={found.row} onSignOut={signOut} />;

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 overflow-hidden rounded-[1.75rem] border bg-card lg:grid-cols-2">
      <div className="grain relative hidden min-h-[30rem] bg-primary lg:block">
        <Image src="/media/dubai-2.webp" alt="" fill sizes="40vw" className="object-cover opacity-50 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />
        <div className="absolute inset-x-8 bottom-8 text-white">
          <ul className="space-y-3 text-sm">
            {["See your trip status and dates", "Check payments and what is due", "Message your office in one tap", "Tick off a before-you-go checklist"].map((t) => (
              <li key={t} className="flex items-center gap-2.5"><span className="grid size-6 place-items-center rounded-full bg-sun text-sun-foreground"><Check className="size-3.5" /></span>{t}</li>
            ))}
          </ul>
        </div>
      </div>
      <form onSubmit={submit} noValidate className="p-6 sm:p-10">
        <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-brand"><KeyRound className="size-6" /></span>
        <h2 className="mt-5 text-4xl font-extrabold">Find your trip</h2>
        <p className="mt-2 text-sm text-muted-foreground">Use the reference from your confirmation or quote request, and the phone number or email you gave us.</p>
        <div className="mt-7 grid gap-4">
          <label className="block space-y-1.5"><span className="text-sm font-medium">Booking or quote reference</span>
            <Input className="h-12 font-mono text-base uppercase" placeholder="TV-XXXXXX" value={ref} onChange={(e) => setRef(e.target.value)} autoComplete="off" /></label>
          <label className="block space-y-1.5"><span className="text-sm font-medium">Phone number or email</span>
            <Input className="h-12 text-base" placeholder="+91 or you@email.com" value={contact} onChange={(e) => setContact(e.target.value)} autoComplete="tel" /></label>
          {error && <p role="alert" className="flex gap-2 rounded-xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive"><CircleAlert className="mt-0.5 size-4 shrink-0" />{error}</p>}
          <Button type="submit" size="lg" className="h-12 rounded-full text-base" disabled={busy}>{busy ? "Looking…" : <>View my trip <ArrowRight /></>}</Button>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">Lost your reference? <a href={tel()} className="font-semibold text-brand">Call us</a> or message us on WhatsApp and we will find it.</p>
      </form>
    </div>
  );
}

const steps = ["Requested", "Confirmed", "Paid", "Travelling", "Home"] as const;

function stepOf(b: Booking, today: string) {
  if (b.status === "completed") return 4;
  const pkg = catalogue.find((p) => p.slug === b.packageSlug);
  const end = new Date(new Date(b.startDate).getTime() + (pkg?.nights ?? 0) * 864e5).toISOString().slice(0, 10);
  if (b.startDate <= today && today <= end && ["confirmed", "paid"].includes(b.status)) return 3;
  if (b.status === "paid") return 2;
  if (b.status === "confirmed") return 1;
  return 0;
}

function BookingView({ b, onSignOut }: { b: Booking; onSignOut: () => void }) {
  const db = useDb();
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
  const pkg = (db.packages ?? catalogue).find((p) => p.slug === b.packageSlug) ?? catalogue.find((p) => p.slug === b.packageSlug);
  const office = db.branches.find((x) => x.id === b.branch) ?? db.branches[0];
  const paid = (b.payments ?? []).reduce((n, p) => n + p.amount, 0);
  const due = Math.max(0, (b.estimate ?? 0) - paid);
  const days = Math.ceil((new Date(b.startDate).getTime() - new Date(today).getTime()) / 864e5);
  const step = stepOf(b, today);
  const cancelled = b.status === "cancelled";
  const [ticked, setTicked] = useState<Record<string, boolean>>({});
  const list = pkg ? [...paperwork(pkg), ...packing(pkg, new Date(b.startDate).getMonth() + 1)].slice(0, 8) : [];
  const wa = (t: string) => `https://wa.me/${office.whatsapp}?text=${encodeURIComponent(t)}`;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-primary text-white">
        {pkg && <Image src={pkg.image} alt="" fill priority sizes="100vw" className="object-cover opacity-40" />}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent" />
        <div className="relative flex flex-wrap items-end justify-between gap-6 p-6 sm:p-10">
          <div>
            <p className="font-mono text-sm text-white/80">{b.reference}</p>
            <h2 className="mt-1 text-4xl leading-none font-extrabold sm:text-6xl">{b.packageTitle}</h2>
            <p className="mt-3 text-white/85">Hi {b.lead.name.split(/[\s&]/)[0]}, here is everything about your trip.</p>
          </div>
          <div className="rounded-2xl bg-white/15 px-5 py-4 text-center backdrop-blur">
            {cancelled ? <p className="font-display text-2xl font-extrabold">Cancelled</p> : days > 0 ? <><p className="font-display text-5xl leading-none font-extrabold">{days}</p><p className="mt-1 text-xs font-bold tracking-widest uppercase">days to go</p></> : <p className="font-display text-2xl font-extrabold">{step >= 4 ? "Welcome back" : "Have a great trip"}</p>}
          </div>
        </div>
      </div>

      {!cancelled && (
        <ol className="grid grid-cols-5 gap-1 rounded-2xl border bg-card p-3 sm:p-4" aria-label="Trip progress">
          {steps.map((s, i) => (
            <li key={s} aria-current={i === step ? "step" : undefined} className="flex flex-col items-center gap-1.5 text-center">
              <span className={cn("grid size-8 place-items-center rounded-full text-xs font-bold transition sm:size-10", i < step ? "bg-emerald-500 text-white" : i === step ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : "bg-muted text-muted-foreground")}>{i < step ? <Check className="size-4" /> : i + 1}</span>
              <span className={cn("text-[0.65rem] font-semibold sm:text-xs", i > step && "text-muted-foreground")}>{s}</span>
            </li>
          ))}
        </ol>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <section className="rounded-2xl border bg-card p-5 sm:p-6">
            <h3 className="text-xl font-extrabold">Trip details</h3>
            <dl className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <Row icon={CalendarDays} k="Starts" v={long(b.startDate)} />
              <Row icon={Clock} k="Length" v={pkg?.durationLabel ?? "As quoted"} />
              <Row icon={Users} k="Travellers" v={`${b.adults} adult${b.adults > 1 ? "s" : ""}${b.children ? `, ${b.children} child${b.children > 1 ? "ren" : ""}` : ""} · ${b.rooms} room${b.rooms > 1 ? "s" : ""}`} />
              <Row icon={MapPin} k="Looked after by" v={`${office.name} office`} />
            </dl>
            {pkg && <Link href={`/packages/${pkg.slug}`} className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand hover:underline">See the day-by-day plan <ArrowRight className="size-4" /></Link>}
          </section>

          {!!list.length && !cancelled && (
            <section className="rounded-2xl border bg-card p-5 sm:p-6">
              <h3 className="text-xl font-extrabold">Before you go</h3>
              <p className="mt-1 text-sm text-muted-foreground">A quick checklist for this trip. Ticks are saved on this page only.</p>
              <ul className="mt-4 grid gap-2.5 text-sm sm:grid-cols-2">
                {list.map((x) => (
                  <li key={x}><label className="flex cursor-pointer items-start gap-3"><input type="checkbox" checked={!!ticked[x]} onChange={() => setTicked((t) => ({ ...t, [x]: !t[x] }))} className="mt-0.5 size-4 shrink-0 accent-[var(--primary)]" /><span className={cn(ticked[x] && "text-muted-foreground line-through")}>{x}</span></label></li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border bg-card p-5 sm:p-6">
            <h3 className="flex items-center gap-2 text-xl font-extrabold"><Wallet className="size-5 text-brand" /> Payments</h3>
            {b.estimate ? (
              <>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {[["Total", formatINR(b.estimate)], ["Paid", formatINR(paid)], ["Due", due ? formatINR(due) : "Nil"]].map(([k, v]) => (
                    <div key={k} className={cn("min-w-0 rounded-xl bg-muted px-2 py-3", k === "Due" && (due ? "bg-amber-500/12" : "bg-emerald-500/12"))}><p className="truncate text-sm font-bold tabular-nums">{v}</p><p className="text-xs text-muted-foreground">{k}</p></div>
                  ))}
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, (paid / b.estimate) * 100)}%` }} /></div>
                {!!b.payments?.length && (
                  <ul className="mt-4 divide-y text-sm">
                    {b.payments.map((p) => <li key={p.id} className="flex justify-between gap-3 py-2"><span className="text-muted-foreground">{new Date(p.at).toLocaleDateString("en-IN", { dateStyle: "medium" })}{p.note ? ` · ${p.note}` : ""}</span><span className="font-semibold tabular-nums">{formatINR(p.amount)}</span></li>)}
                  </ul>
                )}
                {due > 0 && !cancelled && <a href={wa(`Hi! I would like to pay the balance of ${formatINR(due)} for ${b.reference}. Please share the payment details.`)} target="_blank" rel="noreferrer" className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground transition hover:bg-sun hover:text-sun-foreground">Ask for payment details</a>}
              </>
            ) : <p className="mt-3 text-sm text-muted-foreground">Your price is being finalised. Your planner will share it with you.</p>}
          </section>

          <section className="rounded-2xl bg-ink p-5 text-white sm:p-6">
            <h3 className="text-xl font-extrabold">Need anything?</h3>
            <p className="mt-1 text-sm text-white/75">The {office.name} office looks after this trip. {office.hours}.</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <a href={wa(`Hi! A question about my trip ${b.reference}.`)} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-bold"><MessageCircle className="size-4" /> WhatsApp</a>
              <a href={tel(office.phone)} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-white text-sm font-bold"><Phone className="size-4" /> Call</a>
            </div>
          </section>

          <button type="button" onClick={onSignOut} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><LogOut className="size-4" /> Sign out of this trip</button>
        </div>
      </div>
    </div>
  );
}

const enquirySteps: Record<Enquiry["status"], { label: string; note: string }> = {
  new: { label: "Received", note: "Your request is with our planners. Expect a call or WhatsApp message soon." },
  contacted: { label: "Planning", note: "A planner has been in touch and is putting options together." },
  quoted: { label: "Quote sent", note: "Your quote has been shared. Reply any time to change dates, hotels or budget." },
  won: { label: "Booked", note: "This request became a booking. Use your booking reference to see the trip." },
  closed: { label: "Closed", note: "This request is closed. Send a new one whenever you are ready." },
};

function EnquiryView({ e, onSignOut }: { e: Enquiry; onSignOut: () => void }) {
  const db = useDb();
  const office = db.branches.find((x) => x.id === e.branch) ?? db.branches[0];
  const s = enquirySteps[e.status];
  const order: Enquiry["status"][] = ["new", "contacted", "quoted", "won"];
  const at = Math.max(0, order.indexOf(e.status));
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="rounded-[1.75rem] bg-primary p-6 text-white sm:p-10">
        <p className="font-mono text-sm text-white/80">{e.reference}</p>
        <h2 className="mt-1 text-4xl leading-none font-extrabold sm:text-5xl">{e.destinations}</h2>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-sun px-3.5 py-1.5 text-sm font-bold text-sun-foreground"><Plane className="size-4" /> {s.label}</p>
        <p className="mt-4 max-w-lg text-white/85">{s.note}</p>
      </section>
      {e.status !== "closed" && (
        <ol className="grid grid-cols-4 gap-1 rounded-2xl border bg-card p-4" aria-label="Request progress">
          {order.map((k, i) => (
            <li key={k} className="flex flex-col items-center gap-1.5 text-center">
              <span className={cn("grid size-9 place-items-center rounded-full text-xs font-bold", i < at ? "bg-emerald-500 text-white" : i === at ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : "bg-muted text-muted-foreground")}>{i < at ? <Check className="size-4" /> : i + 1}</span>
              <span className="text-xs font-semibold">{enquirySteps[k].label}</span>
            </li>
          ))}
        </ol>
      )}
      <section className="rounded-2xl border bg-card p-5 sm:p-6">
        <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <Row icon={CalendarDays} k="When" v={`${e.dates || "To be decided"}${e.flexibleDates ? " (flexible)" : ""}`} />
          <Row icon={Users} k="Travellers" v={String(e.travellers)} />
          <Row icon={Wallet} k="Budget per person" v={e.budget ? `${e.budget} ${e.currency}` : "Not given"} />
          <Row icon={MapPin} k="Looked after by" v={`${office.name} office`} />
        </dl>
        <div className="mt-5 flex flex-wrap gap-2">
          <a href={`https://wa.me/${office.whatsapp}?text=${encodeURIComponent(`Hi! About my request ${e.reference}.`)}`} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-bold text-white"><MessageCircle className="size-4" /> WhatsApp the {office.name} office</a>
          <button type="button" onClick={onSignOut} className="inline-flex h-10 items-center gap-2 px-3 text-sm text-muted-foreground hover:text-foreground"><LogOut className="size-4" /> Sign out</button>
        </div>
      </section>
    </div>
  );
}

function Row({ icon: Icon, k, v }: { icon: React.ComponentType<{ className?: string }>; k: string; v: string }) {
  return (
    <div className="flex gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-brand"><Icon className="size-4" /></span>
      <span className="min-w-0"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-semibold">{v}</dd></span>
    </div>
  );
}
