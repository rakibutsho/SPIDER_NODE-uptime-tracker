"use client";

import React from "react";

export default function FeatureGrid() {
  const features = [
    {
      num: "01",
      title: "Sub-Minute Health Pings",
      description:
        "High-frequency probe clusters dispatch automated HTTP/TCP heartbeats every 30 seconds to immediately isolate outages before customer escalation.",
      meta: "FREQUENCY: 30S // HTTP, TCP, SSL",
    },
    {
      num: "02",
      title: "Consensus Multi-Region Proof",
      description:
        "Health checks are verified across multiple autonomous geographic nodes. A service is only declared down when consensus confirms unreachable state.",
      meta: "GEOGRAPHY: 4 GLOBAL POPS",
    },
    {
      num: "03",
      title: "Real-Time Telegram & Webhooks",
      description:
        "Payloads are pushed synchronously to your DevOps escalation channels, incident bots, and mobile devices the moment latency threshold breaches occur.",
      meta: "DISPATCH LATENCY: < 800MS",
    },
  ];

  return (
    <section className="w-full border-b border-white/15 bg-[#0C0D0E] py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 pb-6 border-b-2 border-white">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-[#EF4444]" />
              <span className="swiss-kicker">03 // CORE CAPABILITIES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-[-0.04em] text-white">
              Engineered For Reliability
            </h2>
          </div>
          <div className="md:col-span-8 flex items-end">
            <p className="text-[#A0A4AD] text-sm sm:text-base max-w-xl text-left leading-relaxed">
              Every feature is built around mathematical precision,
              deterministic reporting, and zero tolerance for false positive
              alerting.
            </p>
          </div>
        </div>

        {/* Visible 3-Column Architectural Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-white/15">
          {features.map((f) => (
            <div
              key={f.num}
              className="border-r border-b border-white/15 p-8 sm:p-10 flex flex-col justify-between hover:bg-white/[0.02] transition-colors bg-[#121316]"
            >
              <div>
                <div className="text-4xl sm:text-5xl font-mono font-black text-[#EF4444] tracking-tighter mb-8">
                  {f.num}
                </div>
                <h3 className="text-xl font-bold uppercase tracking-[-0.02em] text-white mb-4">
                  {f.title}
                </h3>
                <p className="text-sm text-[#A0A4AD] leading-relaxed text-left">
                  {f.description}
                </p>
              </div>

              <div className="mt-12 pt-4 border-t border-white/10 font-mono text-[10px] tracking-[0.18em] uppercase text-[#8E929B]">
                {f.meta}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
