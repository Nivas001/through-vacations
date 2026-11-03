"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Bell, Building2, ExternalLink, LogOut } from "lucide-react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { signOut, useSession } from "@/lib/admin-auth";
import { useDb } from "@/lib/data/store";
import { branchName } from "@/lib/site";
import { cn } from "@/lib/utils";
import { AdminSidebar } from "./admin-sidebar";
import { BranchViewProvider, inView, useBranchView, type BranchView } from "./branch-view";

export function DeskShell({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (session === null) router.replace(`/admin/login?next=${encodeURIComponent(path)}`);
  }, [session, path, router]);

  if (!session) {
    return (
      <div className="grid min-h-dvh place-items-center p-6" aria-busy="true">
        <div className="w-full max-w-md space-y-3"><Skeleton className="h-10 w-40" /><Skeleton className="h-28 w-full" /><Skeleton className="h-28 w-full" /></div>
      </div>
    );
  }

  return (
    <BranchViewProvider initial={session.branch}>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset className="min-w-0">
          <TopBar />
          <div className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </BranchViewProvider>
  );
}

function TopBar() {
  const session = useSession();
  const router = useRouter();
  const { view, setView } = useBranchView();
  const { bookings, enquiries, messages } = useDb();
  const fresh = [
    { n: bookings.filter((b) => b.status === "new" && inView(view, b)).length, label: "new bookings", href: "/admin/bookings?status=new" },
    { n: enquiries.filter((e) => e.status === "new" && inView(view, e)).length, label: "new quote requests", href: "/admin/enquiries?status=new" },
    { n: messages.filter((m) => m.status === "new" && inView(view, m)).length, label: "unread messages", href: "/admin/messages" },
  ];
  const total = fresh.reduce((a, f) => a + f.n, 0);
  const locked = session?.role === "staff";
  const options: { v: BranchView; label: string }[] = [{ v: "all", label: "Both offices" }, { v: "pondicherry", label: "Pondicherry" }, { v: "chennai", label: "Chennai" }];

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background/85 px-3 backdrop-blur sm:px-4">
      <SidebarTrigger />
      <div className="flex min-w-0 items-center gap-1 rounded-full bg-muted p-1" role="group" aria-label="Office">
        <Building2 className="mx-1.5 hidden size-4 shrink-0 text-muted-foreground sm:block" />
        {options.filter((o) => !locked || o.v === session?.branch).map((o) => (
          <button key={o.v} type="button" onClick={() => setView(o.v)} aria-pressed={view === o.v}
            className={cn("h-7 rounded-full px-2.5 text-xs font-bold whitespace-nowrap transition sm:px-3", view === o.v ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
            {o.v === "all" ? <><span className="sm:hidden">Both</span><span className="hidden sm:inline">{o.label}</span></> : o.v === "pondicherry" ? <><span className="sm:hidden">Pondy</span><span className="hidden sm:inline">{o.label}</span></> : o.label}
          </button>
        ))}
      </div>
      <span className="ml-auto hidden rounded-full bg-sun/30 px-2.5 py-1 text-[0.7rem] font-bold text-sun-foreground md:inline dark:text-sun">Demo data · saved in this browser</span>

      <DropdownMenu>
        <DropdownMenuTrigger className="relative ml-auto grid size-9 shrink-0 place-items-center rounded-full hover:bg-muted md:ml-0" aria-label={`Notifications${total ? ` (${total})` : ""}`}>
          <Bell className="size-[1.1rem]" />
          {total > 0 && <span className="absolute -top-0.5 -right-0.5 grid min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[0.6rem] font-bold text-white">{total}</span>}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Needs attention</DropdownMenuLabel>
            {fresh.map((f) => (
              <DropdownMenuItem key={f.label} onClick={() => router.push(f.href)}>
                <span className="grid min-w-6 place-items-center rounded-full bg-secondary px-1.5 text-xs font-bold text-secondary-foreground">{f.n}</span> {f.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground" aria-label="Account">
          {session?.name.slice(0, 1)}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <span className="block text-sm font-semibold text-foreground">{session?.name}</span>
              <span className="block truncate text-xs font-normal">{session?.email}</span>
              <span className="block text-xs font-normal">{session?.branch === "all" ? "Both offices" : `${branchName(session?.branch)} office`}</span>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href="/" target="_blank" />}><ExternalLink /> Open website</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { signOut(); router.replace("/admin/login"); }}><LogOut /> Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
