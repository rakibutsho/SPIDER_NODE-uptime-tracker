"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SidebarTrigger } from "../ui/sidebar";
import { NavUser } from "./NavUser";
import {
  GlobeIcon as Globe,
  LinkSquare01Icon as ExternalLink,
} from "hugeicons-react";

function getRouteInfo(pathname: string) {
  if (pathname === "/dashboard") {
    return { kicker: "01 // TELEMETRY CONSOLE", title: "OVERVIEW" };
  }
  if (pathname.startsWith("/dashboard/incidents")) {
    return { kicker: "02 // EVENT AUDIT", title: "INCIDENT LOGS" };
  }
  if (pathname.startsWith("/dashboard/profile")) {
    return { kicker: "03 // IDENTITY ACCESS", title: "OPERATOR PROFILE" };
  }
  if (pathname.startsWith("/dashboard/status")) {
    return { kicker: "04 // BROADCAST NODE", title: "PUBLIC STATUS BOARD" };
  }
  if (pathname.startsWith("/dashboard/monitor")) {
    return { kicker: "05 // TELEMETRY INSPECTION", title: "MONITOR DETAILS" };
  }
  return { kicker: "CONSOLE", title: "DASHBOARD" };
}

const AppHeader = () => {
  const pathname = usePathname();
  const route = getRouteInfo(pathname);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 bg-[#0C0D0E] border-b border-white/15 px-4 sm:px-6 sticky top-0 z-40 font-mono">
      {/* Left Side: Sidebar Toggle & Swiss Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <SidebarTrigger className="text-white/60 hover:text-white hover:bg-white/5 transition-colors rounded-none p-1.5" />
        <div className="h-4 w-[1px] bg-white/15 shrink-0" />
        <div className="flex items-center gap-2 truncate">
          <span className="text-[10px] uppercase tracking-widest text-[#8E929B] hidden md:inline">
            {route.kicker}
          </span>
          <span className="text-white/20 hidden md:inline">/</span>
          <span className="text-xs font-bold uppercase tracking-wider text-white truncate">
            {route.title}
          </span>
        </div>
      </div>

      {/* Right Side: Network SLA, Public Status Link & NavUser */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Network SLA Badge */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 border border-white/10 bg-[#121316] text-[10px] tracking-wider">
          <span className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" />
          <span className="text-[#8E929B] uppercase">FLEET SLA:</span>
          <span className="text-emerald-400 font-bold">99.98%</span>
        </div>

        {/* Quick Public Link */}
        <Link
          href="/status"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 border border-white/10 hover:border-white/25 bg-transparent hover:bg-white/5 text-[#8E929B] hover:text-white text-[10px] uppercase tracking-wider transition-colors rounded-none"
          title="Open Public Status Board"
        >
          <Globe className="w-3 h-3 text-[#EF4444]" />
          <span>Live Board</span>
          <ExternalLink className="w-2.5 h-2.5 text-white/40" />
        </Link>

        <div className="h-4 w-[1px] bg-white/15 hidden sm:block" />

        {/* User Identity Menu */}
        <NavUser />
      </div>
    </header>
  );
};

export default AppHeader;
