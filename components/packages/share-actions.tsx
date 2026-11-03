"use client";
import { useEffect } from "react";
import { Link2, PhoneCall, Printer, Share2 } from "lucide-react";
import { toast } from "sonner";
import { openCallback } from "@/components/contact/callback-dialog";
import { recordView } from "./recently-viewed";

const btn = "inline-flex h-9 items-center gap-1.5 rounded-full border bg-card px-3 text-sm font-semibold transition hover:border-primary hover:text-brand";

/** Share, print and call-back actions for a holiday page. Also records the visit for "recently viewed". */
export function ShareActions({ slug, title }: { slug: string; title: string }) {
  useEffect(() => recordView(slug), [slug]);

  async function share() {
    const url = window.location.href;
    const text = `${title} with Through Vacations`;
    if (navigator.share) {
      try { await navigator.share({ title: text, url }); } catch { /* cancelled */ }
      return;
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text}: ${url}`)}`, "_blank", "noopener");
  }

  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <button type="button" onClick={share} className={btn}><Share2 className="size-4" /> Share</button>
      <button type="button" onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied"); }} className={btn} aria-label="Copy link"><Link2 className="size-4" /><span className="hidden sm:inline">Copy link</span></button>
      <button type="button" onClick={() => window.print()} className={btn} aria-label="Print itinerary"><Printer className="size-4" /><span className="hidden sm:inline">Print</span></button>
      <button type="button" onClick={() => openCallback(title)} className={btn + " border-primary bg-primary text-primary-foreground hover:bg-sun hover:text-sun-foreground"}><PhoneCall className="size-4" /> Call me back</button>
    </div>
  );
}
