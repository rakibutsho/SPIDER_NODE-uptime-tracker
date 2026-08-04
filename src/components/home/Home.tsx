"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  Globe2,
  ShieldCheck,
  Zap,
  Server,
} from "lucide-react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="w-full bg-[#090D16] text-slate-100 overflow-hidden">
      {/* Hero Glows */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24 text-center">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#DC2626]/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/60 border border-red-500/30 text-[#DC2626] text-xs font-mono mb-8 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DC2626] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DC2626]"></span>
          </span>
          Next-Gen Infrastructure Monitoring System
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.1]">
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
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#DC2626] hover:bg-red-400 text-[#090D16] font-bold text-sm transition-all shadow-xl shadow-red-500/25 flex items-center justify-center gap-2 group"
          >
            <span>{session ? "Open Dashboard" : "Start Monitoring Free"}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl glass-panel hover:bg-slate-800/80 text-slate-200 font-semibold text-sm transition-all border border-slate-700/80 flex items-center justify-center gap-2"
          >
            <Activity className="w-4 h-4 text-[#DC2626]" />
            <span>Explore Dashboard</span>
          </Link>
        </div>

        {/* Live Preview Glassmorphism Mockup */}
        <div className="mt-16 max-w-5xl mx-auto relative">
          <div className="glass-panel p-4 sm:p-6 rounded-2xl shadow-2xl border border-slate-800 text-left relative overflow-hidden">
            {/* Window bar */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs text-slate-500 font-mono ml-2">
                  spidernode.io/dashboard
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  All Systems Operational (99.98%)
                </span>
              </div>
            </div>

            {/* Simulated Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400 mb-1">Total Endpoints</div>
                <div className="text-2xl font-bold font-mono text-white">12 Active</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400 mb-1">Avg Response Time</div>
                <div className="text-2xl font-bold font-mono text-[#DC2626]">24ms</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400 mb-1">Incidents (30d)</div>
                <div className="text-2xl font-bold font-mono text-emerald-400">0 Reported</div>
              </div>
            </div>

            {/* Simulated Table */}
            <div className="rounded-xl bg-slate-900/90 border border-slate-800/80 overflow-hidden">
              <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400 grid grid-cols-12">
                <span className="col-span-5">MONITOR NAME & TARGET</span>
                <span className="col-span-3 text-center">STATUS</span>
                <span className="col-span-4 text-right">LATENCY</span>
              </div>
              <div className="divide-y divide-slate-800/60 font-mono text-xs">
                <div className="px-4 py-3 grid grid-cols-12 items-center hover:bg-slate-800/30">
                  <div className="col-span-5 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <div>
                      <div className="text-slate-200 font-semibold">Production API Gateway</div>
                      <div className="text-slate-500 text-[11px]">https://api.myapp.com/v1/health</div>
                    </div>
                  </div>
                  <div className="col-span-3 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                      OPERATIONAL
                    </span>
                  </div>
                  <div className="col-span-4 text-right text-slate-300 font-bold">18 ms</div>
                </div>

                <div className="px-4 py-3 grid grid-cols-12 items-center hover:bg-slate-800/30">
                  <div className="col-span-5 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <div>
                      <div className="text-slate-200 font-semibold">Auth Service Cluster</div>
                      <div className="text-slate-500 text-[11px]">https://auth.myapp.com/ping</div>
                    </div>
                  </div>
                  <div className="col-span-3 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                      OPERATIONAL
                    </span>
                  </div>
                  <div className="col-span-4 text-right text-slate-300 font-bold">32 ms</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="border-t border-slate-800/80 bg-[#0F172A]/40 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Built for Engineering Teams
            </h2>
            <p className="text-slate-400 mt-2 text-sm">
              Everything you need to guarantee high availability and maintain customer trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-red-500/40 transition-colors">
              <div className="p-3 rounded-xl bg-red-500/10 text-[#DC2626] w-fit mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Sub-Minute Pings</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated continuous health checks ensure downtime is detected within seconds, before your customers notice.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-red-500/40 transition-colors">
              <div className="p-3 rounded-xl bg-red-500/10 text-[#DC2626] w-fit mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Multi-Region Validation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Health checks double verify from multiple geographic locations to prevent false alarm noise.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-red-500/40 transition-colors">
              <div className="p-3 rounded-xl bg-red-500/10 text-[#DC2626] w-fit mb-4">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Instant Alerting</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive instant notifications via Webhooks, Email, or Telegram when any endpoint experiences latency spikes or HTTP errors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
