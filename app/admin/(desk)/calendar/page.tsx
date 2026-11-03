import type { Metadata } from "next";
import { DeparturesCalendar } from "@/components/admin/calendar";
/** Rendered after client-side sign-in; nothing to validate on the server. */
export const instant = false;
export const metadata: Metadata = { title: "Calendar" };
export default function Page() {
  return <DeparturesCalendar />;
}
