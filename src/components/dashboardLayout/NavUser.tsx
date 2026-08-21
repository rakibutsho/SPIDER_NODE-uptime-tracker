"use client";

import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logout01Icon, UserIcon } from "hugeicons-react";
import Link from "next/link";

export function NavUser() {
  const { data: session } = useSession();
  
  const userName = session?.user?.name || "Developer";
  const userEmail = session?.user?.email || "";
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
        <button className="flex items-center gap-2 outline-none group rounded-xl p-1 hover:bg-slate-800/50 transition-colors">
          <Avatar className="h-9 w-9 border border-slate-700 group-hover:border-red-500/50 transition-colors cursor-pointer shadow-sm">
            <AvatarImage
              src={userImage || ""}
              alt={userName}
              className="object-cover"
            />
            <AvatarFallback className="bg-slate-800 text-red-400 font-medium text-xs">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-slate-900 border-slate-800 text-slate-200 shadow-xl" align="end" sideOffset={8}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-white">{userName}</p>
            <p className="text-xs leading-none text-slate-400 font-mono">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-800" />
        <DropdownMenuItem asChild className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer">
          <Link href="/dashboard/profile" className="flex items-center gap-2 w-full">
            <UserIcon className="h-4 w-4 text-slate-400" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-800" />
        <DropdownMenuItem 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer text-red-400 hover:text-red-300 focus:text-red-300"
        >
          <div className="flex items-center gap-2 w-full">
            <Logout01Icon className="h-4 w-4" />
            <span>Sign Out</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
