import type { Metadata } from "next";
import { AtSign, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { siteDefaults, tel, whatsappLink } from "@/lib/site";
import { PageIntro } from "@/components/layout/page-intro";
import { LinkButton } from "@/components/brand/link-button";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  const items = [
    { icon: MessageCircle, k: "WhatsApp", v: siteDefaults.phone, href: whatsappLink() },
    { icon: Phone, k: "Call", v: siteDefaults.phone, href: tel() },
    { icon: Mail, k: "Email", v: siteDefaults.email, href: `mailto:${siteDefaults.email}` },
    { icon: AtSign, k: "Instagram", v: "@throughvacations", href: siteDefaults.instagram },
  ];
  return (
    <>
      <PageIntro eyebrow="Contact" title="Say hello" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <ul className="grid gap-4 sm:grid-cols-2">
          {items.map(({ icon: Icon, k, v, href }) => (
            <li key={k}>
              <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="flex items-center gap-4 rounded-2xl border bg-card p-6 transition hover:border-primary">
                <span className="grid size-12 place-items-center rounded-xl bg-secondary text-brand"><Icon className="size-5" /></span>
                <span><span className="block text-xs tracking-[0.18em] text-muted-foreground uppercase">{k}</span><span className="text-lg font-medium">{v}</span></span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-6 flex items-center gap-2 text-muted-foreground"><MapPin className="size-4" /> Based in {siteDefaults.location}. Serving Pondicherry, Chennai and travellers across India and abroad.</p>
        <div className="mt-8"><LinkButton href="/plan" className="h-11 rounded-full px-6">Or request a custom quote</LinkButton></div>
      </div>
    </>
  );
}
