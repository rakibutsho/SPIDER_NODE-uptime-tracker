"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { logout } from "@/redux/features/auth/authSlice";
import Cookies from "js-cookie";
import { Logout01Icon as LogOut } from "hugeicons-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import * as React from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export function TeamSwitcher({
  user,
}: {
  teams?: { name: string; logo: React.ElementType }[];
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
    roleLabel?: string;
  };
}) {
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const dispatch = useDispatch();
  const displayName = user?.name ?? "OPERATOR";
  const displayEmail = user?.email ?? "operator@spidernode.site";

  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove("token");
    toast.success("Logged out successfully!");
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Sidebar Top Wordmark */}
      <SidebarMenu>
        <SidebarMenuItem>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-4 border-b border-white/10 w-full group"
          >
            <div className="w-2.5 h-6 bg-[#EF4444]" />
            <Image
              src={logo}
              alt="SpiderNode Logo"
              width={36}
              height={36}
              className="w-8 h-8 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-[-0.04em] text-white uppercase leading-none">
                SpiderNode
              </span>
              <span className="text-[9px] font-mono tracking-[0.22em] text-[#8E929B] uppercase mt-0.5">
                Operator Console
              </span>
            </div>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Operator Metadata Strip */}
      <div className="px-3 py-2 border-b border-white/10 text-left font-mono">
        <div className="text-[9px] uppercase tracking-[0.2em] text-[#8E929B]">
          LOGGED AS //
        </div>
        <div className="text-xs font-bold text-white truncate mt-0.5">
          {displayName}
        </div>
        <div className="text-[10px] text-[#8E929B] truncate">
          {displayEmail}
        </div>
      </div>

      {/* Footer User and Logout */}
      <div className="absolute bottom-4 left-3 right-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setShowLogoutModal(true)}
              className="h-auto justify-start gap-2 rounded-none bg-transparent px-3 py-2.5 text-xs font-mono font-bold uppercase tracking-[0.15em] text-[#EF4444] hover:bg-[#EF4444]/10 border border-transparent hover:border-[#EF4444]/20 transition-colors w-full cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>TERMINATE SESSION</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>

      {/* Swiss Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-sm rounded-none bg-[#121316] border border-white/20 p-6 text-white text-left">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-[#EF4444]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#EF4444] font-bold">
                CONFIRMATION REQUIRED
              </span>
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight text-white">
              Terminate Active Session?
            </h3>
            <p className="mt-2 text-xs text-[#A0A4AD] leading-relaxed">
              You will be signed out of the SpiderNode management interface on
              this terminal.
            </p>
            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-[#A0A4AD] hover:text-white border border-white/15 hover:border-white/40 transition-colors rounded-none cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
                className="bg-[#EF4444] hover:bg-[#DC2626] px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider text-white transition-colors rounded-none cursor-pointer"
              >
                CONFIRM LOGOUT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
