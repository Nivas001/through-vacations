"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, BookOpen, Compass, Heart, Info, Map, Menu, Phone, SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { LinkButton } from "@/components/brand/link-button";
import { ThemeToggle } from "./theme-toggle";
import { useSaved } from "@/components/saved/saved-provider";
import { nav, siteDefaults, tel, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  "/packages": Compass,
  "/couples": Heart,
  "/destinations": Map,
  "/trip-shaper": SlidersHorizontal,
  "/journal": BookOpen,
  "/about": Info,
};

/** Specular highlight that follows the pointer across a liquid-glass surface. */
function useSpecular<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  return {
    ref,
    onPointerMove: (e: React.PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    },
  };
}

export function Header() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { saved, setOpen } = useSaved();
  const dock = useSpecular<HTMLDivElement>();
  const brand = useSpecular<HTMLDivElement>();
  const right = useSpecular<HTMLDivElement>();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <>
      <div className="h-[84px]" aria-hidden />
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-3 pt-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          {/* brand */}
          <div ref={brand.ref} onPointerMove={brand.onPointerMove} className={cn("liquid pointer-events-auto rounded-full pr-4 pl-2 transition-all duration-300", scrolled ? "py-1" : "py-1.5")}>
            <Logo className="[&_img]:size-9 [&_span:first-child_span:first-child]:text-2xl" />
          </div>

          {/* dock */}
          <nav aria-label="Main" className="pointer-events-auto hidden lg:block">
            <div ref={dock.ref} onPointerMove={dock.onPointerMove} className={cn("liquid flex items-center gap-1 rounded-full p-1.5 transition-all duration-300", scrolled && "scale-[0.97]")}>
              {nav.map((n) => {
                const Icon = icons[n.href];
                const active = path.startsWith(n.href);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    aria-current={active ? "page" : undefined}
                    aria-label={n.label}
                    className={cn(
                      "dock-item flex h-10 items-center rounded-full px-3 text-[0.82rem] font-bold transition-colors duration-300",
                      active ? "bg-primary text-primary-foreground shadow-[0_6px_16px_-4px_rgb(30_75_230/0.6)]" : "text-foreground/75 hover:bg-white/60 hover:text-foreground dark:hover:bg-white/10",
                    )}
                  >
                    {Icon && <Icon className={cn("size-[1.1rem] shrink-0", n.href === "/couples" && !active && "text-rose-500")} />}
                    <span className="dock-label"><span className="overflow-hidden pl-2 whitespace-nowrap">{n.label}</span></span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* actions */}
          <div ref={right.ref} onPointerMove={right.onPointerMove} className="liquid pointer-events-auto flex items-center gap-1 rounded-full p-1.5">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={`Saved trips${saved.length ? ` (${saved.length})` : ""}`}
              className="relative grid size-10 place-items-center rounded-full text-foreground/80 transition hover:bg-white/60 dark:hover:bg-white/10"
            >
              <Heart className={cn("size-[1.1rem]", saved.length && "fill-rose-500 stroke-rose-500")} />
              {saved.length > 0 && <span className="absolute -top-0.5 -right-0.5 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[0.6rem] font-bold text-white">{saved.length}</span>}
            </button>
            <ThemeToggle />
            <LinkButton href="/plan" variant="sun" className="cta-glow hidden h-10 px-5 sm:inline-flex">
              Plan a trip <ArrowUpRight />
            </LinkButton>
            <Sheet>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" />}>
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent side="top" showCloseButton={false} className="grain h-dvh border-0 bg-primary p-6 text-white">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="flex items-center justify-between">
                  <Logo light />
                  <SheetClose render={<Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white" aria-label="Close menu" />}>
                    <X className="size-6" />
                  </SheetClose>
                </div>
                <nav aria-label="Mobile" className="mt-6 flex flex-col overflow-y-auto">
                  {[{ href: "/", label: "Home", sub: "Start here", img: "/media/thailand.webp" }, ...nav].map((n) => (
                    <SheetClose key={n.href} render={<Link href={n.href} />} className="group flex items-center gap-4 border-b border-white/20 py-2.5">
                      <Image src={n.img} alt="" width={64} height={64} className="size-12 rounded-xl object-cover" />
                      <span className="flex-1">
                        <span className="block font-display text-2xl leading-none font-extrabold group-hover:text-sun">{n.label}</span>
                        <span className="serif-i text-sm text-white/70">{n.sub}</span>
                      </span>
                      <ArrowUpRight className="size-5 text-sun" />
                    </SheetClose>
                  ))}
                </nav>
                <div className="mt-4 flex flex-wrap gap-3">
                  <LinkButton href="/plan" variant="sun" size="lg" className="h-12">Plan a trip <ArrowUpRight /></LinkButton>
                  <a href={whatsappLink()} className="inline-flex h-12 items-center rounded-full border-2 border-white px-5 text-sm font-bold">WhatsApp</a>
                  <a href={tel()} className="inline-flex h-12 items-center gap-2 px-2 text-sm text-white/80"><Phone className="size-4" />{siteDefaults.phone}</a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* phone: floating liquid tab bar */}
      <nav aria-label="Quick" className="pointer-events-none fixed inset-x-0 bottom-3 z-40 flex justify-center px-3 lg:hidden">
        <ul className="liquid pointer-events-auto flex w-full max-w-sm items-center justify-between rounded-full p-1.5">
          {nav.filter((n) => ["/packages", "/couples", "/destinations", "/trip-shaper"].includes(n.href)).map((n) => {
            const Icon = icons[n.href];
            const active = path.startsWith(n.href);
            return (
              <li key={n.href} className="flex-1">
                <Link href={n.href} aria-current={active ? "page" : undefined} className={cn("flex h-12 flex-col items-center justify-center rounded-full text-[0.6rem] font-bold tracking-wide transition-colors", active ? "bg-primary text-primary-foreground" : "text-foreground/70")}>
                  {Icon && <Icon className="size-[1.15rem]" />}
                  {n.label.replace("Trip Shaper", "Shaper")}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
