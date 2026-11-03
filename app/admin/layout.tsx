import type { Metadata } from "next";

/** The desk renders after sign-in on the client, so there is no server shell to validate. */
export const instant = false;

export const metadata: Metadata = { title: { default: "Travel desk", template: "%s | Travel desk" }, robots: { index: false, follow: false } };

export default function AdminRoot({ children }: LayoutProps<"/admin">) {
  return children;
}
