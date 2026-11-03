import { SectionHeading } from "@/components/brand/section-heading";

/**
 * "Arjun's Loop", the brand film. Landscape on tablets and up, portrait on phones.
 * Each video only downloads when someone presses play (preload="none").
 */
export function BrandFilm() {
  return (
    <section className="mt-28">
      <SectionHeading eyebrow="Our film" title="Break the *loop*">
        One minute on why we do this. Arjun is stuck in a Monday-to-Friday loop until one tap sends him to the sea. Captions are on screen, so it works with the sound off.
      </SectionHeading>
      <div className="mt-10">
        <video
          className="card-lift hidden aspect-video w-full rounded-[1.75rem] border bg-[#070b24] sm:block"
          controls
          playsInline
          preload="none"
          poster="/media/film/arjun-loop-landscape.webp"
          aria-label="Through Vacations brand film, landscape"
        >
          <source src="/media/film/arjun-loop-landscape.mp4" type="video/mp4" />
        </video>
        <video
          className="card-lift mx-auto block aspect-[9/16] w-full max-w-sm rounded-[1.75rem] border bg-[#070b24] sm:hidden"
          controls
          playsInline
          preload="none"
          poster="/media/film/arjun-loop-portrait.webp"
          aria-label="Through Vacations brand film, portrait"
        >
          <source src="/media/film/arjun-loop-portrait.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
