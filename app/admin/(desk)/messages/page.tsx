import type { Metadata } from "next";
import { MessagesAdmin } from "@/components/admin/messages";
/** Rendered after client-side sign-in; nothing to validate on the server. */
export const instant = false;
export const metadata: Metadata = { title: "Messages" };
export default function Page() {
  return <MessagesAdmin />;
}
