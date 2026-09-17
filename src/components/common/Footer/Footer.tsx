"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";

const footerLinks = {
  features: [
    { name: "HTTP / HTTPS Ping", href: "/features/uptime-monitoring" },
    { name: "REST API Validation", href: "/features/api-monitoring" },
    { name: "Public Status Pages", href: "/features/status-pages" },
    { name: "Automated Incident Log", href: "/features/incident-response" },
  ],
  resources: [
    { name: "Documentation", href: "/docs" },
    { name: "API Reference", href: "/api-reference" },
    { name: "Public Status Board", href: "/status" },
    {
      name: "GitHub Repository",
      href: "https://github.com/rakibutsho/uptime-tracker",
    },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Settings", href: "/cookie-settings" },
    { name: "Security SLA", href: "/security-sla" },
  ],
};

export const Footer = () => {
  return (
    <footer className="w-full border-t-2 border-white bg-[#0C0D0E] text-[#F4F4F5] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        {/* 12-Column Swiss Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/15">
          {/* Brand & Technical Identity (Col 1-5) */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-7 bg-[#EF4444]" />
              <Image
                src={logo}
                alt="SpiderNode Logo"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
              <div>
                <span className="text-2xl font-black uppercase tracking-[-0.04em] text-white leading-none block">
                  SpiderNode
                </span>
                <span className="text-[10px] font-mono tracking-[0.22em] text-[#8E929B] uppercase mt-0.5 block">
                  Autonomous Infrastructure Telemetry
                </span>
              </div>
            </div>

            <p className="text-xs text-[#A0A4AD] max-w-sm leading-relaxed text-left">
              Engineered with deterministic polling loops, zero-delay failover
              alerts, and multi-region quorum validation.
            </p>

            {/* Swiss Precision Status Stamp */}
            <div className="border border-white/15 p-3.5 bg-[#121316] max-w-xs">
              <div className="flex items-center justify-between font-mono text-[10px] text-[#8E929B] uppercase tracking-wider mb-1">
                <span>SYSTEM STATUS</span>
                <span className="text-white font-bold">ALL PROBES UP</span>
              </div>
              <div className="text-sm font-mono font-bold text-white tracking-tight">
                99.98% 30-DAY METRIC
              </div>
            </div>
          </div>

          {/* Nav Columns (Col 6-12) */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Features */}
            <div>
              <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#EF4444] font-bold mb-4">
                01 // CAPABILITIES
              </h3>
              <ul className="space-y-2.5">
                {footerLinks.features.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-xs text-[#A0A4AD] hover:text-white transition-colors block text-left"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#EF4444] font-bold mb-4">
                02 // DIRECTORY
              </h3>
              <ul className="space-y-2.5">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-xs text-[#A0A4AD] hover:text-white transition-colors block text-left"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#EF4444] font-bold mb-4">
                03 // COMPLIANCE
              </h3>
              <ul className="space-y-2.5">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-xs text-[#A0A4AD] hover:text-white transition-colors block text-left"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Monospaced Swiss Baseline */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-[11px] text-[#8E929B] tracking-wider uppercase">
          <div>
            © {new Date().getFullYear()} SPIDERNODE TELEMETRY SYSTEMS. ALL
            RIGHTS RESERVED.
          </div>
          <div>
            DEVELOPED BY{" "}
            <Link
              href="https://rakibutsho.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#EF4444] underline underline-offset-4 transition-colors font-bold"
            >
              MD. RAKIBUL ISLAM
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
