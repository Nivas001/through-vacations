import type { Metadata } from "next";
import { siteDefaults } from "@/lib/site";
import { PageIntro } from "@/components/layout/page-intro";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <>
      <PageIntro eyebrow="Privacy" title="How we handle your details" />
      <div className="mx-auto max-w-3xl space-y-6 px-4 text-muted-foreground sm:px-6">
        <p>When you send a booking request or quote form, we collect the details you enter (name, email, phone, departure city, travel preferences) so the team can plan and quote your trip.</p>
        <p>We use them only to respond to you and arrange your holiday. We do not sell your details. Service providers such as hotels or visa agents receive only what is needed to fulfil your trip.</p>
        <p>To ask us to correct or delete your details, email <a className="text-brand underline" href={`mailto:${siteDefaults.email}`}>{siteDefaults.email}</a>.</p>
        <p className="text-xs">Draft policy for review by the business before public launch.</p>
      </div>
    </>
  );
}
