import React from 'react';
import Link from 'next/link';
import { ArrowRight01Icon as ArrowRight } from "hugeicons-react";

export default function DocsPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#121212] text-slate-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading tracking-tight">
            Documentation
          </h1>
          <p className="text-lg text-slate-400">
            Learn how to monitor your infrastructure, set up alerts, and integrate SpiderNode with your existing stack.
          </p>
        </div>

        <div className="space-y-12">
          
          {/* Quick Start */}
          <section className="glass-panel p-8 md:p-10 rounded-3xl border border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-4">Quick Start</h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              Get your first monitor up and running in less than 2 minutes. Our wizard will guide you through setting up a basic HTTP/HTTPS check.
            </p>
            <ol className="list-decimal list-inside space-y-3 text-slate-300 font-mono text-sm bg-slate-900/50 p-6 rounded-xl border border-slate-800">
              <li>Sign up for a free account.</li>
              <li>Navigate to the Dashboard and click <strong>"Add Monitor"</strong>.</li>
              <li>Select the monitor type (HTTP, TCP, or DNS).</li>
              <li>Enter your URL and desired check interval.</li>
              <li>Save. Your endpoint is now being monitored globally!</li>
            </ol>
          </section>

          {/* Concepts Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 hover:border-red-500/30 transition-colors">
              <h3 className="text-xl font-bold text-white mb-3">Alerting Rules</h3>
              <p className="text-sm text-slate-400 mb-6">
                Understand how our multi-region verification prevents false positives and how to route alerts to specific teams.
              </p>
              <Link href="#" className="text-[#EF4444] font-semibold text-sm inline-flex items-center gap-1 group">
                Read more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-slate-800 hover:border-red-500/30 transition-colors">
              <h3 className="text-xl font-bold text-white mb-3">API Monitoring</h3>
              <p className="text-sm text-slate-400 mb-6">
                Learn how to write JSON assertions and authenticate requests to ensure your APIs are returning the right data.
              </p>
              <Link href="#" className="text-[#EF4444] font-semibold text-sm inline-flex items-center gap-1 group">
                Read more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </section>

        </div>
      </div>
    </div>
  );
}
