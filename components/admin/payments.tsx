"use client";
import { useState } from "react";
import { Plus, Printer, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addPayment, deletePayment, paymentMethods } from "@/lib/data/store";
import { formatINR } from "@/lib/site";
import type { Booking, PaymentMethod } from "@/lib/types";
import { cn } from "@/lib/utils";
import { labelCls, selectCls, when } from "./ui";

export const paidOf = (b: Booking) => (b.payments ?? []).reduce((n, p) => n + p.amount, 0);
export const balanceOf = (b: Booking) => Math.max(0, (b.estimate ?? 0) - paidOf(b));

const methodLabel: Record<PaymentMethod, string> = { upi: "UPI", cash: "Cash", card: "Card", bank: "Bank transfer" };

/** Advance and balance payments against a booking, with what is still due. */
export function PaymentsPanel({ b }: { b: Booking }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [note, setNote] = useState("");
  const paid = paidOf(b);
  const total = b.estimate ?? 0;
  const due = balanceOf(b);
  const pct = total ? Math.min(100, Math.round((paid / total) * 100)) : 0;

  function add(e: React.FormEvent) {
    e.preventDefault();
    const n = Number(amount.replace(/\D/g, ""));
    if (!n) return toast.error("Enter an amount");
    addPayment(b.id, { amount: n, method, note: note.trim() });
    toast.success(`${formatINR(n)} recorded`);
    setAmount("");
    setNote("");
  }

  return (
    <div className="rounded-xl border p-3">
      <div className="flex items-center justify-between gap-2">
        <p className={labelCls + " mb-0"}>Payments</p>
        <a href={`/admin/invoice/${b.id}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"><Printer className="size-3.5" /> Print confirmation</a>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2 text-center">
        {[["Total", total ? formatINR(total) : "—"], ["Paid", formatINR(paid)], ["Due", total ? formatINR(due) : "—"]].map(([k, v]) => (
          <div key={k} className={cn("min-w-0 rounded-lg bg-muted px-2 py-2", k === "Due" && due > 0 && "bg-amber-500/12", k === "Due" && total > 0 && due === 0 && "bg-emerald-500/12")}>
            <p className="truncate text-sm font-bold tabular-nums">{v}</p><p className="text-[0.7rem] text-muted-foreground">{k}</p>
          </div>
        ))}
      </div>
      {total > 0 && <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted" role="img" aria-label={`${pct}% paid`}><div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} /></div>}
      {!!b.payments?.length && (
        <ul className="mt-3 divide-y text-sm">
          {b.payments.map((p) => (
            <li key={p.id} className="flex items-center gap-2 py-2">
              <span className="min-w-0 flex-1"><span className="block font-semibold tabular-nums">{formatINR(p.amount)}</span><span className="block truncate text-xs text-muted-foreground">{methodLabel[p.method]} · {when(p.at)}{p.note ? ` · ${p.note}` : ""}</span></span>
              <Button variant="ghost" size="icon-sm" aria-label="Remove payment" onClick={() => { deletePayment(b.id, p.id); toast.success("Payment removed"); }}><Trash2 /></Button>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={add} className="mt-3 grid grid-cols-[1fr_auto] gap-2">
        <Input inputMode="numeric" placeholder={due ? `Amount, e.g. ${due}` : "Amount (₹)"} aria-label="Payment amount" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))} />
        <select aria-label="Payment method" className={selectCls + " h-8 normal-case"} value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)}>
          {paymentMethods.map((m) => <option key={m} value={m}>{methodLabel[m]}</option>)}
        </select>
        <Input placeholder="Note (optional), e.g. advance" aria-label="Payment note" value={note} onChange={(e) => setNote(e.target.value)} />
        <Button type="submit" size="sm" className="h-8"><Plus /> Add</Button>
      </form>
    </div>
  );
}
