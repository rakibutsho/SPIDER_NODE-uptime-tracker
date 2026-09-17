"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { logout } from "@/redux/features/auth/authSlice";
import Cookies from "js-cookie";
import {
  Logout01Icon as LogOut,
  Activity01Icon as Activity,
} from "hugeicons-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

export function TeamSwitcher({
  teams,
  user,
}: {
  teams: { name: string; logo: React.ElementType }[];
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
    roleLabel?: string;
  };
}) {
  const [activeTeam] = React.useState(teams[0]);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const dispatch = useDispatch();
  const displayName = user?.name ?? "Default User";
  const displayEmail = user?.email ?? "user@spidernode.com";
  const displayAvatar = user?.avatar ?? "https://github.com/shadcn.png";
  const displayFallback =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U";

  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove("token");
    toast.success("Logged out successfully!");
    signOut({ callbackUrl: "/login" });
  };

  if (!activeTeam) {
    return null;
  }

  return (
    <div className="space-y-5">
      {/* Sidebar top logo */}
      <SidebarMenu>
        <SidebarMenuItem>
          <Link href={"/"} className="flex items-center gap-3 px-2 py-3">
            {/* <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-black text-[#EF4444] shadow-sm">
              <Activity className="size-6" />
            </div> */}
            <Image
              src={logo}
              alt="Logo"
              width={50}
              height={50}
              className="w-12 h-12 object-contain"
            />
            <span className="text-xl font-bold tracking-tight text-white font-mono">
              Spider<span className="text-[#EF4444]">Node</span>
            </span>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Footer user and logout */}
      <div className="absolute bottom-4 left-4 right-4">
        {/* <div className="mb-4 flex items-center gap-3 rounded-xl bg-white/70 p-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src={displayAvatar} alt={displayName} />
            <AvatarFallback>{displayFallback}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-[#111827]">
              {displayName}
            </p>
            <p className="truncate text-[11px] text-[#8A8D91]">
              {displayEmail}
            </p>
          </div>
        </div> */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setShowLogoutModal(true)}
              className="h-auto justify-start gap-2 rounded-lg bg-transparent px-2 py-2 text-sm font-semibold text-[#DE251F] hover:bg-[#DE251F]/10 hover:text-[#DE251F]"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#0B0F19] border border-white/10 p-6 shadow-2xl text-white animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-semibold tracking-tight text-white">
              Log Out
            </h3>
            <p className="mt-2 text-sm text-gray-400">
              Are you sure you want to log out of SpiderNode?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
                className="rounded-lg bg-[#DE251F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#DE251F]/90 transition-colors shadow-sm cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
