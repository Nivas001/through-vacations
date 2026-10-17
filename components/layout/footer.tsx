import Link from "next/link";
import { AtSign, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Wave } from "@/components/brand/wave";
import { about, footerLinks, nav, siteDefaults, tel } from "@/lib/site";
import { getDestinations } from "@/lib/data/packages";

function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 40" className={className} fill="none" aria-hidden>
      <path d="M2 28 C 30 28, 60 20, 96 12" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path d="M84 4 L112 10 L96 30" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export async function Footer() {
  const dests = (await getDestinations()).slice(0, 8);
  return (
    <footer className="grain relative mt-28 overflow-hidden bg-primary text-white">
      <Wave className="opacity-[0.08]" />
      <div className="relative mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-white/20 pb-10">
          <div aria-label="Through Vacations">
            <p className="text-outline font-display text-[17vw] leading-[0.8] font-extrabold tracking-tighter uppercase sm:text-[10.5vw] lg:text-[9rem]">through</p>
            <p className="serif-i -mt-1 flex items-center gap-4 text-[15vw] leading-[0.95] font-extrabold text-white sm:text-[8.5vw] lg:text-[7.5rem]">
              vacations <Arrow className="mt-3 hidden h-[0.45em] w-[1.1em] text-sun sm:block" />
            </p>
          </div>
          <div className="relative -rotate-6 rounded-full border-[3px] border-dashed border-sun px-7 py-5 text-center text-sun" aria-label="Postmarked Pondicherry">
            <p className="text-[0.65rem] font-bold tracking-[0.3em] uppercase">Postmarked</p>
            <p className="font-display text-3xl leading-none font-extrabold uppercase">Pondicherry</p>
            <p className="mt-1 text-[0.65rem] font-bold tracking-[0.3em] uppercase">{about.founded ? `Est. ${about.founded}` : "India"}</p>
          </div>
        </div>
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr_1fr_1.2fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-sm text-white/75">Travel made seamless. Curated holidays across India and beyond, planned from Pondicherry.</p>
        </div>
        <FooterCol title="Explore">
          {nav.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
        </FooterCol>
        <FooterCol title="Where next?">
          {dests.map((d) => <Link key={d.slug} href={`/destinations/${d.slug}`}>{d.name}</Link>)}
        </FooterCol>
        <FooterCol title="Plan">
          {footerLinks.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
        </FooterCol>
        <FooterCol title="Say hello">
          <a href={`mailto:${siteDefaults.email}`} className="flex items-center gap-2"><Mail className="size-4" />{siteDefaults.email}</a>
          <a href={tel()} className="flex items-center gap-2"><Phone className="size-4" />{siteDefaults.phone}</a>
          <a href={siteDefaults.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2"><AtSign className="size-4" />@throughvacations</a>
          <span className="flex items-center gap-2 text-white/75"><MapPin className="size-4" />{siteDefaults.location}</span>
        </FooterCol>
      </div>
      <div className="relative border-t border-white/15">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 px-4 py-5 pb-24 text-xs text-white/65 sm:px-6 lg:pb-5">
          <span>© Through Vacations. Final prices and availability are confirmed in your quote.</span>
          <span className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/credits" className="hover:text-white">Image credits</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-sans text-xs font-bold tracking-[0.2em] text-sun uppercase">{title}</h2>
      <div className="mt-4 flex flex-col gap-3 text-sm [&_a]:text-white/85 [&_a:hover]:text-white">{children}</div>
    </div>
  );
}
