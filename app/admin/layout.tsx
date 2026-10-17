import type { Metadata } from "next";
import { Suspense } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata: Metadata = { title: { default: "Travel desk", template: "%s | Travel desk" }, robots: { index: false } };

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <SidebarProvider>
      <Suspense fallback={null}>
        <AdminSidebar />
      </Suspense>
      <SidebarInset>
        <header className="flex h-14 items-center gap-3 border-b px-4">
          <SidebarTrigger />
          <p className="text-sm text-muted-foreground">Demo mode · changes live in this browser only · Supabase and sign-in pending</p>
        </header>
        <div className="p-4 sm:p-8">
          <Suspense fallback={null}>{children}</Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
