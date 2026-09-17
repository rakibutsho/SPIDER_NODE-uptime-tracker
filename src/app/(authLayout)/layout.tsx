import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-[#0C0D0E] text-[#EDEDED]">{children}</div>
  );
}
