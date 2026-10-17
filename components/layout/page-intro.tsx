import { Accent } from "@/components/brand/section-heading";
import { cn } from "@/lib/utils";

/** Compact editorial page header on the paper background. Use *word* in the title for the serif accent. */
export function PageIntro({
  eyebrow,
  title,
  children,
  aside,
  className,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mx-auto max-w-7xl px-4 pt-6 pb-10 sm:px-6 sm:pt-10", className)}>
      <div className={cn("grid items-end gap-10", aside && "lg:grid-cols-[1.1fr_0.9fr]")}>
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-sun px-3.5 py-1.5 text-[0.7rem] font-bold tracking-[0.18em] text-sun-foreground uppercase">{eyebrow}</p>
          <h1 className="max-w-4xl text-5xl leading-[0.96] font-extrabold sm:text-7xl">
            <Accent text={title} />
          </h1>
          {children && <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">{children}</p>}
        </div>
        {aside}
      </div>
    </section>
  );
}
