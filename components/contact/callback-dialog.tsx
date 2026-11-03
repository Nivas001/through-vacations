"use client";
import { useEffect, useState } from "react";
import { CheckCircle2, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createMessage } from "@/lib/data/store";
import { branchForCity } from "@/lib/site";
import type { BranchId } from "@/lib/types";
import { cn } from "@/lib/utils";

const EVENT = "tv:callback";
/** Opens the call-back form from anywhere; pass what they were looking at. */
export const openCallback = (about?: string) => window.dispatchEvent(new CustomEvent(EVENT, { detail: about }));

const slots = ["Morning", "Afternoon", "Evening"] as const;

export function CallbackButton({ about, className, children }: { about?: string; className?: string; children: React.ReactNode }) {
  return <button type="button" onClick={() => openCallback(about)} className={className}>{children}</button>;
}

export function CallbackDialog() {
  const [open, setOpen] = useState(false);
  const [about, setAbout] = useState<string | undefined>();
  const [done, setDone] = useState(false);
  const [v, setV] = useState({ name: "", phone: "", city: "", slot: "Morning" as (typeof slots)[number], branch: "auto" as BranchId | "auto" });
  const [tried, setTried] = useState(false);

  useEffect(() => {
    const on = (e: Event) => { setAbout((e as CustomEvent<string | undefined>).detail); setDone(false); setTried(false); setOpen(true); };
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);

  const bad = { name: v.name.trim().length < 2, phone: !/^[+\d][\d\s-]{6,}$/.test(v.phone.trim()) };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTried(true);
    if (bad.name || bad.phone) return;
    await createMessage({
      name: v.name.trim(), email: "", phone: v.phone.trim(),
      subject: `Call back request · ${v.slot}`,
      message: `Please call ${v.slot.toLowerCase()}.${about ? ` Interested in ${about}.` : ""}${v.city ? ` Based in ${v.city}.` : ""}`,
      branch: v.branch === "auto" ? branchForCity(v.city) : v.branch,
    });
    setDone(true);
    setV((x) => ({ ...x, name: "", phone: "", city: "" }));
  }

  const err = (k: keyof typeof bad) => (tried && bad[k] ? "border-destructive ring-3 ring-destructive/20" : "");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        {done ? (
          <div className="py-4 text-center">
            <CheckCircle2 className="mx-auto size-12 text-brand" />
            <DialogTitle className="mt-4 font-display text-3xl font-extrabold">We will call you</DialogTitle>
            <DialogDescription className="mt-2">A planner will ring you in the {v.slot.toLowerCase()}, usually within one working day.</DialogDescription>
            <Button className="mt-6 rounded-full px-6" onClick={() => setOpen(false)}>Done</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <span className="grid size-11 place-items-center rounded-2xl bg-secondary text-brand"><PhoneCall className="size-5" /></span>
              <DialogTitle className="mt-2 font-display text-3xl font-extrabold">Request a call back</DialogTitle>
              <DialogDescription>{about ? `About ${about}. ` : ""}Leave your number and a planner will call you, no obligation.</DialogDescription>
            </DialogHeader>
            <form onSubmit={submit} noValidate className="grid gap-4">
              <label className="block space-y-1.5"><span className="text-sm font-medium">Your name</span><Input autoComplete="name" className={"h-11 " + err("name")} value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} /></label>
              <label className="block space-y-1.5"><span className="text-sm font-medium">Phone / WhatsApp</span><Input type="tel" autoComplete="tel" className={"h-11 " + err("phone")} value={v.phone} onChange={(e) => setV({ ...v, phone: e.target.value })} placeholder="+91" />
                {tried && bad.phone && <span role="alert" className="block text-xs text-destructive">Enter a phone number we can reach you on</span>}</label>
              <label className="block space-y-1.5"><span className="text-sm font-medium">City (optional)</span><Input autoComplete="address-level2" className="h-11" value={v.city} onChange={(e) => setV({ ...v, city: e.target.value })} /></label>
              <div role="radiogroup" aria-label="Best time to call">
                <p className="mb-1.5 text-sm font-medium">Best time to call</p>
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((s) => <button key={s} type="button" role="radio" aria-checked={v.slot === s} onClick={() => setV({ ...v, slot: s })} className={cn("h-10 rounded-xl border text-sm font-semibold transition", v.slot === s ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary/50")}>{s}</button>)}
                </div>
              </div>
              <Button type="submit" size="lg" className="h-11 rounded-full">Call me back</Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
