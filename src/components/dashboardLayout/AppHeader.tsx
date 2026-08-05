"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SidebarTrigger } from "../ui/sidebar";

// import { BellIcon as Bell } from "hugeicons-react";
// import { Button } from "./ui/button"

const AppHeader = () => {
  //   const { data: userData } = {};
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 sticky top-0 z-50">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1 text-slate-400 hover:text-white transition-colors" />
        {/* <div className="flex items-center gap-2">
          <h1 className="text-4xl font-bold">Welcome Back!</h1>
        </div> */}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-white hover:bg-slate-800">
          <Bell className="h-5 w-5" />
        </Button> */}

        <Avatar className="h-10 w-10 border-2 border-slate-700 hover:border-cyan-500/50 transition-colors cursor-pointer shadow-sm">
          <AvatarImage
            // src={userData?.data?.userProfile?.profileImage}
            alt="User avatar"
            className="object-fill"
          />
          <AvatarFallback className="bg-slate-800 text-cyan-400 font-medium">U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default AppHeader;
