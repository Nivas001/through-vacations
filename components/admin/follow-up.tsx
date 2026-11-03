"use client";
import { BellRing, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { labelCls, when } from "./ui";

const DAY = 864e5;
export const isoDay = (offset: number) => new Date(Date.now() + offset * DAY).toISOString().slice(0, 10);

export type FollowState = "overdue" | "today" | "soon" | "later";
export function followState(date?: string): FollowState | null {
  if (!date) return null;
  const today = isoDay(0);
  if (date < today) return "overdue";
  if (date === today) return "today";
  if (date <= isoDay(7)) return "soon";
  return "later";
}

export function FollowUpBadge({ date, className }: { date?: string; className?: string }) {
  const s = followState(date);
  if (!s || s === "later") return null;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.7rem] font-bold whitespace-nowrap", s === "overdue" ? "bg-rose-500/12 text-rose-600 dark:text-rose-300" : s === "today" ? "bg-amber-500/15 text-amber-700 dark:text-amber-300" : "bg-muted text-muted-foreground", className)}>
      <BellRing className="size-3" />{s === "overdue" ? "Overdue" : s === "today" ? "Call today" : `Follow up ${when(date!)}`}
    </span>
  );
}

/** Pick when to get back to this lead. Shows up on the dashboard on that day. */
export function FollowUpPicker({ value, onChange }: { value?: string; onChange: (date: string | undefined, note: string) => void }) {
  const quick: [string, number][] = [["Tomorrow", 1], ["In 3 days", 3], ["Next week", 7]];
  const set = (d: string | undefined) => {
    onChange(d, d ? `Follow-up set for ${when(d)}` : "Follow-up cleared");
    toast.success(d ? `Reminder set for ${when(d)}` : "Reminder cleared");
  };
  return (
    <div className="rounded-xl border p-3">
      <div className="flex items-center justify-between gap-2"><p className={labelCls + " mb-0"}>Follow up</p><FollowUpBadge date={value} /></div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {quick.map(([label, d]) => (
          <button key={label} type="button" onClick={() => set(isoDay(d))} className={cn("h-8 rounded-full border px-3 text-xs font-semibold transition hover:border-primary", value === isoDay(d) && "border-primary bg-primary text-primary-foreground")}>{label}</button>
        ))}
        <input type="date" aria-label="Follow-up date" value={value ?? ""} min={isoDay(0)} onChange={(e) => set(e.target.value || undefined)} className="h-8 rounded-full border bg-background px-3 text-xs" />
        {value && <button type="button" onClick={() => set(undefined)} aria-label="Clear follow-up" className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-muted"><X className="size-4" /></button>}
      </div>
    </div>
  );
}
