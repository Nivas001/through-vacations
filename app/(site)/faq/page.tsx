import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, PhoneCall } from "lucide-react";
import { PageIntro } from "@/components/layout/page-intro";
import { FaqBrowser, type Faq } from "@/components/faq/faq-browser";
import { CallbackButton } from "@/components/contact/callback-dialog";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = { title: "FAQs", description: "Answers about booking, payments, changes, visas and travelling with Through Vacations." };

const topics = ["Booking", "Payments", "Changes", "Visas & documents", "On the trip", "Groups & offices"];

const faqs: Faq[] = [
  { topic: "Booking", q: "How do I book a holiday?", a: "Pick a holiday and choose Reserve, or send a custom quote request. A planner confirms availability, sends your personal quote, and your booking is confirmed once you accept it and pay the advance." },
  { topic: "Booking", q: "Is reserving on the website a confirmed booking?", a: "Not yet. It sends us your request with dates and travellers. Nothing is charged online. We confirm availability first and then share the quote and payment details." },
  { topic: "Booking", q: "Can you customise a package?", a: "Yes, every trip is tailored. Change the number of nights, hotels, activities or add another destination. Tell us in the request notes or on WhatsApp." },
  { topic: "Booking", q: "How do I check the status of my booking?", a: "Open Manage my trip and enter your reference with the phone number or email you used. You will see the status, dates, payments and your office contact." },
  { topic: "Payments", q: "Are the prices on the site final?", a: "They are indicative starting prices from our published promotions, usually per person on twin sharing. Your personal quote confirms the final price for your dates and group." },
  { topic: "Payments", q: "When do I pay?", a: "An advance confirms the booking, and the balance is due by the date in your quote, usually before travel documents are issued. We share payment details directly with you." },
  { topic: "Payments", q: "Do I get a receipt?", a: "Yes. Every payment is recorded against your booking reference, and you can see what is paid and what is due on Manage my trip." },
  { topic: "Changes", q: "Can I change my dates after booking?", a: "Usually, yes. Tell your planner as early as possible. Changes depend on availability and may carry supplier charges, which we confirm in writing first." },
  { topic: "Changes", q: "What if I need to cancel?", a: "Cancellation charges depend on the hotels, flights and activities booked and how close to travel you cancel. The schedule for your trip is listed in your quote before you confirm." },
  { topic: "Changes", q: "What happens if weather affects an activity?", a: "Island, water and mountain activities depend on local conditions. If one is cancelled for safety, we reschedule where possible or arrange an alternative." },
  { topic: "Visas & documents", q: "Can you help with visas and passports?", a: "Yes, we offer visa assistance and passport services. Requirements depend on your destination and nationality, and the final decision rests with the authorities." },
  { topic: "Visas & documents", q: "What ID do I need for trips within India?", a: "A valid government photo ID for each adult. Some places, such as parts of Ladakh or the Andamans, may need extra permits, which we arrange or explain in your quote." },
  { topic: "Visas & documents", q: "Are flights included?", a: "Inclusions vary by package. Flights, visas and insurance are quoted separately unless your personal quote says they are included." },
  { topic: "On the trip", q: "Who do I contact during the trip?", a: "Your office is a WhatsApp message or call away. The contact is on your confirmation and on Manage my trip." },
  { topic: "On the trip", q: "Do you recommend travel insurance?", a: "Yes, especially for international trips. We can share options with your quote." },
  { topic: "On the trip", q: "Can you plan for seniors, kids or dietary needs?", a: "Yes. Tell us when you book and we will plan easier days, suitable rooms and meals where available." },
  { topic: "Groups & offices", q: "Do you organise corporate, student and family group trips?", a: "Yes: corporate offsites and incentive trips, student industrial visits, friends and family groups, camping and resort stays. See Group & corporate trips." },
  { topic: "Groups & offices", q: "Where are your offices?", a: "In Pondicherry and Chennai. Most planning happens on WhatsApp and phone, and you are welcome to visit either office by appointment." },
  { topic: "Groups & offices", q: "I live outside India. Can I book with you?", a: "Yes. International enquiries are welcome. Add your departure city, country and preferred budget currency in the quote form." },
];

export default function FaqPage() {
  const jsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageIntro eyebrow="FAQs" title="Questions, *answered*">Everything people usually ask before booking. Can&apos;t find yours? We reply quickly on WhatsApp.</PageIntro>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <FaqBrowser faqs={faqs} topics={topics} />
        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[1.5rem] bg-primary p-6 text-white">
            <p className="font-display text-2xl leading-tight font-extrabold">Still have a question?</p>
            <p className="mt-2 text-sm text-white/80">Talk to a planner. No obligation.</p>
            <div className="mt-5 grid gap-2">
              <a href={whatsappLink("Hi! I have a question.")} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-sun text-sm font-bold text-sun-foreground transition hover:bg-white"><MessageCircle className="size-4" /> WhatsApp us</a>
              <CallbackButton className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-white text-sm font-bold transition hover:bg-white hover:text-ink"><PhoneCall className="size-4" /> Request a call back</CallbackButton>
            </div>
          </div>
          <div className="rounded-[1.5rem] border bg-card p-6 text-sm">
            <p className="font-semibold">Helpful pages</p>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              {[["/terms", "Terms & conditions"], ["/travel-information", "Travel information"], ["/my-trip", "Manage my trip"], ["/how-it-works", "How it works"]].map(([h, l]) => <li key={h}><Link href={h} className="hover:text-brand">{l} →</Link></li>)}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
