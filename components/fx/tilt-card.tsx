"use client";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/** 3D tilt + moving glare that follows the pointer. Does nothing on touch or reduced motion. */
export function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  function move(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(900px) rotateY(${(x - 0.5) * 9}deg) rotateX(${(0.5 - y) * 9}deg) translateZ(0)`;
    el.style.setProperty("--gx", `${x * 100}%`);
    el.style.setProperty("--gy", `${y * 100}%`);
  }
  function leave() {
    if (ref.current) ref.current.style.transform = "";
  }
  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      className={cn("tilt relative h-full transition-transform duration-200 ease-out will-change-transform", className)}
    >
      {children}
      <span aria-hidden className="tilt-glare pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300" />
    </div>
  );
}
