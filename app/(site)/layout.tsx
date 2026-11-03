import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ContactFab } from "@/components/brand/whatsapp-fab";
import { BackToTop } from "@/components/fx/back-to-top";
import { SavedProvider } from "@/components/saved/saved-provider";
import { SavedSheet } from "@/components/saved/saved-sheet";
import { SiteSearch, type SearchItem } from "@/components/search/site-search";
import { CallbackDialog } from "@/components/contact/callback-dialog";
import { getDestinations, getPackages } from "@/lib/data/packages";
import { stories } from "@/lib/mock/stories";
import { footerLinks, legalLinks, nav } from "@/lib/site";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const packages = await getPackages();
  const catalog = packages.map((p) => ({ slug: p.slug, title: p.title, destination: p.destination, image: p.image, nights: p.nights }));
  const searchItems: SearchItem[] = [
    ...packages.map((p) => ({ kind: "Holiday" as const, title: p.title, sub: `${p.durationLabel} · ${p.region}`, href: `/packages/${p.slug}`, image: p.image, keywords: `${p.destination} ${p.tagline} ${p.styles.join(" ")} ${p.highlights.join(" ")}` })),
    ...(await getDestinations()).map((d) => ({ kind: "Destination" as const, title: d.name, sub: `${d.packages.length} holiday${d.packages.length > 1 ? "s" : ""} · ${d.region}`, href: `/destinations/${d.slug}`, image: d.image })),
    ...stories.map((s) => ({ kind: "Story" as const, title: s.title, sub: `${s.kicker} · ${s.read}`, href: `/journal/${s.slug}`, image: s.image, keywords: s.category })),
    ...[...nav, ...footerLinks, ...legalLinks].map((n) => ({ kind: "Page" as const, title: n.label, sub: "Page", href: n.href, keywords: ({ "/faq": "questions visa payment cancel refund", "/contact": "office address phone whatsapp pondicherry chennai", "/terms": "cancellation refund policy rules", "/my-trip": "booking status reference login track payment", "/offers": "deals discount price sale", "/groups": "corporate student college company team", "/time-zones": "time zone clock world call timezone difference" } as Record<string, string>)[n.href] ?? "" })),
  ];
  return (
    <SavedProvider catalog={catalog}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">
        Skip to content
      </a>
      {/* usePathname() is runtime data, so the header streams in behind a same-height placeholder. */}
      <Suspense fallback={<div className="h-[84px]" />}>
        <Header />
      </Suspense>
      <main id="main">
        <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>{children}</Suspense>
      </main>
      <Footer />
      <ContactFab />
      <BackToTop />
      <SavedSheet />
      <SiteSearch items={searchItems} />
      <CallbackDialog />
    </SavedProvider>
  );
}
