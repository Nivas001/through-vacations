import Link from "next/link";
import { FileText, Mail, MessageCircle } from "lucide-react";
import { PageIntro } from "@/components/layout/page-intro";
import { siteDefaults, whatsappLink } from "@/lib/site";

export type LegalSection = { id: string; title: string; body: React.ReactNode };

/** Long-form policy page: numbered sections with a sticky contents list on large screens. */
export function LegalPage({ eyebrow, title, intro, updated, sections }: { eyebrow: string; title: string; intro: string; updated: string; sections: LegalSection[] }) {
  return (
    <>
      <PageIntro eyebrow={eyebrow} title={title}>{intro}</PageIntro>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <nav aria-label="On this page" className="rounded-2xl border bg-card p-4">
            <p className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase"><FileText className="size-3.5" /> On this page</p>
            <ol className="mt-3 space-y-1 text-sm">
              {sections.map((s, i) => (
                <li key={s.id}><a href={`#${s.id}`} className="flex gap-2 rounded-lg px-2 py-1.5 text-muted-foreground transition hover:bg-secondary hover:text-foreground"><span className="w-5 shrink-0 tabular-nums text-brand">{i + 1}.</span>{s.title}</a></li>
              ))}
            </ol>
          </nav>
          <p className="mt-3 px-1 text-xs text-muted-foreground">Last updated {updated}</p>
        </aside>
        <article className="min-w-0 space-y-4">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28 rounded-2xl border bg-card p-5 sm:p-7">
              <h2 className="flex items-baseline gap-3 text-2xl font-extrabold sm:text-3xl"><span className="font-display text-lg text-brand tabular-nums">{String(i + 1).padStart(2, "0")}</span>{s.title}</h2>
              <div className="mt-3 space-y-3 leading-relaxed text-muted-foreground [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-foreground [&_ul]:space-y-1.5">{s.body}</div>
            </section>
          ))}
          <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-primary p-6 text-white sm:p-7">
            <p className="min-w-0 flex-1 font-display text-2xl leading-tight font-extrabold">Questions about any of this?</p>
            <a href={whatsappLink("Hi! I have a question about your terms.")} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full bg-sun px-5 text-sm font-bold text-sun-foreground transition hover:bg-white"><MessageCircle className="size-4" /> WhatsApp</a>
            <a href={`mailto:${siteDefaults.email}`} className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-white px-5 text-sm font-bold transition hover:bg-white hover:text-ink"><Mail className="size-4" /> Email us</a>
            <Link href="/faq" className="text-sm font-semibold underline underline-offset-4">Read the FAQs</Link>
          </div>
        </article>
      </div>
    </>
  );
}
