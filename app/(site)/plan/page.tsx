import type { Metadata } from "next";
import { Check } from "lucide-react";
import { getPackage } from "@/lib/data/packages";
import { QuoteForm } from "@/components/plan/quote-form";
import { PageIntro } from "@/components/layout/page-intro";

export const metadata: Metadata = { title: "Plan your trip" };

export default async function PlanPage({ searchParams }: PageProps<"/plan">) {
  const sp = await searchParams;
  const t = sp.trip;
  const one = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : undefined);
  const slugs = typeof t === "string" ? t.split(",").filter(Boolean) : [];
  const pkgs = (await Promise.all(slugs.map((s) => getPackage(s)))).filter((p): p is NonNullable<typeof p> => !!p);
  const pkg = pkgs.length === 1 ? pkgs[0] : null;
  const occ = one("occasion");
  const occLabel = occ ? { honeymoon: "Honeymoon", anniversary: "Anniversary", babymoon: "Babymoon", "just-us": "A trip for two" }[occ] : undefined;
  const month = Number(one("month")) || 0;
  const days = Number(one("days")) || 0;
  const dates = [month ? new Date(2000, month - 1, 1).toLocaleString("en-IN", { month: "long" }) : "", days ? `${days} days` : ""].filter(Boolean).join(", ");
  const travellers = (Number(one("adults")) || 0) + (Number(one("kids")) || 0) || undefined;
  return (
    <>
      <PageIntro eyebrow="Tailor-made" title="Tell us the trip you have in *mind*">
        Three short steps. A planner replies with a personal itinerary and price. International enquiries are welcome.
      </PageIntro>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_340px]">
        <QuoteForm prefill={pkg ? `${pkg.destination} (${pkg.durationLabel})` : pkgs.length > 1 ? pkgs.map((p) => p.destination).join(", ") : typeof t === "string" ? t : undefined} dates={dates || undefined} travellers={occLabel ? (travellers ?? 2) : travellers} notes={occLabel ? `Occasion: ${occLabel}.${one("when") ? ` Wedding or anniversary date: ${one("when")}.` : ""}` : undefined} presetStyles={occLabel ? ["Couples", ...(occ === "honeymoon" ? ["Honeymoon"] : [])] : undefined} />
        <aside className="space-y-4 text-sm lg:pt-2">
          <h2 className="text-3xl font-extrabold">What happens next</h2>
          {["Your request goes straight to the planning team", "A planner calls or messages you on WhatsApp", "You get an itinerary and a clear price", "Pay the team only once you are happy"].map((s) => (
            <p key={s} className="flex gap-3 text-muted-foreground"><Check className="mt-0.5 size-4 shrink-0 text-brand" />{s}</p>
          ))}
          <p className="pt-2 text-xs text-muted-foreground">Response times are indicative. Availability and prices are confirmed in your quote.</p>
        </aside>
      </div>
    </>
  );
}
