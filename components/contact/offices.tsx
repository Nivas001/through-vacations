import { Clock, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { branches, mapEmbed, mapLink, tel } from "@/lib/site";
import { cn } from "@/lib/utils";

/** The two office cards with an embedded map. Server component; the map iframe loads lazily. */
export function Offices({ compact, className }: { compact?: boolean; className?: string }) {
  return (
    <div className={cn("grid gap-5 md:grid-cols-2", className)}>
      {branches.map((b, i) => {
        const query = b.address ? `${b.address}, ${b.city}` : b.mapQuery;
        return (
          <article key={b.id} className="card-lift flex min-w-0 flex-col overflow-hidden rounded-[1.5rem] border bg-card">
            {!compact && (
              <div className="relative aspect-[16/9] bg-muted">
                <iframe title={`Map showing ${b.name}`} src={mapEmbed(query)} className="absolute inset-0 size-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            )}
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <p className="text-xs font-bold tracking-[0.2em] text-brand uppercase">{i === 0 ? "Head office" : "City office"}</p>
              <h3 className="mt-1 text-3xl font-extrabold">{b.name}</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li className="flex gap-2.5"><MapPin className="mt-0.5 size-4 shrink-0 text-brand" /><span>{b.address ? `${b.address}, ${b.city}` : `${b.city}. Visits by appointment, so we can have your options ready.`}</span></li>
                <li className="flex gap-2.5"><Clock className="mt-0.5 size-4 shrink-0 text-brand" /><span>{b.hours}</span></li>
                <li className="flex gap-2.5"><Phone className="mt-0.5 size-4 shrink-0 text-brand" /><a href={tel(b.phone)} className="hover:text-brand">{b.phone}</a></li>
              </ul>
              <div className="mt-auto flex flex-wrap gap-2 pt-5">
                <a href={`https://wa.me/${b.whatsapp}?text=${encodeURIComponent(`Hi Through Vacations ${b.name}! I'd like to plan a trip.`)}`} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-bold text-white transition hover:brightness-95"><MessageCircle className="size-4" /> WhatsApp</a>
                <a href={mapLink(query)} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-full border-2 border-foreground px-4 text-sm font-bold transition hover:bg-foreground hover:text-background"><Navigation className="size-4" /> Directions</a>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
