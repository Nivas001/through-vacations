"use client";
import { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import { formatINR, siteDefaults } from "@/lib/site";
import type { Booking, Enquiry } from "@/lib/types";
import { balanceOf } from "./payments";
import { labelCls, when } from "./ui";

const wa = (phone: string, text: string) => `https://wa.me/${phone.replace(/\D/g, "").replace(/^0+/, "")}?text=${encodeURIComponent(text)}`;
const first = (name: string) => name.split(/[\s&]/)[0];

export function bookingTemplates(b: Booking): { label: string; text: string }[] {
  const n = first(b.lead.name);
  const due = balanceOf(b);
  return [
    { label: "Booking confirmed", text: `Hi ${n}, your ${b.packageTitle} trip starting ${when(b.startDate)} is confirmed. Booking reference ${b.reference}. We will share hotel and transfer details closer to the date. Thank you for travelling with Through Vacations!` },
    { label: "Payment reminder", text: `Hi ${n}, a gentle reminder that ${due ? formatINR(due) : "the balance"} is due for your ${b.packageTitle} trip (${b.reference}). You can pay by UPI or bank transfer. Reply here if you need the details again.` },
    { label: "Documents ready", text: `Hi ${n}, your travel documents for ${b.packageTitle} are ready: vouchers, itinerary and contacts. Shall we send them here on WhatsApp or by email?` },
    { label: "Before you fly", text: `Hi ${n}, your ${b.packageTitle} trip is coming up on ${when(b.startDate)}! Please carry your ID${b.addOns.includes("visa") ? ", passport and visa" : ""}, keep our number ${siteDefaults.phone} handy, and message us any time during the trip.` },
    { label: "Welcome back", text: `Welcome back, ${n}! We hope ${b.packageTitle} was wonderful. We would love to hear how it went, and a few photos for our Instagram if you are happy to share.` },
  ];
}

export function enquiryTemplates(e: Enquiry): { label: string; text: string }[] {
  const n = first(e.name);
  return [
    { label: "Got your request", text: `Hi ${n}, thanks for your request for ${e.destinations} (${e.reference}). I am putting a few options together and will share them shortly.` },
    { label: "A few questions", text: `Hi ${n}, to plan ${e.destinations} well, could you confirm your preferred dates, the number of adults and children, and the kind of hotel you like?` },
    { label: "Quote follow-up", text: `Hi ${n}, just checking whether you had a chance to look at the ${e.destinations} quote. Happy to adjust dates, hotels or budget.` },
  ];
}

/** One-tap WhatsApp messages, filled in with the customer's trip details. */
export function MessageTemplates({ phone, templates }: { phone: string; templates: { label: string; text: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center justify-between gap-2 p-3 text-left">
        <span className={labelCls + " mb-0 flex items-center gap-1.5"}><MessageCircle className="size-3.5 text-[#25D366]" /> WhatsApp templates</span>
        <ChevronDown className={"size-4 text-muted-foreground transition " + (open ? "rotate-180" : "")} />
      </button>
      {open && (
        <ul className="grid gap-1.5 px-3 pb-3">
          {templates.map((t) => (
            <li key={t.label}>
              <a href={wa(phone, t.text)} target="_blank" rel="noreferrer" className="block rounded-lg bg-muted px-3 py-2 transition hover:bg-secondary">
                <span className="block text-sm font-semibold">{t.label}</span>
                <span className="line-clamp-2 text-xs text-muted-foreground">{t.text}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
