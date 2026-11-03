"use client";
import { useEffect } from "react";
import Lenis from "lenis";

/** Inertial smooth scrolling (Lenis) for the page it is mounted on. Off for reduced motion and touch, where native scroll feels best. */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, lerp: 0.09, anchors: { offset: -100 }, respectReducedMotion: true });
    return () => lenis.destroy();
  }, []);
  return null;
}
