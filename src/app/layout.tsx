import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Suspense } from "react";
import ReduxProvider from "@/redux/Provider";
import AuthProvider from "@/providers/AuthProvider";
import Loading from "@/components/Others/Loader/Loading";
import { inter, jetbrainsMono } from "@/fonts/Fonts";

export const metadata: Metadata = {
  title: "SpiderNode | Real-Time Uptime & Infrastructure Monitoring",
  description:
    "Developer-centric, real-time uptime monitoring for websites, APIs, and microservices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-[#0C0D0E] text-[#ECECED] min-h-screen selection:bg-[#EF4444] selection:text-white font-sans`}
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
