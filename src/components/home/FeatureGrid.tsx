"use client";

import React from "react";
import { Globe02Icon as Globe2, Shield01Icon as ShieldCheck, FlashIcon as Zap } from "hugeicons-react";

export default function FeatureGrid() {
  return (
    <div className="border-t border-slate-800/80 bg-[#0F172A]/40 py-20 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold font-heading tracking-tight text-white">
            Built for Engineering Teams
          </h2>
          <p className="text-slate-400 mt-2 text-sm">
            Everything you need to guarantee high availability and maintain customer trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-red-500/40 transition-colors">
            <div className="p-3 rounded-xl bg-red-500/10 text-[#EF4444] w-fit mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-heading text-white mb-2">Sub-Minute Pings</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated continuous health checks ensure downtime is detected within seconds, before your customers notice.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-red-500/40 transition-colors">
            <div className="p-3 rounded-xl bg-red-500/10 text-[#EF4444] w-fit mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-heading text-white mb-2">Multi-Region Validation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Health checks double verify from multiple geographic locations to prevent false alarm noise.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-red-500/40 transition-colors">
            <div className="p-3 rounded-xl bg-red-500/10 text-[#EF4444] w-fit mb-4">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-heading text-white mb-2">Instant Alerting</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive instant notifications via Webhooks, Email, or Telegram when any endpoint experiences latency spikes or HTTP errors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
