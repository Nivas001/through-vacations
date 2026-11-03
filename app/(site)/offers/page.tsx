import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, BadgeCheck, Heart, MessageCircle, Users } from "lucide-react";
import { PageIntro } from "@/components/layout/page-intro";
import { SectionHeading } from "@/components/brand/section-heading";
import { OffersGrid, SeasonalPicks } from "@/components/offers/offers";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Offers",
  description: "Current holiday offers from Through Vacations, plus the best places to go in the coming months.",
};

const collections = [
  { label: "Honeymoon", sub: "Quiet, romantic, yours", href: "/packages?style=Honeymoon", img: "/media/maldives-2.webp", icon: Heart },
  { label: "Family", sub: "Easy days for all ages", href: "/packages?style=Family", img: "/media/malaysia-2.webp", icon: Users },
  { label: "Short breaks", sub: "Three nights or fewer", href: "/packages?maxNights=3", img: "/media/pondicherry-3.webp", icon: BadgeCheck },
  { label: "Groups", sub: "Corporate and student trips", href: "/groups", img: "/media/goa-2.webp", icon: Users },
];

export default function OffersPage() {
  return (
    <>
      <PageIntro eyebrow="Offers" title="Good trips, *better* timing">
        Current promotions and the places at their best right now. Every price is reconfirmed for your dates in your personal quote.
      </PageIntro>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <OffersGrid />
        <p className="mt-4 text-xs text-muted-foreground">Prices are per person, from, and subject to availability on your dates. Inclusions are listed on each holiday and confirmed in your quote.</p>

        <section className="mt-24">
          <SectionHeading eyebrow="In season" title="Where to go *next*">The holidays at their best over the next three months.</SectionHeading>
          <div className="mt-8"><SeasonalPicks /></div>
        </section>

        <section className="mt-24">
          <SectionHeading eyebrow="Collections" title="Pick your *kind* of trip" />
          <ul className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {collections.map(({ label, sub, href, img, icon: Icon }) => (
              <li key={label}>
                <Link href={href} className="group relative block aspect-[3/4] overflow-hidden rounded-[1.5rem] sm:aspect-[4/5]">
                  <Image src={img} alt="" fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition duration-700 group-hover:scale-110" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  <span className="absolute inset-x-3 bottom-3 text-white sm:inset-x-4 sm:bottom-4">
                    <Icon className="size-5 text-sun" />
                    <span className="mt-2 block font-display text-xl leading-none font-extrabold min-[400px]:text-2xl sm:text-3xl">{label}</span>
                    <span className="mt-1 block text-xs text-white/80 sm:text-sm">{sub}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-24 grid grid-cols-1 items-center gap-6 rounded-[1.75rem] bg-ink p-7 text-white sm:p-12 lg:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-3xl font-extrabold sm:text-5xl">Have a budget in mind?</h2>
            <p className="mt-3 max-w-xl text-white/75">Tell us what you would like to spend and we will find the best trip for it, including dates when prices are lower.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/plan" className="inline-flex h-12 items-center gap-2 rounded-full bg-sun px-6 text-sm font-bold text-sun-foreground transition hover:bg-white">Get a quote <ArrowUpRight className="size-4" /></Link>
            <a href={whatsappLink("Hi! Are there any current offers?")} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full border-2 border-white px-6 text-sm font-bold transition hover:bg-white hover:text-ink"><MessageCircle className="size-4" /> Ask on WhatsApp</a>
          </div>
        </section>
      </div>
    </>
  );
}
