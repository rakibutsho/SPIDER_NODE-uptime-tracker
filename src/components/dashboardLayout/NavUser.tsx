"use client";

import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Logout01Icon as LogOut,
  UserIcon,
  GlobeIcon as Globe,
  ArrowRight01Icon as ArrowRight,
} from "hugeicons-react";
import Link from "next/link";

export function NavUser() {
  const { data: session } = useSession();

  const userName = session?.user?.name || "OPERATOR";
  const userEmail = session?.user?.email || "operator@spidernode.site";
  const userImage = session?.user?.image;
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2.5 outline-none p-1 hover:bg-white/5 border border-transparent hover:border-white/15 transition-colors cursor-pointer rounded-none">
          {/* Square Avatar Box */}
          <div className="w-7 h-7 border border-white/20 bg-[#0C0D0E] overflow-hidden flex items-center justify-center shrink-0">
            {userImage ? (
              <img
                src={userImage}
                alt={userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-mono text-[10px] font-bold">
                {userInitials}
              </span>
            )}
          </div>

          {/* User Name & Operator Tag */}
          <div className="hidden sm:flex flex-col text-left font-mono">
            <span className="text-xs font-bold text-white truncate max-w-[130px] leading-tight uppercase">
              {userName}
            </span>
            <span className="text-[9px] text-[#8E929B] tracking-wider uppercase">
              OPERATOR
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>

      {/* Swiss Dropdown Menu */}
      <DropdownMenuContent
        className="w-60 bg-[#121316] border border-white/15 text-[#ECECED] shadow-2xl p-2 rounded-none font-mono"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="font-normal p-2.5">
          <div className="flex flex-col space-y-1">
            <div className="text-[9px] uppercase tracking-widest text-[#8E929B]">
              IDENTIFIED OPERATOR
            </div>
            <p className="text-xs font-bold text-white uppercase truncate">
              {userName}
            </p>
            <p className="text-[10px] text-[#8E929B] truncate">{userEmail}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-white/10 my-1" />

        <DropdownMenuItem
          asChild
          className="p-0 rounded-none focus:bg-white/5 cursor-pointer"
        >
          <Link
            href="/dashboard/profile"
            className="flex items-center justify-between px-2.5 py-2 text-xs text-white hover:text-white hover:bg-white/5 w-full transition-colors"
          >
            <div className="flex items-center gap-2">
              <UserIcon className="w-3.5 h-3.5 text-[#8E929B]" />
              <span className="uppercase text-[11px] tracking-wider">
                Operator Profile
              </span>
            </div>
            <ArrowRight className="w-3 h-3 text-white/30" />
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          className="p-0 rounded-none focus:bg-white/5 cursor-pointer"
        >
          <Link
            href="/dashboard/status"
            className="flex items-center justify-between px-2.5 py-2 text-xs text-white hover:text-white hover:bg-white/5 w-full transition-colors"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-[#8E929B]" />
              <span className="uppercase text-[11px] tracking-wider">
                Status Board
              </span>
            </div>
            <ArrowRight className="w-3 h-3 text-white/30" />
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-white/10 my-1" />

        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="p-0 rounded-none focus:bg-red-500/10 cursor-pointer"
        >
          <div className="flex items-center gap-2 px-2.5 py-2 text-xs text-[#EF4444] hover:bg-red-500/10 w-full transition-colors uppercase tracking-wider font-bold">
            <LogOut className="w-3.5 h-3.5 text-[#EF4444]" />
            <span>Terminate Session</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
