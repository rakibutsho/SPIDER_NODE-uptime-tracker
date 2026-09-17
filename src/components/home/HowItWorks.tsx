"use client";

import React from "react";

export default function HowItWorks() {
  const steps = [
    {
      id: "01",
      stepName: "REGISTER ENDPOINT",
      instruction:
        "Input your production HTTP, HTTPS, or raw TCP socket address along with your required threshold intervals and custom payload headers.",
      rule: "STEP ONE // CONFIGURATION",
    },
    {
      id: "02",
      stepName: "LINK CHANNELS",
      instruction:
        "Authenticate your Telegram bot token or provide an incident webhook endpoint for immediate sub-second notification dispatching.",
      rule: "STEP TWO // NOTIFICATION",
    },
    {
      id: "03",
      stepName: "CONTINUOUS PROBE",
      instruction:
        "System immediately initializes heartbeat polling across global nodes, rendering real-time response distribution and downtime charts.",
      rule: "STEP THREE // TELEMETRY",
    },
  ];

  return (
    <section className="w-full border-b border-white/15 bg-[#0C0D0E] py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 pb-6 border-b-2 border-white">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-[#EF4444]" />
              <span className="swiss-kicker">04 // INTEGRATION PROCEDURE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-[-0.04em] text-white">
              Zero to Monitored in 60 Seconds
            </h2>
          </div>
          <div className="md:col-span-7 flex items-end">
            <p className="text-[#A0A4AD] text-sm sm:text-base max-w-lg text-left leading-relaxed">
              No proprietary SDKs to compile, zero agent daemons to run on your
              servers. Direct external probe verification.
            </p>
          </div>
        </div>

        {/* 3 Step Sequence with Strict Typographic Hierarchy */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-white/15">
          {steps.map((step) => (
            <div
              key={step.id}
              className="border-r border-b border-white/15 p-8 sm:p-10 flex flex-col justify-between bg-[#121316] hover:bg-white/[0.02] transition-colors"
            >
              <div>
                <div className="flex items-baseline justify-between border-b border-white/10 pb-4 mb-6">
                  <span className="text-[10px] font-mono tracking-[0.2em] text-[#8E929B] uppercase">
                    {step.rule}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#EF4444]">
                    PHASE {step.id}
                  </span>
                </div>

                <div className="text-4xl sm:text-5xl font-mono font-black text-white tracking-tight mb-4">
                  {step.id}
                </div>

                <h3 className="text-lg font-bold uppercase tracking-[-0.01em] text-white mb-3">
                  {step.stepName}
                </h3>

                <p className="text-sm text-[#A0A4AD] leading-relaxed text-left">
                  {step.instruction}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 font-mono text-[10px] text-[#8E929B] uppercase tracking-wider">
                EXECUTION: INSTANTANEOUS
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
