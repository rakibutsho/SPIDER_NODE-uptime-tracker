"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Activity01Icon as Activity, GithubIcon as Github, DashboardSquare01Icon as LayoutDashboard, Login01Icon as LogIn, Logout01Icon as LogOut, Menu01Icon as Menu, Cancel01Icon as X } from "hugeicons-react";
import logo from "@/assets/logo.png"
import Image from "next/image";

export const Navbar = () => {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#090D16]/80 backdrop-blur-md font-sans">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3.5">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-[#DC2626] group-hover:scale-105 transition-transform shadow-sm shadow-red-500/20">
            <Activity className="w-5 h-5" />
          </div> */}
          <Image src={logo} alt="Logo" width={50} height={50} className="w-12 h-12 object-contain" />
          <span className="text-xl font-bold tracking-tight text-white font-heading">
            Spider<span className="text-[#DC2626]">Node</span>
          </span>
        </Link>

        {/* Desktop Nav Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="https://github.com/rakibutsho/uptime-tracker"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/60 text-slate-300 hover:text-white text-xs font-medium transition-all"
          >
            <Github className="w-4 h-4" />
            <span>Star on GitHub</span>
          </Link>

          {status === "loading" ? (
            <div className="w-24 h-8 bg-slate-800/60 rounded-lg animate-pulse" />
          ) : session ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-500/20"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-500/20"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0F172A] px-4 py-4 space-y-3">
          <a
            href="https://github.com/rakibutsho/uptime-tracker"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-900 text-slate-300 text-sm font-medium"
          >
            <Github className="w-4 h-4" />
            <span>Star on GitHub</span>
          </a>

          {session ? (
            <div className="space-y-2">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#DC2626] text-white font-bold text-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#DC2626] text-white font-bold text-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
