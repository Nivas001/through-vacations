import { cn } from "@/lib/utils";

const tone: Record<string, string> = {
  new: "bg-primary/10 text-primary", contacted: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  quoted: "bg-amber-500/15 text-amber-700 dark:text-amber-300", confirmed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  paid: "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300", won: "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300",
  completed: "bg-muted text-muted-foreground", closed: "bg-muted text-muted-foreground", cancelled: "bg-destructive/10 text-destructive",
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", tone[status])}>{status}</span>;
}
