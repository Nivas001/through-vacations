"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/admin-auth";
import { useDb, useHydrated } from "@/lib/data/store";
import { addOnOptions } from "@/lib/pricing";
import { packages as catalogue } from "@/lib/mock/packages";
import { formatINR } from "@/lib/site";
import { balanceOf, paidOf } from "./payments";

const long = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
const methodLabel = { upi: "UPI", cash: "Cash", card: "Card", bank: "Bank transfer" } as const;

/** A branded, printable summary of one booking. Print or "Save as PDF" from the browser. */
export function BookingConfirmation() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const session = useSession();
  const hydrated = useHydrated();
  const db = useDb();

  useEffect(() => {
    if (session === null) router.replace(`/admin/login?next=/admin/invoice/${id}`);
  }, [session, id, router]);

  if (!session || !hydrated) return null;
  const b = db.bookings.find((x) => x.id === id);
  if (!b) return <div className="grid min-h-dvh place-items-center p-6 text-center"><div><p className="text-2xl font-extrabold">Booking not found</p><Link href="/admin/bookings" className="mt-3 inline-block text-brand underline">Back to bookings</Link></div></div>;

  const office = db.branches.find((x) => x.id === b.branch) ?? db.branches[0];
  const pkg = (db.packages ?? catalogue).find((p) => p.slug === b.packageSlug);
  const nights = pkg?.nights;
  const end = nights ? new Date(new Date(b.startDate).getTime() + nights * 864e5).toISOString() : null;
  const paid = paidOf(b);
  const due = balanceOf(b);

  return (
    <div className="min-h-dvh bg-muted py-6 print:bg-white print:py-0">
      <div className="mx-auto mb-4 flex max-w-3xl items-center justify-between gap-3 px-4 print:hidden">
        <Button variant="ghost" onClick={() => (window.history.length > 1 ? router.back() : router.push("/admin/bookings"))}><ArrowLeft /> Back</Button>
        <Button onClick={() => window.print()}><Printer /> Print or save as PDF</Button>
      </div>

      <article className="mx-auto max-w-3xl bg-white p-6 text-[#070b24] shadow-xl sm:p-10 print:max-w-none print:p-0 print:shadow-none">
        <header className="flex flex-wrap items-start justify-between gap-6 border-b-4 border-[#1e4be6] pb-6">
          <div className="flex items-center gap-3">
            <Image src="/media/logo.jpg" alt="" width={56} height={56} className="size-14 rounded-xl" />
            <div className="leading-tight">
              <p className="font-logo text-3xl">through</p>
              <p className="text-[0.65rem] font-semibold tracking-[0.32em] uppercase opacity-70">vacations</p>
            </div>
          </div>
          <div className="text-right text-xs leading-relaxed text-[#4a5075]">
            <p className="font-bold text-[#070b24]">Through Vacations · {office.name} office</p>
            <p>{office.address ? `${office.address}, ${office.city}` : office.city}</p>
            <p>{office.phone} · {office.email}</p>
          </div>
        </header>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#1e4be6] uppercase">Booking confirmation</p>
            <h1 className="mt-1 text-4xl font-extrabold">{b.packageTitle}</h1>
          </div>
          <dl className="text-right text-sm">
            <div><dt className="inline text-[#4a5075]">Reference </dt><dd className="inline font-mono font-bold">{b.reference}</dd></div>
            <div><dt className="inline text-[#4a5075]">Issued </dt><dd className="inline">{long(new Date().toISOString())}</dd></div>
          </dl>
        </div>

        <section className="mt-8 grid gap-6 sm:grid-cols-2">
          <Block title="Guest">
            <p className="font-semibold">{b.lead.name}</p>
            <p>{b.lead.phone}</p>
            {b.lead.email && <p>{b.lead.email}</p>}
            <p>{b.lead.city}, {b.lead.country}</p>
          </Block>
          <Block title="Trip">
            <p><span className="text-[#4a5075]">Travel </span>{long(b.startDate)}{end ? ` to ${long(end)}` : ""}</p>
            {pkg && <p><span className="text-[#4a5075]">Duration </span>{pkg.durationLabel}</p>}
            <p><span className="text-[#4a5075]">Travellers </span>{b.adults} adult{b.adults > 1 ? "s" : ""}{b.children ? `, ${b.children} child${b.children > 1 ? "ren" : ""}` : ""}</p>
            <p><span className="text-[#4a5075]">Rooms </span>{b.rooms}</p>
            {!!b.addOns.length && <p><span className="text-[#4a5075]">Add-ons </span>{b.addOns.map((a) => addOnOptions.find((o) => o.id === a)?.label).join(", ")}</p>}
          </Block>
        </section>

        {pkg && !!pkg.inclusions.length && (
          <section className="mt-6">
            <Block title="Included">
              <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">{pkg.inclusions.slice(0, 8).map((x) => <li key={x}>• {x}</li>)}</ul>
            </Block>
          </section>
        )}

        <section className="mt-8 overflow-hidden rounded-xl border border-[#d9dff1]">
          <table className="w-full text-sm">
            <thead className="bg-[#e8eeff] text-left text-xs tracking-wider text-[#0a1a7a] uppercase">
              <tr><th className="px-4 py-2.5">Description</th><th className="px-4 py-2.5 text-right">Amount</th></tr>
            </thead>
            <tbody className="divide-y divide-[#d9dff1]">
              <tr><td className="px-4 py-3">{b.packageTitle} for {b.adults + b.children} traveller{b.adults + b.children > 1 ? "s" : ""}</td><td className="px-4 py-3 text-right tabular-nums">{b.estimate ? formatINR(b.estimate) : "As quoted"}</td></tr>
              {(b.payments ?? []).map((p) => (
                <tr key={p.id} className="text-[#4a5075]"><td className="px-4 py-2.5">Received {long(p.at)} · {methodLabel[p.method]}{p.note ? ` · ${p.note}` : ""}</td><td className="px-4 py-2.5 text-right tabular-nums">−{formatINR(p.amount)}</td></tr>
              ))}
            </tbody>
            <tfoot className="bg-[#f1f3fa] font-bold">
              <tr><td className="px-4 py-2.5">Paid so far</td><td className="px-4 py-2.5 text-right tabular-nums">{formatINR(paid)}</td></tr>
              <tr className="text-base"><td className="px-4 py-3">Balance due</td><td className={"px-4 py-3 text-right tabular-nums " + (due ? "text-[#b75000]" : "text-[#007956]")}>{b.estimate ? (due ? formatINR(due) : "Paid in full") : "—"}</td></tr>
            </tfoot>
          </table>
        </section>

        <footer className="mt-8 space-y-1 border-t border-[#d9dff1] pt-5 text-xs text-[#4a5075]">
          <p>Please quote your reference {b.reference} in all messages. Hotel names, timings and transfers are shared in your travel documents.</p>
          <p>Prices and inclusions are as agreed in your personal quote. For changes, contact the {office.name} office on {office.phone}.</p>
          <p className="pt-2 font-semibold text-[#070b24]">Thank you for travelling with Through Vacations.</p>
        </footer>
      </article>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-[#f1f3fa] p-4 text-sm leading-relaxed">
      <p className="mb-1.5 text-[0.7rem] font-bold tracking-[0.18em] text-[#1e4be6] uppercase">{title}</p>
      {children}
    </div>
  );
}
