import type { Metadata } from "next";
import { SettingsForm } from "@/components/admin/settings-form";
export const metadata: Metadata = { title: "Site settings" };
export default function Page() {
  return (<><h1 className="mb-6 text-4xl font-extrabold">Site settings</h1><SettingsForm /></>);
}
