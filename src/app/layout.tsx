import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Suspense } from "react";
import ReduxProvider from "@/redux/Provider";
import AuthProvider from "@/providers/AuthProvider";
import Loading from "@/components/Others/Loader/Loading";
import {
  gravitas,
  lobster,
  openSans,
  playfair,
  roboto,
  rowdies,
} from "@/fonts/Fonts";

export const metadata: Metadata = {
  title: "SpiderNode | Real-Time Uptime & Infrastructure Monitoring",
  description: "Developer-centric, real-time uptime monitoring for websites, APIs, and microservices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${openSans.variable} ${playfair.variable} ${lobster.variable} ${roboto.variable} ${gravitas.variable} ${rowdies.variable} antialiased bg-[#090D16] text-slate-100 min-h-screen`}
      >
        <Suspense fallback={<Loading />}>
          <AuthProvider>
            <ReduxProvider>
              {children}
              <Toaster richColors position="top-right" theme="dark" />
            </ReduxProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
