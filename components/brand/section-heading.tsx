import { cn } from "@/lib/utils";

/** Wraps *word* in the slanted brand accent, e.g. "Journeys we *love*". */
export function Accent({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/g).map((part, i) =>
        part.startsWith("*") ? (
          <em key={i} className={cn("serif-i font-extrabold text-brand", className)}>{part.slice(1, -1)}</em>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  children,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-3.5 py-1.5 text-[0.7rem] font-bold tracking-[0.18em] text-secondary-foreground uppercase">
          <span className="size-2 rounded-full bg-sun ring-2 ring-sun/40" />
          {eyebrow}
        </p>
      )}
      <h2 className="text-4xl leading-[0.98] font-extrabold uppercase sm:text-6xl">
        <Accent text={title} />
      </h2>
      {children && <p className="mt-5 text-base text-muted-foreground sm:text-lg">{children}</p>}
    </div>
  );
}
