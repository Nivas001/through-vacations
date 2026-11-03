"use client";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, Megaphone, X } from "lucide-react";
import { useDb } from "@/lib/data/store";

const DISMISS = "tv-banner-dismissed";
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Offer banner switched on from the travel desk. Publishes its height as --banner-h for the header spacer. */
export function AnnouncementBar() {
  const { announcement: a } = useDb();
  const ref = useRef<HTMLDivElement>(null);
  const [dismissed, setDismissed] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Reading the dismissed banner text from sessionStorage on mount syncs with the browser.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDismissed(sessionStorage.getItem(DISMISS));
    } catch {}
  }, []);

  const show = a.enabled && !!a.text.trim() && dismissed !== a.text;

  useIsoLayoutEffect(() => {
    const root = document.documentElement;
    const h = show ? ref.current?.offsetHeight ?? 0 : 0;
    root.style.setProperty("--banner-h", `${h}px`);
    return () => root.style.setProperty("--banner-h", "0px");
  }, [show, a.text]);

  if (!show) return null;
  return (
    <div ref={ref} role="region" aria-label="Offer" className="pointer-events-auto bg-ink text-white dark:bg-sun dark:text-sun-foreground">
      <div className="mx-auto flex min-h-10 max-w-7xl items-center gap-3 px-4 py-2 text-sm sm:px-6">
        <Megaphone className="size-4 shrink-0 text-sun dark:text-sun-foreground" />
        <p className="min-w-0 flex-1 leading-snug">{a.text}</p>
        {a.href && (
          <Link href={a.href} className="inline-flex shrink-0 items-center gap-1 rounded-full bg-sun px-3 py-1 text-xs font-bold text-sun-foreground transition hover:bg-white dark:bg-ink dark:text-white">
            {a.cta || "Learn more"} <ArrowRight className="size-3.5" />
          </Link>
        )}
        <button type="button" aria-label="Dismiss offer" onClick={() => { setDismissed(a.text); try { sessionStorage.setItem(DISMISS, a.text); } catch {} }} className="grid size-7 shrink-0 place-items-center rounded-full opacity-70 transition hover:bg-white/10 hover:opacity-100">
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
