import type { Metadata } from "next";
import sources from "@/lib/mock/image-sources.json";
import { PageIntro } from "@/components/layout/page-intro";

export const metadata: Metadata = { title: "Image credits" };

type Src = { name: string; page: string; author?: string; license?: string };

export default function CreditsPage() {
  const list = sources as Src[];
  return (
    <>
      <PageIntro eyebrow="Credits" title="Image *credits*">Destination photography is illustrative imagery from Unsplash and Wikimedia Commons. It shows places, not completed customer trips.</PageIntro>
      <ul className="mx-auto max-w-4xl divide-y rounded-[1.5rem] border bg-card px-4 sm:px-6 card-lift">
        {list.map((s) => (
          <li key={s.name} className="grid items-center gap-x-4 gap-y-1 py-3.5 sm:grid-cols-[10rem_1fr_auto]">
            <span className="font-bold capitalize">{s.name.replace(/-/g, " ")}</span>
            <span className="text-sm text-muted-foreground">{s.author || "Unknown"} · {s.license}</span>
            <a href={s.page} target="_blank" rel="noreferrer" className="text-sm font-bold text-brand underline underline-offset-4">Source</a>
          </li>
        ))}
      </ul>
      <p className="mx-auto mt-6 max-w-4xl px-4 text-sm text-muted-foreground sm:px-6">Logo and promotional posters are from the Through Vacations Instagram profile. The paper-cut travel artwork is AI-generated and decorative. Images are cropped and resized; licences are CC BY, CC BY-SA, CC0 or Unsplash as listed.</p>
    </>
  );
}
