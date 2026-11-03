"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, CalendarCheck, CalendarDays, Globe, Inbox, LayoutDashboard, MessageSquareText, Package, Settings, Tag, Users } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { Logo } from "@/components/brand/logo";
import { useDb } from "@/lib/data/store";
import { inView, useBranchView } from "./branch-view";

export function AdminSidebar() {
  const path = usePathname();
  const { view } = useBranchView();
  const { bookings, enquiries, messages } = useDb();
  const { setOpenMobile } = useSidebar();
  const count = (rows: { status: string; branch?: "pondicherry" | "chennai" }[]) => rows.filter((r) => r.status === "new" && inView(view, r)).length;

  const groups = [
    {
      label: "Sales",
      items: [
        { href: "/admin", label: "Overview", icon: LayoutDashboard },
        { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck, badge: count(bookings) },
        { href: "/admin/calendar", label: "Calendar", icon: CalendarDays },
        { href: "/admin/enquiries", label: "Quote requests", icon: MessageSquareText, badge: count(enquiries) },
        { href: "/admin/messages", label: "Messages", icon: Inbox, badge: count(messages) },
        { href: "/admin/customers", label: "Customers", icon: Users },
      ],
    },
    {
      label: "Business",
      items: [
        { href: "/admin/packages", label: "Holidays", icon: Package },
        { href: "/admin/offers", label: "Offers", icon: Tag },
        { href: "/admin/branches", label: "Offices", icon: Building2 },
        { href: "/admin/settings", label: "Settings", icon: Settings },
      ],
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4"><Logo /><p className="mt-1 text-xs tracking-[0.18em] text-muted-foreground uppercase">Travel desk</p></SidebarHeader>
      <SidebarContent>
        {groups.map((g) => (
          <SidebarGroup key={g.label}>
            <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map(({ href, label, icon: Icon, badge }) => (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton isActive={href === "/admin" ? path === href : path.startsWith(href)} render={<Link href={href} onClick={() => setOpenMobile(false)} />}>
                      <Icon /> <span>{label}</span>
                    </SidebarMenuButton>
                    {!!badge && <SidebarMenuBadge className="rounded-full bg-primary text-primary-foreground!">{badge}</SidebarMenuBadge>}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu><SidebarMenuItem><SidebarMenuButton render={<Link href="/" target="_blank" />}><Globe /> <span>View website</span></SidebarMenuButton></SidebarMenuItem></SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
