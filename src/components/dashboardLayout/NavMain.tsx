"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { LucideIcon } from "lucide-react";
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
    icon?: LucideIcon;
    isActive?: boolean;
    onClick?: () => void;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      {title && (
        <p className="px-2 pb-2 pt-1 text-xs font-medium text-[#8A8D91]">
          {title}
        </p>
      )}
      <SidebarMenu className="space-y-1">
        {items.map((item) => {
          const active =
            item.isActive ||
            pathname === item.url ||
            pathname.startsWith(`${item.url}/`);

          return (
            <SidebarMenuItem key={item.title}>
              <Link href={item.url}>
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={item.onClick}
                  className={`flex items-center gap-4 rounded-xl px-3 py-2.5 w-full cursor-pointer text-center transition-colors ${
                    active
                      ? "text-white bg-linear-to-r from-[#10A34B] to-[#0B843C] font-medium hover:from-[#0B843C] hover:to-[#0B843C] hover:text-white"
                      : "text-[#8A8D91] hover:bg-white/80 hover:text-[#3A3A3A]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span className="text-sm font-medium">{item.title}</span>
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
