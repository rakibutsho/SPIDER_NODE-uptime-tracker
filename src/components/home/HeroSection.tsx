"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight01Icon as ArrowRight } from "hugeicons-react";

export default function HeroSection() {
  const { data: session } = useSession();

  return (
    <section className="w-full border-b border-white/15 bg-[#0C0D0E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
        {/* Swiss Grid: Section Header & Index */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          <div className="md:col-span-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#EF4444]" />
              <span className="swiss-kicker">01 // TELEMETRY ENGINE</span>
            </div>
            <div className="font-mono text-[11px] text-[#8E929B] mt-2 uppercase tracking-widest">
              SYSTEM: OPERATIONAL
            </div>
          </div>
          <div className="md:col-span-9 hidden md:block">
            <div className="w-full border-t border-white/15 mt-2" />
          </div>
        </div>

        {/* Flush-Left Dramatic Typographic Headline */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-9">
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[5.8rem] font-black tracking-[-0.045em] text-white leading-[0.92] text-left uppercase">
              Instant Uptime <br />
              <span className="text-[#EF4444]">Alerts.</span> <br />
              Zero Noise.
            </h1>

            <p className="mt-8 text-base sm:text-xl text-[#A0A4AD] max-w-2xl text-left leading-relaxed font-normal">
              Continuous 30-second ping validation for mission-critical HTTP
              endpoints, microservices, and databases. Instant failover
              notifications dispatched via Telegram and webhooks with
              mathematical precision.
            </p>

            {/* Swiss Structural CTA Strip */}
            <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Link
                href={session ? "/dashboard" : "/register"}
                className="px-8 py-4 bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold text-xs uppercase tracking-[0.2em] transition-colors flex items-center gap-3 rounded-none shadow-none"
              >
                <span>
                  {session ? "Enter Console" : "Start Monitoring Free"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/status"
                className="px-6 py-4 border border-white/20 hover:border-white/60 text-white font-semibold text-xs uppercase tracking-[0.18em] transition-colors rounded-none"
              >
                View Live Telemetry →
              </Link>
            </div>
          </div>

          {/* Asymmetric Swiss Sidebar Metadata */}
          <div className="md:col-span-3 border-t md:border-t-0 md:border-l border-white/15 pt-8 md:pt-0 md:pl-8 space-y-6">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#8E929B] mb-1">
                CHECK INTERVAL
              </div>
              <div className="text-3xl font-black font-mono text-white tracking-tight">
                30
                <span className="text-xs font-normal text-[#8E929B] ml-1">
                  SEC
                </span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#8E929B] mb-1">
                GLOBAL REGIONS
              </div>
              <div className="text-3xl font-black font-mono text-white tracking-tight">
                04
                <span className="text-xs font-normal text-[#8E929B] ml-1">
                  NODES
                </span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#8E929B] mb-1">
                HISTORIC UPTIME
              </div>
              <div className="text-3xl font-black font-mono text-[#EF4444] tracking-tight">
                99.98%
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
