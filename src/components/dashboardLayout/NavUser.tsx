"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-slate-800/60 data-[state=open]:text-white border border-slate-800 hover:bg-slate-800/40 hover:-translate-y-0.5 transition-all duration-300 rounded-xl glass-panel-hover"
            >
              <Avatar className="h-8 w-8 rounded-lg ring-2 ring-[#EF4444]/20 group-hover:ring-[#EF4444]/50 transition-all">
                <AvatarImage src={user.avatar || "https://github.com/shadcn.png"} />
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-slate-200 group-hover:text-white transition-colors">{user.name}</span>
                <span className="truncate text-[10px] font-mono text-slate-400 group-hover:text-slate-300 transition-colors">{user.email}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
