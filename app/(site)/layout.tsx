import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ContactFab } from "@/components/brand/whatsapp-fab";
import { SavedProvider } from "@/components/saved/saved-provider";
import { SavedSheet } from "@/components/saved/saved-sheet";
import { getPackages } from "@/lib/data/packages";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const catalog = (await getPackages()).map((p) => ({ slug: p.slug, title: p.title, destination: p.destination, image: p.image, nights: p.nights }));
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
      <SavedSheet />
    </SavedProvider>
  );
}
