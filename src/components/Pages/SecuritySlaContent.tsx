"use client";
import React from 'react';
import { Shield01Icon as Shield, ServerStack01Icon as Server, LockKeyIcon as Lock } from "hugeicons-react";

export default function SecuritySlaContent() {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#121212] text-slate-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading tracking-tight">
            Security & SLA
          </h1>
          <p className="text-lg text-slate-400">
            Our commitment to keeping your data secure and our services highly available.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-white font-bold mb-2">SOC 2 Type II</h3>
            <p className="text-xs text-slate-400">Compliant infrastructure and strict access controls.</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-blue-500/30 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-white font-bold mb-2">AES-256 Encryption</h3>
            <p className="text-xs text-slate-400">All data is encrypted at rest and in transit.</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-red-500/30 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <Server className="w-6 h-6 text-[#EF4444]" />
            </div>
            <h3 className="text-white font-bold mb-2">99.99% SLA</h3>
            <p className="text-xs text-slate-400">Financially backed uptime guarantee for enterprise.</p>
          </div>

        </div>

        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-slate-800 space-y-10">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Service Level Agreement (SLA)</h2>
            <p className="text-slate-400 leading-relaxed">
              SpiderNode guarantees a 99.99% monthly uptime for its monitoring infrastructure and API endpoints. If we fall short of this commitment, eligible customers will receive a service credit towards their next billing cycle.
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 mt-4">
              <li>99.9% - 99.99% Uptime: 10% Service Credit</li>
              <li>99.0% - 99.9% Uptime: 30% Service Credit</li>
              <li>Less than 99.0% Uptime: 100% Service Credit</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Data Security & Encryption</h2>
            <p className="text-slate-400 leading-relaxed">
              All data transmitted between your browser or servers and SpiderNode is encrypted using TLS 1.2 or higher. We use AES-256 encryption for all sensitive data stored in our databases, including API tokens, webhook URLs, and password hashes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Vulnerability Management</h2>
            <p className="text-slate-400 leading-relaxed">
              We perform regular automated vulnerability scans of our infrastructure. We also run a private bug bounty program. If you believe you have found a security vulnerability, please contact us immediately at security@spidernode.com.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
