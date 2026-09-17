import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Suspense } from "react";
import ReduxProvider from "@/redux/Provider";
import AuthProvider from "@/providers/AuthProvider";
import Loading from "@/components/Others/Loader/Loading";
import { inter, jetbrainsMono } from "@/fonts/Fonts";

const siteUrl =
  process.env.NEXTAUTH_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://spidernode.site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SpiderNode | Real-Time Uptime & Infrastructure Monitoring",
    template: "%s | SpiderNode",
  },
  description:
    "Developer-centric, real-time uptime monitoring for websites, APIs, and microservices with instant Telegram alerts and public telemetry status boards.",
  keywords: [
    "uptime monitoring",
    "status page",
    "incident response",
    "API monitoring",
    "infrastructure telemetry",
    "heartbeat monitoring",
    "Telegram alert bot",
    "SpiderNode",
  ],
  authors: [{ name: "SpiderNode" }],
  creator: "SpiderNode",
  publisher: "SpiderNode",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "SpiderNode",
    title: "SpiderNode | Real-Time Uptime & Infrastructure Monitoring",
    description:
      "Developer-centric, real-time uptime monitoring for websites, APIs, and microservices with instant Telegram alerts and public telemetry status boards.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SpiderNode — Real-Time Uptime & Infrastructure Telemetry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpiderNode | Real-Time Uptime & Infrastructure Monitoring",
    description:
      "Developer-centric, real-time uptime monitoring for websites, APIs, and microservices with instant Telegram alerts and public telemetry status boards.",
    images: ["/og-image.png"],
    creator: "@spidernode",
  },
  icons: {
    icon: [
      { url: "/icon.png" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
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
