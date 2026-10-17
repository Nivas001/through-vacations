import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-3", className)} aria-label="Through Vacations home">
      <Image src="/media/logo.jpg" alt="" width={44} height={44} className="size-11 rounded-xl" priority />
      <span className={cn("leading-none", light ? "text-white" : "text-foreground")}>
        <span className="font-logo block text-[1.7rem]">through</span>
        <span className="mt-0.5 block text-[0.65rem] font-semibold tracking-[0.32em] uppercase opacity-70">vacations</span>
      </span>
    </Link>
  );
}
