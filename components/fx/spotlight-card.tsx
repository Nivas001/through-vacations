"use client";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/** Card with a soft spotlight that follows the pointer (React Bits style). */
export function SpotlightCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--sx", `${e.clientX - r.left}px`);
        el.style.setProperty("--sy", `${e.clientY - r.top}px`);
      }}
      className={cn("group/s relative overflow-hidden", className)}
    >
      <span aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/s:opacity-100" style={{ background: "radial-gradient(320px circle at var(--sx, 50%) var(--sy, 50%), rgb(255 210 63 / .22), transparent 60%)" }} />
      <div className="relative">{children}</div>
    </div>
  );
}
