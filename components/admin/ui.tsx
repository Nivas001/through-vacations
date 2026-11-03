"use client";
import { Mail, MessageCircle, Phone, Search, X } from "lucide-react";
import { branchName } from "@/lib/site";
import type { Activity, BranchId } from "@/lib/types";
import { cn } from "@/lib/utils";

export const when = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { dateStyle: "medium" });
export const whenTime = (iso: string) => new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

export function ago(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)}d ago`;
  return when(iso);
}

const sourceLabels: Record<string, string> = { website: "Website", "walk-in": "Walk-in", phone: "Phone", whatsapp: "WhatsApp", instagram: "Instagram", referral: "Referral" };
export const sourceLabel = (s?: string) => sourceLabels[s ?? "website"] ?? s ?? "Website";

export const selectCls = "h-9 rounded-lg border bg-background px-2.5 text-sm capitalize outline-none focus-visible:ring-3 focus-visible:ring-ring/50";
export const labelCls = "mb-1.5 block text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase";

export function PageHeader({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1>
        {sub && <p className="mt-1.5 text-sm text-muted-foreground">{sub}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

export function SearchBox({ value, onChange, placeholder = "Search" }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="relative block min-w-0 flex-1 sm:max-w-xs">
      <span className="sr-only">{placeholder}</span>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="h-9 w-full rounded-lg border bg-background pr-8 pl-9 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-search-cancel-button]:hidden" />
      {value && <button type="button" onClick={() => onChange("")} aria-label="Clear search" className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="size-4" /></button>}
    </label>
  );
}

/** Status chips with counts; doubles as the filter. */
export function StatusTabs<T extends string>({ options, value, onChange, counts }: { options: T[]; value: T | "all"; onChange: (v: T | "all") => void; counts: Record<string, number> }) {
  const all = Object.values(counts).reduce((a, b) => a + b, 0);
  return (
    <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="group" aria-label="Filter by status">
      {(["all", ...options] as (T | "all")[]).map((o) => (
        <button key={o} type="button" onClick={() => onChange(o)} aria-pressed={value === o}
          className={cn("flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-bold capitalize transition", value === o ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary/50")}>
          {o}<span className={cn("rounded-full px-1.5 tabular-nums", value === o ? "bg-white/20" : "bg-muted text-muted-foreground")}>{o === "all" ? all : counts[o] ?? 0}</span>
        </button>
      ))}
    </div>
  );
}

export function BranchBadge({ branch, className }: { branch?: BranchId; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.7rem] font-bold whitespace-nowrap", branch === "chennai" ? "bg-sky-500/15 text-sky-700 dark:text-sky-300" : branch === "pondicherry" ? "bg-violet-500/15 text-violet-700 dark:text-violet-300" : "bg-muted text-muted-foreground", className)}>
      <span className={cn("size-1.5 rounded-full", branch === "chennai" ? "bg-sky-500" : branch === "pondicherry" ? "bg-violet-500" : "bg-muted-foreground")} />
      {branchName(branch)}
    </span>
  );
}

const waNumber = (phone: string) => phone.replace(/[^\d]/g, "").replace(/^0+/, "");

export function ContactActions({ name, phone, email, message }: { name: string; phone: string; email: string; message: string }) {
  const first = name.split(/[\s&]/)[0];
  const items = [
    { icon: MessageCircle, label: "WhatsApp", href: `https://wa.me/${waNumber(phone)}?text=${encodeURIComponent(`Hi ${first}, ${message}`)}`, cls: "bg-[#25D366] text-white hover:bg-[#1ebe5a]" },
    { icon: Phone, label: "Call", href: `tel:${phone.replace(/\s/g, "")}`, cls: "bg-secondary text-secondary-foreground hover:bg-secondary/70" },
    { icon: Mail, label: "Email", href: `mailto:${email}?subject=${encodeURIComponent("Your Through Vacations trip")}&body=${encodeURIComponent(`Hi ${first},\n\n${message}\n\nThrough Vacations`)}`, cls: "bg-secondary text-secondary-foreground hover:bg-secondary/70" },
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map(({ icon: Icon, label, href, cls }) => (
        <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={cn("flex h-10 items-center justify-center gap-1.5 rounded-xl text-sm font-bold transition", cls)}>
          <Icon className="size-4" /> {label}
        </a>
      ))}
    </div>
  );
}

export function Timeline({ items }: { items?: Activity[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <p className={labelCls}>Activity</p>
      <ol className="relative ml-1.5 space-y-3 border-l pl-4">
        {[...items].reverse().map((a, i) => (
          <li key={`${a.at}-${i}`} className="relative text-sm">
            <span className="absolute top-1.5 -left-[1.36rem] size-2.5 rounded-full border-2 border-background bg-primary" />
            <p className="font-medium">{a.text}</p>
            <p className="text-xs text-muted-foreground">{whenTime(a.at)}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Detail({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
      {rows.map(([k, v]) => (
        <div key={k} className="min-w-0">
          <dt className="text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase">{k}</dt>
          <dd className="mt-0.5 font-medium break-words">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Empty({ title, sub, icon: Icon }: { title: string; sub?: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed bg-card px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-brand"><Icon className="size-6" /></span>
      <p className="mt-4 font-semibold">{title}</p>
      {sub && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function Kpi({ icon: Icon, label, value, hint, tone = "brand" }: { icon: React.ComponentType<{ className?: string }>; label: string; value: React.ReactNode; hint?: string; tone?: "brand" | "sun" | "rose" | "emerald" }) {
  const tones = { brand: "bg-secondary text-brand", sun: "bg-sun/25 text-amber-700 dark:text-sun", rose: "bg-rose-500/12 text-rose-600 dark:text-rose-300", emerald: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300" };
  return (
    <div className="min-w-0 rounded-2xl border bg-card p-4 sm:p-5">
      <span className={cn("grid size-10 place-items-center rounded-xl", tones[tone])}><Icon className="size-5" /></span>
      <p className="mt-4 truncate font-display text-3xl font-extrabold sm:text-4xl">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function sortBy<T>(rows: T[], key: (r: T) => string | number, dir: "asc" | "desc") {
  return [...rows].sort((a, b) => {
    const x = key(a), y = key(b);
    return (x < y ? -1 : x > y ? 1 : 0) * (dir === "asc" ? 1 : -1);
  });
}
