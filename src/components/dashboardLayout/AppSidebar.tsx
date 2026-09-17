"use client";

import {
  UserCircle02Icon as CircleUser,
  CodesandboxIcon as Codesandbox,
  GlobeIcon as Globe,
  LayoutGridIcon as LayoutGrid,
  Message01Icon as MessageCircleMore,
  ComputerSettingsIcon as MonitorCog,
  File01Icon as ReceiptText,
  Shield01Icon as ShieldAlert,
  AccountSetting01Icon as UserCog,
  UserMultiple02Icon as Users,
  Wallet01Icon as Wallet,
} from "hugeicons-react";
type LucideIcon = React.ElementType;
import type * as React from "react";

import { useSession } from "next-auth/react";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { TeamSwitcher } from "./TeamSwitch";
import { NavMain } from "./NavMain";

type NavigationItem = {
  title: string;
  path: string;
  icon: LucideIcon;
};

type NavigationData = {
  main: NavigationItem[];
  other?: NavigationItem[];
};

const defaultUserData: NavigationData = {
  main: [
    {
      title: "Dashboard",
      path: "",
      icon: LayoutGrid,
    },
    // {
    //   title: "Monitors",
    //   path: "",
    //   icon: MonitorCog,
    // },
    {
      title: "Incidents",
      path: "/incidents",
      icon: ShieldAlert,
    },
    {
      title: "Profile",
      path: "/profile",
      icon: CircleUser,
    },
  ],
  other: [
    {
      title: "Status Page",
      path: "/status",
      icon: Globe,
    },
  ],
};

const adminUserData: NavigationData = {
  main: [
    {
      title: "Dashboard",
      path: "",
      icon: LayoutGrid,
    },
    {
      title: "User Management",
      path: "/users",
      icon: Users,
    },
    {
      title: "Role & Permissions",
      path: "/roles",
      icon: UserCog,
    },
  ],
  other: [
    {
      title: "Audit Logs",
      path: "/audit-logs",
      icon: ReceiptText,
    },
    {
      title: "System Settings",
      path: "/settings",
      icon: Codesandbox,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const currentUser = useSelector(selectCurrentUser) as {
    name?: string;
    email?: string;
    avatar?: string;
  } | null;
  const isAdminPath = pathname.startsWith("/dashboard/admin");
  const basePath = isAdminPath ? "/dashboard/admin" : "/dashboard";
  const navigationData = isAdminPath ? adminUserData : defaultUserData;

  const buildUrl = (path: string) => (path ? `${basePath}${path}` : basePath);

  const userName =
    session?.user?.name ||
    currentUser?.name ||
    (isAdminPath ? "Admin Operator" : "Operator");
  const userEmail =
    session?.user?.email ||
    currentUser?.email ||
    (isAdminPath ? "admin@spidernode.com" : "operator@spidernode.site");
  const userAvatar = session?.user?.image || currentUser?.avatar;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent className="px-3 pt-2">
        <TeamSwitcher
          teams={[
            { name: isAdminPath ? "Admin" : "Default", logo: () => null },
          ]}
          user={{
            name: userName,
            email: userEmail,
            avatar: userAvatar,
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
        {navigationData.other && navigationData.other.length > 0 && (
          <NavMain
            title={isAdminPath ? "Management" : "Other"}
            items={navigationData.other.map((item) => ({
              title: item.title,
              url: buildUrl(item.path),
              icon: item.icon,
            }))}
          />
        )}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
