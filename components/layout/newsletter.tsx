"use client";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { addSubscriber } from "@/lib/data/store";
import { emailSchema } from "@/lib/validation";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return setError(parsed.error.issues[0].message);
    setError("");
    setState("busy");
    const added = await addSubscriber(parsed.data);
    setState("done");
    setEmail("");
    toast.success(added ? "You're on the list" : "You're already subscribed");
  }

  return (
    <form onSubmit={submit} noValidate className="w-full max-w-md">
      <label htmlFor="nl-email" className="font-display text-2xl leading-tight font-extrabold">Trip ideas and offers, once a month</label>
      <div className="mt-4 flex gap-2 rounded-full bg-white p-1.5 focus-within:ring-4 focus-within:ring-sun/60">
        <input id="nl-email" type="email" autoComplete="email" placeholder="you@email.com" value={email} onChange={(e) => { setEmail(e.target.value); if (state === "done") setState("idle"); }}
          aria-invalid={!!error} aria-describedby={error ? "nl-error" : undefined}
          className="min-w-0 flex-1 bg-transparent px-4 text-sm text-ink outline-none placeholder:text-ink/45" />
        <button type="submit" disabled={state === "busy"} className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-sun px-4 text-sm font-bold text-sun-foreground transition hover:bg-ink hover:text-white sm:px-5">
          {state === "done" ? <><Check className="size-4" /> Subscribed</> : <>Subscribe <ArrowRight className="size-4" /></>}
        </button>
      </div>
      {error ? <p id="nl-error" role="alert" className="mt-2 text-xs text-sun">{error}</p> : <p className="mt-2 text-xs text-white/60">No spam. Unsubscribe any time.</p>}
    </form>
  );
}
