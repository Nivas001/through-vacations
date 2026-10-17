import { Check } from "lucide-react";
import { formatINR } from "@/lib/site";
import { shownPrice } from "@/lib/data/packages";
import type { TravelPackage } from "@/lib/types";
import { cn } from "@/lib/utils";

/** The notched blue ticket from the Instagram package posters. */
export function PriceTicket({ pkg, className }: { pkg: TravelPackage; className?: string }) {
  const price = shownPrice(pkg);
  return (
    <div className={cn("ticket grid sm:grid-cols-[1.4fr_1fr]", className)}>
      <div className="p-6 sm:p-8">
        <p className="font-display text-3xl font-extrabold uppercase">Package</p>
        <ul className="mt-4 space-y-2.5 text-sm">
          {pkg.inclusions.slice(0, 6).map((i) => (
            <li key={i} className="flex gap-2.5">
              <Check className="mt-0.5 size-4 shrink-0 rounded-full bg-sun p-0.5 text-sun-foreground" />
              {i}
            </li>
          ))}
        </ul>
      </div>
      <div className="ticket-divider flex flex-col justify-center p-6 sm:p-8">
        {price ? (
          <>
            <p className="font-display text-4xl leading-none font-extrabold italic sm:text-5xl">{formatINR(price)}/-</p>
            <p className="mt-3 text-lg">Per person</p>
            <p className="mt-1 text-xs opacity-75">Indicative, confirmed in your quote</p>
          </>
        ) : (
          <>
            <p className="font-display text-3xl leading-none font-extrabold uppercase">Tailored to you</p>
            <p className="mt-3 text-sm opacity-80">{pkg.priceNote}</p>
          </>
        )}
      </div>
    </div>
  );
}
