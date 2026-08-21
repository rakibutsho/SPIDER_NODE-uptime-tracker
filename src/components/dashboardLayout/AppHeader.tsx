"use client";

import { SidebarTrigger } from "../ui/sidebar";
import { NavUser } from "./NavUser";

const AppHeader = () => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 sticky top-0 z-50">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1 text-slate-400 hover:text-white transition-colors" />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        <NavUser />
      </div>
    </header>
  );
};

export default AppHeader;
