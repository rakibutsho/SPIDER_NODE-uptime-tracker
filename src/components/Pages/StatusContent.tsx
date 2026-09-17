"use client";

import React from "react";

export default function StatusContent() {
  const components = [
    {
      id: "NODE-US",
      name: "MONITORING ENGINE (US-EAST CLUSTER)",
      status: "OPERATIONAL",
      uptime: "100.0%",
    },
    {
      id: "NODE-EU",
      name: "MONITORING ENGINE (EU-WEST CLUSTER)",
      status: "OPERATIONAL",
      uptime: "99.98%",
    },
    {
      id: "DASHBOARD",
      name: "OPERATOR CONSOLE WEB UI",
      status: "OPERATIONAL",
      uptime: "100.0%",
    },
    {
      id: "API-GW",
      name: "PUBLIC INGESTION REST API",
      status: "OPERATIONAL",
      uptime: "100.0%",
    },
    {
      id: "TELEGRAM",
      name: "TELEGRAM NOTIFICATION PIPELINE",
      status: "OPERATIONAL",
      uptime: "99.95%",
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-24 bg-[#0C0D0E] text-[#F4F4F5] font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="border-b-2 border-white pb-8 mb-12 text-left">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 bg-[#EF4444]" />
            <span className="swiss-kicker">01 // NETWORK HEALTH</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-[-0.04em] text-white">
            System Telemetry Board
          </h1>
          <p className="text-sm sm:text-base text-[#A0A4AD] mt-2 max-w-xl text-left leading-relaxed">
            Live availability verification across global probe clusters and
            alerting dispatch pipelines.
          </p>
        </div>

        {/* Global Status Banner: Swiss Stamp */}
        <div className="border border-white/15 bg-[#121316] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 rounded-none text-left">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E929B] block mb-1">
              GLOBAL CONSENSUS STATE
            </span>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">
              All Systems Operational
            </h2>
            <p className="text-xs font-mono text-[#8E929B] mt-1">
              CURRENT 90-DAY UPTIME METRIC // 99.99%
            </p>
          </div>
          <div className="font-mono text-xs text-[#8E929B] border-t sm:border-t-0 sm:border-l border-white/15 pt-4 sm:pt-0 sm:pl-6">
            <div>REFRESH INTERVAL: 30 SECONDS</div>
            <div className="text-white font-bold mt-0.5">
              STATUS: DETERMINISTIC
            </div>
          </div>
        </div>

        {/* Components Table: Precision Data Grid */}
        <div className="border border-white/15 bg-[#121316] rounded-none">
          <div className="p-6 border-b border-white/15 flex items-center justify-between text-left">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-[#EF4444]" />
                <span className="swiss-kicker">02 // CLUSTER NODES</span>
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-white">
                Core Infrastructure Components
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#8E929B] uppercase tracking-wider">
              5 ACTIVE SERVICES
            </span>
          </div>

          <div className="divide-y divide-white/10 font-mono text-xs">
            {components.map((comp) => (
              <div
                key={comp.id}
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-[#8E929B]">
                    [{comp.id}]
                  </span>
                  <span className="font-sans font-bold text-white text-sm">
                    {comp.name}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[#8E929B] text-xs">{comp.uptime}</span>
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white border border-white/20 rounded-none">
                    {comp.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Technical Note */}
        <div className="pt-8 mt-8 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono text-[11px] text-[#8E929B] tracking-wider uppercase">
          <span>HISTORIC 90-DAY RELIABILITY: 99.99%</span>
          <span>INCIDENT LOG BUFFER: 0 ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
