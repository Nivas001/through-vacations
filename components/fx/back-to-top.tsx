"use client";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 1200);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <button type="button" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn("fixed bottom-24 left-4 z-40 print:hidden grid size-11 place-items-center rounded-full bg-card text-foreground shadow-lg ring-1 ring-border transition duration-300 hover:-translate-y-0.5 hover:text-brand lg:bottom-6 lg:left-6",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0")}
      tabIndex={show ? 0 : -1}>
      <ArrowUp className="size-5" />
    </button>
  );
}
