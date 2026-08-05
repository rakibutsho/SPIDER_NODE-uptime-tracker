import AppHeader from "@/components/dashboardLayout/AppHeader";
import { AppSidebar } from "@/components/dashboardLayout/AppSidebar";
import FeedbackButton from "@/components/Dashboard/FeedbackButton";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React, { ReactNode } from "react";
import { Toaster } from "sonner";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen flex overflow-hidden font-inter-tight">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <AppHeader />
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-4 p-4 pt-0">{children}</div>
          </div>
        </SidebarInset>
        <FeedbackButton />
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
