import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/layout/legal-page";
import { siteDefaults } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy", description: "What Through Vacations collects, why, and how to ask us to correct or delete your details." };

const sections: LegalSection[] = [
  { id: "collect", title: "What we collect", body: <>
    <p>When you send a booking request, quote request, message, call-back request or newsletter sign-up, we collect what you enter: your name, phone number, email, city, travel dates, travellers and preferences.</p>
  </> },
  { id: "use", title: "How we use it", body: <>
    <ul>
      <li>To reply to you, plan your trip and send your quote.</li>
      <li>To confirm bookings, record payments and share travel documents.</li>
      <li>To send trip ideas and offers, only if you subscribed. Every email lets you unsubscribe.</li>
    </ul>
    <p>We do <strong>not sell</strong> your details.</p>
  </> },
  { id: "share", title: "Who we share it with", body: <>
    <p>Hotels, transport companies, activity operators, airlines and visa agents receive only what they need to provide your services, such as names and ID details for bookings.</p>
  </> },
  { id: "browser", title: "Saved in your browser", body: <>
    <p>Your saved trips, recently viewed holidays, theme choice and form drafts are kept in your own browser so the site remembers them. We do not use advertising trackers. Maps on the contact pages are provided by Google when you view them.</p>
  </> },
  { id: "keep", title: "How long we keep it", body: <>
    <p>We keep booking records for as long as needed for your trip, our accounts and legal requirements, and enquiry details for a reasonable period so we can help with future trips.</p>
  </> },
  { id: "rights", title: "Your choices", body: <>
    <p>To see, correct or delete your details, or to stop marketing messages, email <a className="text-brand underline" href={`mailto:${siteDefaults.email}`}>{siteDefaults.email}</a> or message us on WhatsApp.</p>
  </> },
];

export default function PrivacyPage() {
  return <LegalPage eyebrow="Privacy" title="How we handle your *details*" intro="Short and clear: what we collect, why, and how to ask us to change or remove it." updated="3 November 2026" sections={sections} />;
}
