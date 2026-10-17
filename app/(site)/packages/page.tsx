import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPackages } from "@/lib/data/packages";
import { PackageBrowser } from "@/components/packages/package-browser";
import { PageIntro } from "@/components/layout/page-intro";

export const metadata: Metadata = { title: "Holidays" };

const moods = [
  { label: "Beaches", style: "Beach", img: "/media/maldives.webp" },
  { label: "Mountains", style: "Nature", img: "/media/ladakh.webp" },
  { label: "Cities", style: "City", img: "/media/singapore.webp" },
  { label: "Honeymoon", style: "Honeymoon", img: "/media/kashmir.webp" },
  { label: "Culture", style: "Culture", img: "/media/udaipur-jaipur.webp" },
];

export default async function PackagesPage({ searchParams }: PageProps<"/packages">) {
  const sp = await searchParams;
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k][0] : sp[k]) as string | undefined;
  const packages = await getPackages();
  const india = packages.filter((p) => p.region === "India").length;
  return (
    <>
      <PageIntro
        eyebrow="Holidays"
        title="Find the trip that *fits*"
        aside={
          <ul className="grid grid-cols-5 gap-2 sm:gap-3" aria-label="Start with a mood">
            {moods.map((m, i) => (
              <li key={m.label} className={i % 2 ? "translate-y-3" : ""}>
                <Link href={`/packages?style=${m.style}`} className="group relative block aspect-[3/5] overflow-hidden rounded-2xl">
                  <Image src={m.img} alt="" fill sizes="(min-width:1024px) 10vw, 20vw" className="object-cover transition duration-700 group-hover:scale-110" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute inset-x-1.5 bottom-2 text-center text-[0.6rem] font-bold tracking-wider text-white uppercase sm:text-xs">{m.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        }
      >
        {packages.length} journeys, {india} across India and {packages.length - india} beyond. Every holiday is tailored, so use these as a starting point.
      </PageIntro>
      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <PackageBrowser
          packages={packages}
          initial={{
            q: one("q") ?? "",
            region: (one("region") as "India" | "International") ?? "",
            style: (one("style") as never) ?? "",
            maxNights: Number(one("maxNights")) || 0,
            maxPrice: Number(one("maxPrice")) || 0,
            month: Number(one("month")) || 0,
          }}
        />
      </div>
    </>
  );
}
