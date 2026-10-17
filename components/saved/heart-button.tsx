"use client";
import { Heart } from "lucide-react";
import { useSaved } from "./saved-provider";
import { cn } from "@/lib/utils";

export function HeartButton({ slug, className }: { slug: string; className?: string }) {
  const { has, toggle } = useSaved();
  const on = !!has(slug);
  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      aria-pressed={on}
      aria-label={on ? "Remove from saved trips" : "Save this trip"}
      className={cn("grid size-10 place-items-center rounded-full bg-white/85 text-sun-foreground shadow-md backdrop-blur transition hover:scale-110 active:scale-95", className)}
    >
      <Heart className={cn("size-5 transition", on ? "fill-rose-500 stroke-rose-500 scale-110" : "")} />
    </button>
  );
}
