"use client";

import React from "react";
import { Activity01Icon as Activity, Notification02Icon as BellRing, Link01Icon as LinkIcon, ChartLineData01Icon as LineChart } from "hugeicons-react";

export default function HowItWorks() {
  const steps = [
    {
      id: "01",
      title: "Add Your Endpoint",
      description: "Simply paste the URL of your website, REST API, or any public microservice that you want to keep online.",
      icon: <LinkIcon className="w-6 h-6 text-[#DC2626]" />,
      glowColor: "from-red-500/20",
    },
    {
      id: "02",
      title: "Configure Alerts",
      description: "Connect your Telegram account or set up webhooks to get instantly notified the second your service goes down.",
      icon: <BellRing className="w-6 h-6 text-amber-500" />,
      glowColor: "from-amber-500/20",
    },
    {
      id: "03",
      title: "Monitor in Real-Time",
      description: "Watch your dashboard light up with live ping metrics, response times, and historic uptime analytics.",
      icon: <LineChart className="w-6 h-6 text-emerald-500" />,
      glowColor: "from-emerald-500/20",
    },
  ];

  return (
    <div className="py-24 relative overflow-hidden bg-[#090D16]">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-mono mb-4">
            <Activity className="w-3.5 h-3.5 text-[#DC2626]" />
            Quick Start Guide
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold font-heading tracking-tight text-white">
            From Zero to Monitored in <span className="text-[#DC2626]">60 Seconds</span>
          </h2>
          <p className="text-slate-400 mt-4 text-base">
            No complex SDKs or messy configurations. Just point us at your infrastructure and we'll handle the rest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-slate-700/50 to-transparent -z-10" />

          {steps.map((step, index) => (
            <div key={step.id} className="relative group">
              <div className="flex flex-col items-center text-center">
                {/* Number & Icon Bubble */}
                <div className={`w-24 h-24 rounded-3xl bg-slate-900/80 border border-slate-700 shadow-2xl flex items-center justify-center mb-6 relative overflow-hidden transition-transform duration-500 group-hover:-translate-y-2`}>
                  {/* Internal Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${step.glowColor} to-transparent opacity-50`} />
                  
                  <div className="absolute top-2 left-2 text-[10px] font-bold font-mono text-slate-600">
                    {step.id}
                  </div>
                  
                  <div className="relative z-10 p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 shadow-inner">
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold font-heading text-slate-100 mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-[280px]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
