import Link from "next/link";
import { ArrowUpRight, MessageCircle, Plane } from "lucide-react";
import { whatsappLink } from "@/lib/site";
import { CallbackButton } from "@/components/contact/callback-dialog";

/** Closing call to action, styled as a boarding pass with a tear-off stub. */
export function BoardingPassCta() {
  const bars = Array.from({ length: 42 }, (_, i) => [1, 3, 2, 1, 4, 2, 1, 3][i % 8]);
  return (
    <section className="mx-auto mt-28 max-w-6xl px-4 sm:px-6" aria-labelledby="pass-title">
      <div className="relative">
        <div className="pointer-events-none absolute -inset-y-6 inset-x-0 -z-10 rounded-[3rem] sm:-inset-6 bg-[radial-gradient(circle_at_30%_20%,rgb(255_210_63/.35),transparent_60%)] blur-2xl" />
        <div className="ticket grid grid-cols-1 overflow-hidden rounded-[1.75rem] bg-primary text-white shadow-[0_30px_60px_-30px_rgb(10_26_122/.7)] md:grid-cols-[1fr_auto]">
          <div className="grain relative p-7 sm:p-10">
            <div className="flex items-center justify-between gap-3 text-xs font-bold tracking-[0.25em] uppercase">
              <span>Through Vacations</span><span className="text-sun">Boarding pass</span>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div><p className="text-xs text-white/60">From</p><p className="font-display text-5xl leading-none font-extrabold sm:text-6xl">YOU</p></div>
              <div className="relative flex-1 border-t-2 border-dashed border-white/40"><Plane className="absolute -top-3 left-1/2 size-6 -translate-x-1/2 rotate-45 text-sun" /></div>
              <div className="text-right"><p className="text-xs text-white/60">To</p><p className="font-display text-5xl leading-none font-extrabold text-sun sm:text-6xl">ANY</p></div>
            </div>
            <h2 id="pass-title" className="mt-8 max-w-xl text-3xl leading-[1.05] font-extrabold sm:text-5xl">Tell us where you want to go.</h2>
            <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-white/20 pt-5 text-sm sm:max-w-md">
              <div><dt className="text-[0.65rem] tracking-widest text-white/60 uppercase">Gate</dt><dd className="font-bold">WhatsApp</dd></div>
              <div><dt className="text-[0.65rem] tracking-widest text-white/60 uppercase">Seat</dt><dd className="font-bold">Window</dd></div>
              <div><dt className="text-[0.65rem] tracking-widest text-white/60 uppercase">Boarding</dt><dd className="font-bold">Now</dd></div>
            </dl>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/plan" className="inline-flex h-12 items-center gap-2 rounded-full bg-sun px-7 text-base font-bold text-sun-foreground transition hover:bg-white">Plan my trip <ArrowUpRight className="size-5" /></Link>
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full border-2 border-white px-6 text-base font-bold transition hover:bg-white hover:text-primary"><MessageCircle className="size-5" /> WhatsApp us</a>
              <CallbackButton className="text-sm font-bold underline decoration-2 underline-offset-4 hover:text-sun">Or ask for a call back</CallbackButton>
            </div>
          </div>
          <div className="ticket-divider flex flex-row items-center justify-between gap-4 p-6 md:w-52 md:flex-col md:justify-center md:p-8">
            <div className="text-center"><p className="text-[0.65rem] font-bold tracking-widest uppercase opacity-70">Flight</p><p className="font-display text-3xl font-extrabold">TV 001</p></div>
            <div className="flex h-16 items-end gap-[2px] md:h-24" aria-hidden>{bars.slice(0, 30).map((w, i) => <span key={i} className="h-full bg-sun-foreground" style={{ width: w }} />)}</div>
            <p className="hidden text-center text-xs font-bold md:block">Keep this side for your trip</p>
          </div>
        </div>
      </div>
    </section>
  );
}
