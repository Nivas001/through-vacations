import { Suspense } from "react";
import { DeskShell } from "@/components/admin/desk-shell";

export default function DeskLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense fallback={null}>
      <DeskShell>{children}</DeskShell>
    </Suspense>
  );
}
