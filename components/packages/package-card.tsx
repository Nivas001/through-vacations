import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, MapPin } from "lucide-react";
import { formatINR } from "@/lib/site";
import { shownPrice } from "@/lib/data/packages";
import type { TravelPackage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { HeartButton } from "@/components/saved/heart-button";

/** Inset-photo card: a white tile on the tinted page with the photo set inside it. */
export function PackageCard({ pkg, className, priority }: { pkg: TravelPackage; className?: string; priority?: boolean }) {
  const price = shownPrice(pkg);
  return (
    <div className="relative h-full">
    <Link
      href={`/packages/${pkg.slug}`}
      className={cn(
        "group card-lift flex h-full flex-col rounded-[1.5rem] border bg-card p-2 transition duration-300 hover:-translate-y-1 hover:border-primary/60",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.1rem] bg-secondary">
        <Image
          src={pkg.image}
          alt={pkg.imageAlt}
          fill
          priority={priority}
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          quality={85}
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-sun px-3 py-1 text-[0.7rem] font-bold tracking-wider text-sun-foreground uppercase">
          {pkg.region}
        </span>
        <span className="absolute right-3 bottom-3 grid size-10 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 transition group-hover:opacity-100">
          <ArrowUpRight className="size-5" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4 pb-3">
        <p className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-brand uppercase">
          <MapPin className="size-3.5" /> {pkg.destination}
        </p>
        <h3 className="mt-1.5 text-[1.9rem] leading-[1] font-extrabold">{pkg.title}</h3>
        <p className="serif-i mt-1 text-xl text-muted-foreground">{pkg.tagline}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="size-4" /> {pkg.durationLabel}
          </span>
          <span className="text-right">
            {price ? (
              <>
                <span className="block text-[0.65rem] tracking-widest text-muted-foreground uppercase">From</span>
                <span className="font-display text-3xl leading-none font-extrabold">{formatINR(price)}</span>
              </>
            ) : (
              <span className="text-sm font-bold text-brand">Quote on request</span>
            )}
          </span>
        </div>
      </div>
    </Link>
    <HeartButton slug={pkg.slug} className="absolute top-4 right-4" />
    </div>
  );
}
