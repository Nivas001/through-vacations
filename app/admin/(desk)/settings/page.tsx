import type { Metadata } from "next";
import { SettingsForm } from "@/components/admin/settings-form";
/** Rendered after client-side sign-in; nothing to validate on the server. */
export const instant = false;
export const metadata: Metadata = { title: "Settings" };
export default function Page() {
  return <SettingsForm />;
}
