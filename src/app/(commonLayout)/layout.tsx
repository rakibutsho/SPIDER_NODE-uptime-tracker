import { Footer } from "@/components/common/Footer/Footer";
import { Navbar } from "@/components/common/Navbar/Navbar";
import React from "react";

export default function CommonLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
