"use client";
import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/brand/link-button";
import { whatsappLink } from "@/lib/site";

export default function SiteError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section className="mx-auto grid min-h-[60vh] max-w-xl place-items-center px-4 text-center">
      <div>
        <p className="text-xs font-bold tracking-[0.2em] text-brand uppercase">Turbulence</p>
        <h1 className="mt-3 text-5xl font-extrabold sm:text-7xl">Something went wrong.</h1>
        <p className="mt-4 text-muted-foreground">This page hit a bump. Try again, or message us and we will help straight away.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button className="h-11 rounded-full px-6" onClick={() => retry()}><RotateCcw /> Try again</Button>
          <LinkButton href="/" variant="outline" className="h-11 rounded-full border-2 border-foreground px-6">Back home</LinkButton>
          <a href={whatsappLink()} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center rounded-full px-4 text-sm font-semibold text-brand hover:underline">WhatsApp us</a>
        </div>
      </div>
    </section>
  );
}
