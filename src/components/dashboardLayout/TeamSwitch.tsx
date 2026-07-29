"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { logout } from "@/redux/features/auth/authSlice";
import Cookies from "js-cookie";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import * as React from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import Swal from "sweetalert2";

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
  const dispatch = useDispatch();
  const displayName = user?.name ?? "Default User";
  const displayEmail = user?.email ?? "user@guicopay.gn";
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

  const handleLogoutClick = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Log Out",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#0B843C",
      cancelButtonColor: "#6B7280",
      background: "#FFFFFF",
      color: "#111827",
    });

    if (result.isConfirmed) {
      handleLogout();
    }
  };

  if (!activeTeam) {
    return null;
  }

  return (
    <div className="space-y-5">
      {/* Sidebar top logo */}
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-2 px-2 py-3">
            {/* <Image
              src={Logo}
              alt="logo"
              width={48}
              height={48}
              priority
              className="rounded-md"
            /> */}
            <h2 className="text-[26px] font-semibold text-[#111827]">
              Guicopay
            </h2>
          </div>
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
              onClick={handleLogoutClick}
              className="h-auto justify-start gap-2 rounded-lg bg-transparent px-2 py-2 text-sm font-semibold text-[#DE251F] hover:bg-[#DE251F]/10 hover:text-[#DE251F]"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </div>
  );
}
