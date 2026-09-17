"use client";

import React from "react";

export default function LivePreviewMockup() {
  const monitors = [
    {
      id: "NODE-01",
      name: "API GATEWAY CLUSTER (PRIMARY)",
      endpoint: "https://api.spidernode.site/v1/health",
      region: "EU-CENTRAL-1",
      latency: "14ms",
      status: "ACTIVE",
      uptime: "100.0%",
    },
    {
      id: "NODE-02",
      name: "AUTHENTICATION SERVICE (OAUTH2)",
      endpoint: "https://auth.spidernode.site/oauth/ping",
      region: "US-EAST-1",
      latency: "28ms",
      status: "ACTIVE",
      uptime: "99.98%",
    },
    {
      id: "NODE-03",
      name: "POSTGRESQL REPLICA READ-POOL",
      endpoint: "tcp://db-replica-01.internal:5432",
      region: "AP-SOUTHEAST-1",
      latency: "08ms",
      status: "ACTIVE",
      uptime: "100.0%",
    },
    {
      id: "NODE-04",
      name: "EDGE CDN STATIC ASSET ROUTER",
      endpoint: "https://cdn.spidernode.site/status",
      region: "GLOBAL-ANYCAST",
      latency: "19ms",
      status: "ACTIVE",
      uptime: "99.99%",
    },
  ];

  return (
    <section className="w-full border-b border-white/15 bg-[#0C0D0E] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b-2 border-white">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#EF4444]" />
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-[-0.03em] text-white">
              02 // Live Telemetry Grid
            </h2>
          </div>
          <div className="font-mono text-xs uppercase tracking-[0.18em] text-[#8E929B]">
            SAMPLING INTERVAL:{" "}
            <span className="text-white font-bold">1000MS</span> // TOTAL
            <span className="text-white font-bold">1000MS</span> {"//"} TOTAL
            MONITORS: <span className="text-white font-bold">12</span>
          </div>
        </div>

        {/* Precision Swiss Data Table */}
        <div className="border border-white/15 bg-[#121316] mt-8 overflow-x-auto">
          {/* Table Header */}
          <div className="min-w-[750px] grid grid-cols-12 px-6 py-3 border-b border-white/15 text-[10px] font-mono uppercase tracking-[0.18em] text-[#8E929B] bg-white/[0.02]">
            <span className="col-span-1">ID</span>
            <span className="col-span-5">TARGET ENDPOINT & SERVICE</span>
            <span className="col-span-2">LOCATION</span>
            <span className="col-span-2 text-right">LATENCY</span>
            <span className="col-span-2 text-right">STATE</span>
          </div>

          {/* Table Rows */}
          <div className="min-w-[750px] divide-y divide-white/10 font-mono text-xs">
            {monitors.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 px-6 py-4 items-center hover:bg-white/[0.03] transition-colors"
              >
                {/* ID */}
                <span className="col-span-1 text-[11px] font-bold text-[#8E929B]">
                  {item.id}
                </span>

                {/* Name & Target */}
                <div className="col-span-5 pr-4">
                  <div className="font-sans font-bold text-sm text-white tracking-tight">
                    {item.name}
                  </div>
                  <div className="text-[11px] text-[#8E929B] truncate font-mono mt-0.5">
                    {item.endpoint}
                  </div>
                </div>

                {/* Region */}
                <span className="col-span-2 text-[11px] text-[#A0A4AD]">
                  {item.region}
                </span>

                {/* Latency */}
                <span className="col-span-2 text-right font-bold text-white text-sm">
                  {item.latency}
                </span>

                {/* Status Badge */}
                <div className="col-span-2 flex justify-end">
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-white/10 border border-white/20 text-white rounded-none">
                    {item.status} ({item.uptime})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/15 mt-6 font-mono text-xs">
          <div>
            <span className="text-[#8E929B] uppercase tracking-wider block text-[10px]">
              VERIFICATION ENGINE
            </span>
            <span className="text-white font-bold">MULTI-NODE CONCURRENCY</span>
          </div>
          <div>
            <span className="text-[#8E929B] uppercase tracking-wider block text-[10px]">
              AVERAGE RESOLUTION
            </span>
            <span className="text-[#EF4444] font-bold">17.25 MILLISECONDS</span>
          </div>
          <div className="sm:text-right">
            <span className="text-[#8E929B] uppercase tracking-wider block text-[10px]">
              INCIDENT BUFFER
            </span>
            <span className="text-white font-bold">0 UNRESOLVED ALERTS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
