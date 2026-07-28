"use client";

import {
  CircleUser,
  Codesandbox,
  LayoutGrid,
  MessageCircleMore,
  MonitorCog,
  ReceiptText,
  ShieldAlert,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";
import type * as React from "react";

import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { TeamSwitcher } from "./TeamSwitch";
import { NavMain } from "./NavMain";

const defaultUserData = {
  main: [
    {
      title: "Dashboard",
      path: "",
      icon: LayoutGrid,
    },
    {
      title: "Messages",
      path: "/messages",
      icon: MessageCircleMore,
    },
    {
      title: "Payments & Payouts",
      path: "/challenges",
      icon: Wallet,
    },
    {
      title: "Profile",
      path: "/profile",
      icon: CircleUser,
    },
  ],
  other: [
    {
      title: "Support",
      path: "/support",
      icon: MessageCircleMore,
    },
  ],
};

const adminUserData = {
  main: [
    {
      title: "Dashboard",
      path: "",
      icon: LayoutGrid,
    },
    {
      title: "Customers",
      path: "/users",
      icon: Users,
    },
    {
      title: "Merchants",
      path: "/category",
      icon: Codesandbox,
    },
    {
      title: "Invoices",
      path: "/invoices",
      icon: ReceiptText,
    },
    {
      title: "Payments & Payouts",
      path: "/challenges",
      icon: Wallet,
    },
    {
      title: "Messages",
      path: "/messages",
      icon: MessageCircleMore,
    },
  ],
  other: [
    {
      title: "Risk Monitoring",
      path: "/risk-monitoring",
      icon: ShieldAlert,
    },
    {
      title: "System Configuration",
      path: "/system-configuration",
      icon: MonitorCog,
    },
    {
      title: "Profile",
      path: "/profile",
      icon: CircleUser,
    },
    {
      title: "Access Management",
      path: "/access-management",
      icon: UserCog,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const currentUser = useSelector(selectCurrentUser) as {
    name?: string;
    email?: string;
    avatar?: string;
  } | null;
  const isAdminPath = pathname.startsWith("/dashboard/admin");
  const basePath = isAdminPath ? "/dashboard/admin" : "/dashboard";
  const navigationData = isAdminPath ? adminUserData : defaultUserData;

  const buildUrl = (path: string) => (path ? `${basePath}${path}` : basePath);

  return (
    <Sidebar
      collapsible="offcanvas"
      className="[--sidebar-primary:#10A34B] [--sidebar-primary-foreground:#FFFFFF]"
      {...props}
    >
      <SidebarContent className="px-3 pt-2">
        <TeamSwitcher
          teams={[
            { name: isAdminPath ? "Admin" : "Default", logo: () => null },
          ]}
          user={{
            name:
              currentUser?.name ??
              (isAdminPath ? "Admin User" : "Default User"),
            email:
              currentUser?.email ??
              (isAdminPath ? "admin@guicopay.gn" : "user@guicopay.gn"),
            avatar: currentUser?.avatar,
            roleLabel: isAdminPath ? "Admin" : "User",
          }}
        />
        <NavMain
          title={isAdminPath ? "Admin" : "Main"}
          items={navigationData.main.map((item) => ({
            title: item.title,
            url: buildUrl(item.path),
            icon: item.icon,
          }))}
        />
        <NavMain
          title={isAdminPath ? "Management" : "Other"}
          items={navigationData.other.map((item) => ({
            title: item.title,
            url: buildUrl(item.path),
            icon: item.icon,
          }))}
        />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
