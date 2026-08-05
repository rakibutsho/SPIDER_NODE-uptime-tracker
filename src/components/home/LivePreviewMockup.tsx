"use client";

import React from "react";

export default function LivePreviewMockup() {
  return (
    <div className="mt-16 max-w-5xl mx-auto relative px-4 sm:px-6">
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
  );
}
