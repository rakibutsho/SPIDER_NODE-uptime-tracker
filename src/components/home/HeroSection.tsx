"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Activity01Icon as Activity, ArrowRight01Icon as ArrowRight } from "hugeicons-react";

export default function HeroSection() {
  const { data: session } = useSession();

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24 text-center">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#EF4444]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/60 border border-red-500/30 text-[#EF4444] text-xs font-mono mb-8 backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF4444] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EF4444]"></span>
        </span>
        Next-Gen Infrastructure Monitoring System
      </div>

      {/* Headline */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-heading tracking-tight max-w-5xl mx-auto leading-[1.1]">
        Instant Uptime Alerts. <br />
        <span className="red-gradient-text">Zero False Positives.</span>
      </h1>

      <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal">
        Monitor your websites, REST APIs, and microservices 24/7 with sub-minute pings, immediate Telegram/email alerts, and real-time latency graphs.
      </p>

      {/* CTA Group */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href={session ? "/dashboard" : "/register"}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#EF4444] hover:bg-red-400 text-[#121212] font-bold text-sm transition-all shadow-xl shadow-red-500/25 flex items-center justify-center gap-2 group"
        >
          <span>{session ? "Open Dashboard" : "Start Monitoring Free"}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/dashboard"
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl glass-panel hover:bg-slate-800/80 text-slate-200 font-semibold text-sm transition-all border border-slate-700/80 flex items-center justify-center gap-2"
        >
          <Activity className="w-4 h-4 text-[#EF4444]" />
          <span>Explore Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
