import { Plane } from "lucide-react";

/** Endless ticker of place names. Pure CSS, pauses on hover. */
export function Marquee({ items }: { items: string[] }) {
  const row = (hidden?: boolean) => (
    <ul className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden}>
      {items.map((t) => (
        <li key={t} className="flex items-center gap-10 font-display text-4xl font-extrabold whitespace-nowrap uppercase italic sm:text-6xl">
          {t}
          <Plane className="size-6 -rotate-12 text-sun sm:size-8" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="group relative -rotate-1 overflow-hidden bg-primary py-6 text-white" role="presentation">
      <div className="marquee flex w-max group-hover:[animation-play-state:paused]">
        {row()}
        {row(true)}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-primary to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-primary to-transparent" />
    </div>
  );
}
