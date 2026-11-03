"use client";
import { useState } from "react";
import { ArrowRight, CircleDashed, Database, Download, ExternalLink, Mail, Megaphone, RotateCcw, ShieldCheck, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { demoAccounts, useSession } from "@/lib/admin-auth";
import { exportBackup, resetDemo, saveAnnouncement, saveSettings, useDb, useHydrated } from "@/lib/data/store";
import type { Announcement, SiteSettings } from "@/lib/types";
import { PageHeader } from "./ui";

const labels: Record<keyof SiteSettings, string> = { headline: "Homepage headline", intro: "Intro text", email: "Public email", phone: "Phone", whatsapp: "WhatsApp number (digits, with country code)", instagram: "Instagram URL", location: "Head office location" };

export function SettingsForm() {
  const { settings, announcement } = useDb();
  const hydrated = useHydrated();
  const session = useSession();
  return (
    <div>
      <PageHeader title="Settings" sub="Business details, data and the team." />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-6">
        <section className="rounded-2xl border bg-card p-5">
          <h2 className="flex items-center gap-2 font-sans text-sm font-extrabold"><Megaphone className="size-4 text-brand" /> Offer banner</h2>
          <p className="mb-5 text-xs text-muted-foreground">A strip across the top of every page for offers and news. Visitors can dismiss it.</p>
          {hydrated ? <BannerEditor key={JSON.stringify(announcement)} initial={announcement} /> : <Skeleton className="h-48" />}
        </section>
        <section className="rounded-2xl border bg-card p-5">
          <h2 className="font-sans text-sm font-extrabold">Business details</h2>
          <p className="mb-5 text-xs text-muted-foreground">Used across the website once the database is connected.</p>
          {hydrated ? <Details key={JSON.stringify(settings)} initial={settings} /> : <Skeleton className="h-96" />}
        </section>
        </div>
        <div className="space-y-6">
          <section className="rounded-2xl border bg-card p-5">
            <h2 className="font-sans text-sm font-extrabold">Data</h2>
            <p className="mt-1 text-xs text-muted-foreground">Demo records live in this browser. Download a copy any time.</p>
            <div className="mt-4 grid gap-2">
              <Button variant="outline" className="justify-start" onClick={() => {
                const url = URL.createObjectURL(new Blob([exportBackup()], { type: "application/json" }));
                Object.assign(document.createElement("a"), { href: url, download: `through-vacations-backup-${new Date().toISOString().slice(0, 10)}.json` }).click();
                URL.revokeObjectURL(url);
              }}><Download /> Download backup</Button>
              {session?.role === "owner" && <ResetButton />}
            </div>
          </section>
          <section className="rounded-2xl border bg-card p-5">
            <h2 className="font-sans text-sm font-extrabold">Team</h2>
            <ul className="mt-3 divide-y text-sm">
              {demoAccounts.map((a) => (
                <li key={a.email} className="flex items-center gap-3 py-2.5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">{a.name.slice(0, 1)}</span>
                  <span className="min-w-0 flex-1"><span className="block font-medium">{a.name}</span><span className="block truncate text-xs text-muted-foreground">{a.email}</span></span>
                  {session?.email === a.email && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-brand">You</span>}
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-2xl border bg-card p-5">
            <h2 className="font-sans text-sm font-extrabold">Coming with the database</h2>
            <ul className="mt-3 space-y-3 text-sm">
              {[
                { icon: Database, t: "Shared records", d: "Both offices see the same bookings in real time, on any device." },
                { icon: ShieldCheck, t: "Real staff sign-in", d: "Personal accounts with office-level access." },
                { icon: Mail, t: "Email alerts", d: "A message to the right office for every new request." },
                { icon: Wallet, t: "Online payments", d: "Optional advance payments with receipts." },
              ].map(({ icon: Icon, t, d }) => (
                <li key={t} className="flex gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground"><Icon className="size-4" /></span>
                  <span><span className="flex items-center gap-2 font-medium">{t}<CircleDashed className="size-3.5 text-muted-foreground" /></span><span className="text-xs text-muted-foreground">{d}</span></span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function Details({ initial }: { initial: SiteSettings }) {
  const [s, setS] = useState(initial);
  const dirty = JSON.stringify(s) !== JSON.stringify(initial);
  return (
    <form className="grid gap-4" onSubmit={(e) => { e.preventDefault(); saveSettings(s); toast.success("Settings saved"); }}>
      {(Object.keys(labels) as (keyof SiteSettings)[]).map((k) => (
        <div key={k} className="space-y-1.5"><Label htmlFor={k}>{labels[k]}</Label>
          {k === "intro" ? <Textarea id={k} rows={3} value={s[k]} onChange={(e) => setS({ ...s, [k]: e.target.value })} /> : <Input id={k} value={s[k]} onChange={(e) => setS({ ...s, [k]: e.target.value })} />}
        </div>
      ))}
      <div className="flex gap-2"><Button type="submit" disabled={!dirty}>Save settings</Button>{dirty && <Button type="button" variant="ghost" onClick={() => setS(initial)}>Discard</Button>}</div>
    </form>
  );
}

function BannerEditor({ initial }: { initial: Announcement }) {
  const [a, setA] = useState(initial);
  const dirty = JSON.stringify(a) !== JSON.stringify(initial);
  const set = <K extends keyof Announcement>(k: K, v: Announcement[K]) => setA((x) => ({ ...x, [k]: v }));
  return (
    <form className="grid gap-4" onSubmit={(e) => { e.preventDefault(); saveAnnouncement(a); toast.success(a.enabled ? "Banner is live on the website" : "Banner saved (hidden)"); }}>
      <label className="flex items-center justify-between gap-3 rounded-xl bg-muted px-3 py-2.5 text-sm font-medium">Show on the website <Switch checked={a.enabled} onCheckedChange={(v) => set("enabled", v)} /></label>
      <label className="block space-y-1.5"><span className="text-sm font-medium">Message</span><Textarea rows={2} maxLength={140} value={a.text} onChange={(e) => set("text", e.target.value)} /><span className="block text-right text-xs text-muted-foreground">{a.text.length}/140</span></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5"><span className="text-sm font-medium">Button text</span><Input value={a.cta} onChange={(e) => set("cta", e.target.value)} placeholder="Get a quote" /></label>
        <label className="block space-y-1.5"><span className="text-sm font-medium">Button link</span><Input value={a.href} onChange={(e) => set("href", e.target.value)} placeholder="/plan or /packages/kashmir" /></label>
      </div>
      <div>
        <p className="mb-1.5 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">Preview</p>
        <div className={"flex items-center gap-3 rounded-xl bg-ink px-4 py-2.5 text-sm text-white " + (a.enabled ? "" : "opacity-50")}>
          <Megaphone className="size-4 shrink-0 text-sun" /><span className="min-w-0 flex-1">{a.text || "Your message"}</span>
          {a.href && <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-sun px-3 py-1 text-xs font-bold text-sun-foreground">{a.cta || "Learn more"} <ArrowRight className="size-3.5" /></span>}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" disabled={!dirty}>Save banner</Button>
        <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">View website <ExternalLink className="size-3.5" /></a>
      </div>
    </form>
  );
}

function ResetButton() {
  const [armed, setArmed] = useState(false);
  return armed ? (
    <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-3 text-sm">
      <p>Replace everything in this browser with fresh demo data?</p>
      <div className="mt-2 flex gap-2"><Button size="sm" variant="destructive" onClick={() => { resetDemo(); setArmed(false); toast.success("Demo data restored"); }}>Reset</Button><Button size="sm" variant="ghost" onClick={() => setArmed(false)}>Cancel</Button></div>
    </div>
  ) : (
    <Button variant="ghost" className="justify-start text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setArmed(true)}><RotateCcw /> Reset demo data</Button>
  );
}
