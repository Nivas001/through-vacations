import type { Metadata } from "next";
import { AtSign, Mail, MessageCircle, Phone, PhoneCall } from "lucide-react";
import { siteDefaults, tel, whatsappLink } from "@/lib/site";
import { PageIntro } from "@/components/layout/page-intro";
import { SectionHeading } from "@/components/brand/section-heading";
import { ContactForm } from "@/components/contact/contact-form";
import { Offices } from "@/components/contact/offices";
import { CallbackButton } from "@/components/contact/callback-dialog";

export const metadata: Metadata = {
  title: "Contact & offices",
  description: "Talk to Through Vacations on WhatsApp, phone or email, or visit our Pondicherry and Chennai offices.",
};

export default function ContactPage() {
  const items = [
    { icon: MessageCircle, k: "WhatsApp", v: "Fastest reply", href: whatsappLink(), tone: "bg-[#25D366] text-white" },
    { icon: Phone, k: "Call", v: siteDefaults.phone, href: tel(), tone: "bg-secondary text-brand" },
    { icon: Mail, k: "Email", v: siteDefaults.email, href: `mailto:${siteDefaults.email}`, tone: "bg-secondary text-brand" },
    { icon: AtSign, k: "Instagram", v: "@throughvacations", href: siteDefaults.instagram, tone: "bg-secondary text-brand" },
  ];
  return (
    <>
      <PageIntro eyebrow="Contact" title="Say *hello*">
        Two offices, one team. Message us, call, or drop by Pondicherry or Chennai.
      </PageIntro>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {items.map(({ icon: Icon, k, v, href, tone }) => (
            <li key={k} className="min-w-0">
              <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="card-lift flex h-full min-w-0 flex-col gap-3 rounded-2xl border bg-card p-4 transition hover:-translate-y-0.5 hover:border-primary sm:flex-row sm:items-center sm:p-5">
                <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${tone}`}><Icon className="size-5" /></span>
                <span className="min-w-0"><span className="block text-xs font-bold tracking-[0.16em] text-muted-foreground uppercase">{k}</span><span className="block truncate text-sm font-semibold sm:text-base">{v}</span></span>
              </a>
            </li>
          ))}
        </ul>

        <section className="mt-20">
          <SectionHeading eyebrow="Our offices" title="Pondicherry *and* Chennai" />
          <Offices className="mt-8" />
        </section>

        <section className="mt-20 grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <ContactForm />
          <aside className="space-y-4 lg:sticky lg:top-28">
            <div className="rounded-3xl bg-primary p-6 text-white sm:p-8">
              <p className="font-display text-3xl leading-tight font-extrabold">Already have a trip in mind?</p>
              <p className="mt-2 text-sm text-white/80">Share where, when and who. A planner replies with a personal itinerary and price.</p>
              <a href="/plan" className="mt-6 inline-flex h-11 items-center rounded-full bg-sun px-6 text-sm font-bold text-sun-foreground transition hover:bg-white">Get a custom quote</a>
            </div>
            <div className="rounded-3xl border bg-card p-6">
              <p className="font-semibold">Prefer a phone call?</p>
              <p className="mt-1 text-sm text-muted-foreground">Leave your number and pick a time. A planner calls you back.</p>
              <CallbackButton className="mt-4 inline-flex h-11 items-center gap-2 rounded-full border-2 border-foreground px-5 text-sm font-bold transition hover:bg-foreground hover:text-background"><PhoneCall className="size-4" /> Request a call back</CallbackButton>
            </div>
            <div className="rounded-3xl border bg-card p-6">
              <p className="font-semibold">Serving travellers everywhere</p>
              <p className="mt-1 text-sm text-muted-foreground">Most planning happens on WhatsApp and phone, so you can book with us from anywhere in India or abroad.</p>
            </div>
          </aside>
        </section>
      </div>
    </>
  );
}
