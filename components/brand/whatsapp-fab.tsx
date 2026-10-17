import { MessageCircle, Phone } from "lucide-react";
import { tel, whatsappLink } from "@/lib/site";

export function ContactFab() {
  return (
    <div className="fixed right-4 bottom-24 z-40 flex flex-col gap-2 lg:right-6 lg:bottom-6">
      <a
        href={tel()}
        aria-label="Call Through Vacations"
        className="grid size-12 place-items-center rounded-full bg-card text-brand shadow-lg ring-1 ring-border transition hover:scale-105 sm:hidden"
      >
        <Phone className="size-5" />
      </a>
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="grid size-12 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105"
      >
        <MessageCircle className="size-6" />
      </a>
    </div>
  );
}
