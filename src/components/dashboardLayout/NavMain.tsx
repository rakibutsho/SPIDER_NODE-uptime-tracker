"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain({
  title,
  items,
}: {
  title?: string;
  items: {
    title: string;
    url: string;
    icon?: React.ElementType;
    isActive?: boolean;
    onClick?: () => void;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup className="py-2">
      {title && (
        <p className="px-3 pb-2 pt-2 text-[10px] font-mono uppercase tracking-[0.25em] text-[#EF4444] font-bold">
          // {title}
        </p>
      )}
      <SidebarMenu className="space-y-1">
        {items.map((item) => {
          const active =
            item.isActive ||
            pathname === item.url ||
            (pathname.startsWith(`${item.url}/`) &&
              item.url !== "/dashboard" &&
              item.url !== "/dashboard/admin");

          return (
            <SidebarMenuItem key={item.title}>
              <Link href={item.url} className="w-full block">
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={item.onClick}
                  className={`flex items-center gap-3 px-3 py-2.5 w-full cursor-pointer text-left transition-colors rounded-none ${
                    active
                      ? "text-white bg-white/[0.05] border-l-2 border-[#EF4444] font-bold"
                      : "text-[#8E929B] hover:text-white hover:bg-white/[0.02] border-l-2 border-transparent font-medium"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span className="text-xs uppercase tracking-[0.1em]">
                      {item.title}
                    </span>
                  </div>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
