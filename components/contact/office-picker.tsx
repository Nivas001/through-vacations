"use client";
import { Label } from "@/components/ui/label";
import type { BranchId } from "@/lib/types";
import { cn } from "@/lib/utils";

export type OfficeChoice = BranchId | "auto";

const options: { v: OfficeChoice; label: string }[] = [
  { v: "auto", label: "Either" },
  { v: "pondicherry", label: "Pondicherry" },
  { v: "chennai", label: "Chennai" },
];

export function OfficePicker({ value, onChange }: { value: OfficeChoice; onChange: (v: OfficeChoice) => void }) {
  return (
    <div>
      <Label className="mb-2 block">Which office should look after you?</Label>
      <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Preferred office">
        {options.map((o) => (
          <button key={o.v} type="button" role="radio" aria-checked={value === o.v} onClick={() => onChange(o.v)}
            className={cn("h-10 rounded-xl border px-2 text-sm font-semibold transition", value === o.v ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary/50")}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
