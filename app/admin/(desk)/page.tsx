import { Overview } from "@/components/admin/overview";
/** Rendered after client-side sign-in; nothing to validate on the server. */
export const instant = false;
export default function AdminHome() {
  return <Overview />;
}
