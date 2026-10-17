"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { siteDefaults } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";

const labels: Record<keyof SiteSettings, string> = { headline: "Homepage headline", intro: "Intro text", email: "Public email", phone: "Phone", whatsapp: "WhatsApp number (digits, with country code)", instagram: "Instagram URL", location: "Location" };

export function SettingsForm() {
  const [s, setS] = useState<SiteSettings>(siteDefaults);
  return (
    <form className="grid max-w-2xl gap-4" onSubmit={(e) => { e.preventDefault(); toast.success("Saved locally (demo). Not applied to the site yet."); }}>
      {(Object.keys(labels) as (keyof SiteSettings)[]).map((k) => (
        <div key={k} className="space-y-1.5"><Label htmlFor={k}>{labels[k]}</Label>
          {k === "intro" ? <Textarea id={k} rows={3} value={s[k]} onChange={(e) => setS({ ...s, [k]: e.target.value })} /> : <Input id={k} value={s[k]} onChange={(e) => setS({ ...s, [k]: e.target.value })} />}
        </div>
      ))}
      <div><Button type="submit">Save settings</Button></div>
    </form>
  );
}
