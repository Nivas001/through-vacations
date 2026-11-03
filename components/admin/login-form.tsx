"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/brand/logo";
import { demoAccounts, signIn, useSession } from "@/lib/admin-auth";

export function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get("next") ?? "/admin";
  const session = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const dest = next.startsWith("/admin") ? next : "/admin";

  useEffect(() => {
    if (session) router.replace(dest);
  }, [session, dest, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const s = await signIn(email, password);
    setBusy(false);
    if (!s) setError("That email and password do not match a desk account.");
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <div className="grain relative hidden overflow-hidden bg-primary lg:block">
        <Image src="/media/maldives-2.webp" alt="" fill priority sizes="50vw" className="object-cover opacity-45 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Logo light />
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-sun px-3.5 py-1.5 text-[0.7rem] font-bold tracking-[0.18em] text-sun-foreground uppercase">Travel desk</p>
            <h1 className="max-w-md text-6xl leading-[0.95] font-extrabold">Every trip, from <span className="accent-word text-sun">both offices</span>.</h1>
            <p className="mt-5 max-w-md text-white/80">Bookings, quote requests, messages and holidays for Pondicherry and Chennai in one place.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center px-5 py-10 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10 lg:hidden"><Logo /></div>
          <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-brand"><LockKeyhole className="size-6" /></span>
          <h2 className="mt-5 text-4xl font-extrabold">Sign in</h2>
          <p className="mt-2 text-sm text-muted-foreground">Staff access for the Through Vacations travel desk.</p>

          <form onSubmit={submit} className="mt-8 grid gap-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="username" className="h-11" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={show ? "text" : "password"} autoComplete="current-password" className="h-11 pr-11" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            {error && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
            <Button type="submit" size="lg" className="h-11 rounded-full" disabled={busy || !email || !password}>{busy ? "Signing in…" : "Sign in"}</Button>
          </form>

          <div className="mt-8 rounded-2xl border border-dashed bg-card p-4">
            <p className="flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-muted-foreground uppercase"><Sparkles className="size-3.5 text-brand" /> Demo accounts</p>
            <ul className="mt-3 grid gap-2">
              {demoAccounts.map((a) => (
                <li key={a.email}>
                  <button type="button" onClick={() => { setEmail(a.email); setPassword(a.password); setError(""); }} className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition hover:bg-secondary">
                    <span className="min-w-0"><span className="block font-semibold">{a.name}</span><span className="block truncate text-xs text-muted-foreground">{a.email}</span></span>
                    <span className="shrink-0 text-xs font-bold text-brand">Use</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">Preview sign-in. Real accounts arrive with the database.</p>
          </div>

          <Link href="/" className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Back to the website</Link>
        </div>
      </div>
    </div>
  );
}
