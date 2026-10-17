import { cn } from "@/lib/utils";

/** Seigaiha wave pattern from the Instagram posters, as a tiled SVG background. */
export function Wave({ className }: { className?: string }) {
  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='40' viewBox='0 0 80 40' fill='none' stroke='%23ffffff' stroke-width='3'><g><circle cx='0' cy='40' r='36'/><circle cx='0' cy='40' r='26'/><circle cx='0' cy='40' r='16'/><circle cx='80' cy='40' r='36'/><circle cx='80' cy='40' r='26'/><circle cx='80' cy='40' r='16'/><circle cx='40' cy='20' r='36'/><circle cx='40' cy='20' r='26'/><circle cx='40' cy='20' r='16'/></g></svg>`,
  );
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 opacity-60 dark:opacity-20", className)}
      style={{ backgroundImage: `url("data:image/svg+xml,${svg}")`, backgroundSize: "80px 40px" }}
    />
  );
}
