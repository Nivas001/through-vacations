import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageIntro } from "@/components/layout/page-intro";
import { LinkButton } from "@/components/brand/link-button";

export const metadata: Metadata = { title: "How it works" };

const steps = [
  ["Share your idea", "Pick a holiday on the site or send a tailored-quote request with where, when, who and budget."],
  ["We plan it with you", "A planner refines the itinerary, stays, transfers and activities around your preferences."],
  ["Confirm your quote", "You receive a clear personal quote. Dates, inclusions and final price are confirmed there."],
  ["Travel with support", "Pay the team directly, get your trip documents, and reach us if anything changes."],
];

const faqs = [
  ["Do I pay when I reserve?", "No. Reserving sends us a request. We confirm availability first, then share payment details with you directly."],
  ["Are the prices on the site final?", "They are indicative starting prices from our published promotions. Your quote confirms the final price for your dates and group."],
  ["Are flights included?", "Inclusions vary by package. Flights, visa and insurance are quoted separately unless stated in your personal quote."],
  ["Can you help with visas and passports?", "Yes, we offer visa assistance and passport services. Requirements depend on your destination and nationality."],
  ["I live outside India. Can I travel with you?", "Yes. International enquiries are welcome. Tell us your departure city, country and preferred budget currency in the quote form."],
  ["Do you organise group, corporate and student trips?", "Yes: friends and family groups, corporate trips, student industrial visits, camping and resort stays."],
];

export default function HowItWorksPage() {
  return (
    <>
      <PageIntro eyebrow="How it works" title="Simple from the first message" />
      <ol className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map(([t, b], i) => (
          <li key={t} className="rounded-2xl border bg-card p-6">
            <span className="font-display text-5xl font-extrabold text-brand">{String(i + 1).padStart(2, "0")}</span>
            <h2 className="mt-3 text-2xl font-extrabold">{t}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{b}</p>
          </li>
        ))}
      </ol>
      <section className="mx-auto mt-24 max-w-3xl px-4 sm:px-6">
        <h2 className="text-4xl font-extrabold sm:text-5xl">Questions, answered</h2>
        <Accordion className="mt-8 rounded-2xl border bg-card px-5">
          {faqs.map(([q, a]) => (
            <AccordionItem key={q} value={q}>
              <AccordionTrigger className="py-5 text-base">{q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-10"><LinkButton href="/plan" className="h-11 rounded-full px-6">Start planning</LinkButton></div>
      </section>
    </>
  );
}
