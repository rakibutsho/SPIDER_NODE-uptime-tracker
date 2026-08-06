import React from 'react';
import { Activity01Icon as Activity, ServerStack01Icon as Server, Database01Icon as Database, EarthIcon } from "hugeicons-react";

export default function GlobalStatusPage() {
  const components = [
    { name: "Monitoring Engine (US-East)", status: "Operational", icon: Server },
    { name: "Monitoring Engine (EU-West)", status: "Operational", icon: Server },
    { name: "Web Dashboard", status: "Operational", icon: Activity },
    { name: "REST API", status: "Operational", icon: Database },
    { name: "Alerting Pipeline", status: "Operational", icon: EarthIcon },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#090D16] text-slate-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading tracking-tight">
            SpiderNode System Status
          </h1>
          <p className="text-lg text-slate-400">
            Real-time information about the SpiderNode network and API services.
          </p>
        </div>

        {/* Global Status Banner */}
        <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between mb-12 shadow-lg shadow-emerald-500/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-emerald-400">All Systems Operational</h2>
              <p className="text-sm text-slate-400">Last updated: Just now</p>
            </div>
          </div>
        </div>

        {/* Components Status */}
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-800 bg-slate-900/40">
            <h3 className="text-lg font-bold text-white">System Components</h3>
          </div>
          <div className="divide-y divide-slate-800/50">
            {components.map((comp, idx) => (
              <div key={idx} className="p-6 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-4">
                  <comp.icon className="w-5 h-5 text-slate-500" />
                  <span className="font-medium text-slate-200">{comp.name}</span>
                </div>
                <div className="text-emerald-400 text-sm font-semibold tracking-wide">
                  {comp.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-sm text-slate-500 mt-12">
          Historical uptime for the last 90 days is <strong>99.99%</strong>.
        </p>

      </div>
    </div>
  );
}
