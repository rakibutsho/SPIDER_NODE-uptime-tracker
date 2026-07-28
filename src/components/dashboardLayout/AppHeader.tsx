"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SidebarTrigger } from "../ui/sidebar";

// import { Bell } from "lucide-react"
// import { Button } from "./ui/button"

const AppHeader = () => {
  //   const { data: userData } = {};
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 bg-[#EFEFEF] border-b border-gray-200 px-6">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1" />
        {/* <div className="flex items-center gap-2">
          <h1 className="text-4xl font-bold">Welcome Back!</h1>
        </div> */}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-500 hover:text-gray-700 hover:bg-gray-100">
          <Bell className="h-5 w-5" />
        </Button> */}

        <Avatar className="h-10 w-10 border-2 border-gray-200">
          <AvatarImage
            // src={userData?.data?.userProfile?.profileImage}
            alt="User avatar"
            className="object-fill"
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default AppHeader;
