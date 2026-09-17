"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { useSession, signOut } from "next-auth/react";
import {
  GithubIcon as Github,
  DashboardSquare01Icon as LayoutDashboard,
  Login01Icon as LogIn,
  Logout01Icon as LogOut,
  Menu01Icon as Menu,
  Cancel01Icon as X,
} from "hugeicons-react";

export const Navbar = () => {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/15 bg-[#0C0D0E]/95 font-sans">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8 py-4">
        {/* Swiss Typographic Wordmark */}
        {/* Brand Logo Lockup */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-2.5 h-6 bg-[#EF4444]" />
          <Image
            src={logo}
            alt="SpiderNode Logo"
            width={40}
            height={40}
            className="w-9 h-9 object-contain"
            priority
          />
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-[-0.04em] text-white uppercase leading-none">
              SpiderNode
            </span>
            <span className="text-[9px] font-mono tracking-[0.25em] text-[#8E929B] uppercase mt-0.5">
              Telemetry System
            </span>
          </div>
        </Link>

        {/* Desktop Nav Actions */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/status"
            className="text-xs font-semibold uppercase tracking-[0.15em] text-[#A0A4AD] hover:text-white transition-colors"
          >
            System Status
          </Link>
          <Link
            href="/docs"
            className="text-xs font-semibold uppercase tracking-[0.15em] text-[#A0A4AD] hover:text-white transition-colors"
          >
            Docs
          </Link>
          <Link
            href="https://github.com/rakibutsho/uptime-tracker"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono tracking-[0.1em] text-[#8E929B] hover:text-white border-l border-white/15 pl-6 transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub ↗</span>
          </Link>

          {status === "loading" ? (
            <div className="w-24 h-9 bg-white/10 animate-pulse rounded-none" />
          ) : session ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-bold uppercase tracking-[0.15em] transition-colors rounded-none"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-2.5 border border-white/20 text-[#8E929B] hover:text-white hover:border-white/40 transition-colors cursor-pointer rounded-none"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-6 py-2.5 bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-bold uppercase tracking-[0.15em] transition-colors rounded-none"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 border border-white/20 text-white rounded-none"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/15 bg-[#121316] px-6 py-6 space-y-4">
          <Link
            href="/status"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold uppercase tracking-[0.15em] text-[#A0A4AD] hover:text-white"
          >
            System Status
          </Link>
          <Link
            href="/docs"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold uppercase tracking-[0.15em] text-[#A0A4AD] hover:text-white"
          >
            Docs
          </Link>
          <a
            href="https://github.com/rakibutsho/uptime-tracker"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-mono uppercase text-[#8E929B] pt-2 border-t border-white/10"
          >
            <Github className="w-4 h-4" />
            <span>GitHub Repository ↗</span>
          </a>

          {session ? (
            <div className="space-y-3 pt-2">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#EF4444] text-white font-bold uppercase tracking-[0.15em] text-xs"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full py-2.5 border border-white/20 text-[#8E929B] text-xs uppercase tracking-[0.15em]"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#EF4444] text-white font-bold uppercase tracking-[0.15em] text-xs"
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
