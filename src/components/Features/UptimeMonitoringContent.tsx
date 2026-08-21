"use client";
import React from "react";
import Link from "next/link";
import { Activity01Icon as Activity, CheckmarkCircle01Icon as Checkmark, GlobalIcon as Global, Clock01Icon as Clock, ArrowRight01Icon as ArrowRight } from "hugeicons-react";

export default function UptimeMonitoringContent() {
  const features = [
    {
      title: "Sub-minute Checks",
      description: "We ping your endpoints every 30 seconds to ensure you're the first to know when something goes down.",
      icon: Clock,
    },
    {
      title: "Global Edge Network",
      description: "Checks are performed from multiple global regions to prevent false positives and verify regional outages.",
      icon: Global,
    },
    {
      title: "SSL Expiry Alerts",
      description: "Automatically track your SSL/TLS certificates and receive warnings before they expire.",
      icon: Checkmark,
    },
  ];

  return (
    <div className="min-h-screen bg-[#121212] text-slate-100 overflow-hidden font-sans pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#EF4444]/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/60 border border-red-500/30 text-[#EF4444] text-xs font-mono mb-6 backdrop-blur-md">
            <Activity className="w-4 h-4" />
            Core Feature
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold font-heading tracking-tight mb-6">
            Reliable <span className="red-gradient-text">Uptime Monitoring</span>
          </h1>
          <p className="text-lg text-slate-400 mb-8">
            Don't let downtime cost you customers. SpiderNode monitors your websites and infrastructure around the clock with zero false positives.
          </p>
          
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#EF4444] hover:bg-red-400 text-[#121212] font-bold text-sm transition-all shadow-xl shadow-red-500/25 group"
          >
            Start Monitoring Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-20">
          {features.map((feature, idx) => (
            <div key={idx} className="glass-panel p-8 rounded-2xl glass-panel-hover group">
              <div className="w-12 h-12 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-center mb-6 group-hover:border-red-500/30 group-hover:text-[#EF4444] transition-colors">
                <feature.icon className="w-6 h-6 text-slate-400 group-hover:text-[#EF4444]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Technical Details */}
        <div className="mt-24 max-w-4xl mx-auto glass-panel p-10 rounded-3xl border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]" />
          <h2 className="text-2xl font-bold text-white mb-6">How it works under the hood</h2>
          <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
            <p>
              When you add an endpoint, our scheduling engine dispatches HTTP/HTTPS requests from our distributed edge network. We measure DNS resolution, TCP connection time, TLS handshake, and Time to First Byte (TTFB).
            </p>
            <p>
              If a check fails, we immediately trigger a secondary verification from a completely different geographic region. Only when both regions confirm the outage do we trigger an incident, ensuring you only wake up for real emergencies.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
