"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, Globe, LayoutDashboard, MessageSquareText, Package, Settings } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Logo } from "@/components/brand/logo";

const items = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/enquiries", label: "Quote requests", icon: MessageSquareText },
  { href: "/admin/packages", label: "Holidays", icon: Package },
  { href: "/admin/settings", label: "Site settings", icon: Settings },
];

export function AdminSidebar() {
  const path = usePathname();
  return (
    <Sidebar>
      <SidebarHeader className="p-4"><Logo /><p className="mt-1 text-xs tracking-[0.18em] text-muted-foreground uppercase">Travel desk</p></SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton isActive={href === "/admin" ? path === href : path.startsWith(href)} render={<Link href={href} />}>
                    <Icon /> <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu><SidebarMenuItem><SidebarMenuButton render={<Link href="/" />}><Globe /> <span>View website</span></SidebarMenuButton></SidebarMenuItem></SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
