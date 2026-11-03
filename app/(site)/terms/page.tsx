import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/layout/legal-page";
import { siteDefaults } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & conditions",
  description: "How quotes, bookings, payments, changes and cancellations work with Through Vacations.",
};

// Specific charges and deadlines depend on the hotels, airlines and operators in each trip,
// so they are stated in the customer's written quote rather than promised here.
const sections: LegalSection[] = [
  { id: "about", title: "About these terms", body: <>
    <p>These terms apply to holidays, stays, transfers and travel services arranged by Through Vacations from our Pondicherry and Chennai offices. By confirming a booking with us, you agree to them together with the written quote for your trip.</p>
    <p>If anything in your quote differs from these terms, <strong>the quote applies</strong> for that trip.</p>
  </> },
  { id: "quotes", title: "Quotes and prices", body: <>
    <ul>
      <li>Prices on this website are <strong>indicative starting prices</strong>, usually per person on twin sharing, taken from our published promotions.</li>
      <li>Your personal quote confirms the dates, hotels, inclusions and final price for your group.</li>
      <li>Quotes are based on availability and rates at the time they are sent and may change until the booking is confirmed and paid as agreed.</li>
      <li>Taxes, peak-season supplements and any services not listed as included are shown in your quote.</li>
    </ul>
  </> },
  { id: "booking", title: "Requests and confirmation", body: <>
    <p>A booking request or quote request on this website is not a confirmed booking and <strong>no payment is taken online</strong>. Your booking is confirmed once we have checked availability, you have accepted the quote and we have received the advance payment set out in it. We then send a confirmation with your booking reference.</p>
    <p>You can check the status of a request any time on <Link href="/my-trip" className="text-brand underline">Manage my trip</Link> with your reference and phone number.</p>
  </> },
  { id: "payments", title: "Payments", body: <>
    <ul>
      <li>We share payment details directly with you after you accept the quote, including the payment methods available for your booking.</li>
      <li>An advance secures the booking. The balance is due by the date in your quote, normally before travel documents are issued.</li>
      <li>Please pay only to the accounts we share with you in writing and keep your receipts. We record every payment against your booking reference.</li>
    </ul>
  </> },
  { id: "changes", title: "Changes by you", body: <>
    <p>Tell us as early as possible if you want to change dates, names, hotels or the number of travellers. We will try to help; changes depend on availability and may carry charges from hotels, airlines or operators, plus any difference in price. We confirm any change and its cost in writing before making it.</p>
  </> },
  { id: "cancellation", title: "Cancellations and refunds", body: <>
    <p>If you cancel, the charges depend on the services booked and how close to travel you cancel. Hotels, airlines and activity providers each set their own rules, so <strong>the cancellation schedule for your trip is listed in your quote</strong> before you confirm.</p>
    <ul>
      <li>Cancellations must be sent to us in writing (WhatsApp or email) and take effect when we receive them.</li>
      <li>Refunds, where due, are made to the original payment method after the suppliers release them.</li>
      <li>Non-refundable items such as some airfares, visa fees and promotional rates are marked in your quote.</li>
    </ul>
  </> },
  { id: "our-changes", title: "Changes by us or by circumstances", body: <>
    <p>Occasionally a hotel, flight or activity changes or becomes unavailable. We will offer the closest available alternative or adjust the price. Island, desert, mountain and water activities depend on weather, access and local authority rules and may be rescheduled or cancelled on the day for safety.</p>
    <p>We are not responsible for delays or changes caused by events outside our control, such as severe weather, natural events, strikes, government restrictions or airline schedule changes, but we will help you rearrange plans.</p>
  </> },
  { id: "documents", title: "Passports, visas and health", body: <>
    <ul>
      <li>You are responsible for holding a valid passport (usually valid for at least six months from travel), visas and any health documents required by your destination and nationality.</li>
      <li>We offer visa assistance and passport services, but the decision to grant a visa rests with the authorities and fees are usually non-refundable.</li>
      <li>Names on bookings must match your ID or passport exactly.</li>
    </ul>
  </> },
  { id: "insurance", title: "Travel insurance", body: <>
    <p>We strongly recommend travel insurance that covers cancellation, medical costs and baggage, especially for international trips. We can share options with your quote.</p>
  </> },
  { id: "responsibility", title: "Our responsibility", body: <>
    <p>We arrange services provided by independent hotels, transport companies and operators and choose them with care. Each provider is responsible for its own services. We will help with any problem during your trip, and our responsibility is limited to the services we have arranged, as allowed by law.</p>
  </> },
  { id: "conduct", title: "Your responsibilities", body: <>
    <p>Please follow the rules of hotels, transport and local authorities, look after your belongings and documents, and tell us about any medical needs, dietary needs or accessibility requirements when you book so we can plan for them.</p>
  </> },
  { id: "complaints", title: "Help and complaints", body: <>
    <p>If something is not right during your trip, contact us straight away on WhatsApp or {siteDefaults.phone} so we can fix it while you are there. After you return, write to <a href={`mailto:${siteDefaults.email}`} className="text-brand underline">{siteDefaults.email}</a> with your booking reference and we will reply as quickly as we can.</p>
    <p>These terms are governed by the laws of India.</p>
  </> },
];

export default function TermsPage() {
  return <LegalPage eyebrow="Terms" title="Terms & *conditions*" intro="Plain-language terms for booking a holiday with us. Your written quote always has the specifics for your trip." updated="3 November 2026" sections={sections} />;
}
