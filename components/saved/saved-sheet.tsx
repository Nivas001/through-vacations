"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart, X } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { LinkButton } from "@/components/brand/link-button";
import { useSaved } from "./saved-provider";

export function SavedSheet() {
  const { saved, toggle, catalog, open, setOpen } = useSaved();
  const items = saved.map((s) => catalog.find((c) => c.slug === s)).filter((x): x is NonNullable<typeof x> => !!x);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="p-6">
        <SheetTitle className="font-display text-3xl font-extrabold">Saved trips</SheetTitle>
        {items.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
            <Heart className="mx-auto size-8 text-brand" />
            <p className="mt-3 font-bold text-foreground">Nothing saved yet</p>
            <p className="mt-1 text-sm">Tap the heart on any trip to keep it here. Handy for choosing together.</p>
          </div>
        ) : (
          <>
            <ul className="mt-4 space-y-3 overflow-y-auto">
              {items.map((c) => (
                <li key={c.slug} className="flex items-center gap-3 rounded-2xl border bg-card p-2">
                  <Image src={c.image} alt="" width={96} height={96} className="size-16 rounded-xl object-cover" />
                  <SheetClose render={<Link href={`/packages/${c.slug}`} />} className="min-w-0 flex-1">
                    <span className="block truncate font-display text-lg leading-tight font-extrabold">{c.title}</span>
                    <span className="text-xs text-muted-foreground">{c.nights} nights</span>
                  </SheetClose>
                  <button type="button" onClick={() => toggle(c.slug)} aria-label={`Remove ${c.title}`} className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-muted"><X className="size-4" /></button>
                </li>
              ))}
            </ul>
            <SheetClose render={<LinkButton href={`/plan?trip=${items.map((i) => i.slug).join(",")}`} size="lg" className="mt-auto h-12 w-full" />}>
              Plan these {items.length} {items.length === 1 ? "trip" : "trips"} <ArrowUpRight />
            </SheetClose>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
