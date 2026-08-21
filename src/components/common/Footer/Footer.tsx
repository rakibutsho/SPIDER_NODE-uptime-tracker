"use client";

import React from "react";
import Link from "next/link";
import { Activity01Icon as Activity, GithubIcon as Github, Linkedin01Icon as Linkedin, Mail01Icon as Mail, TwitterIcon as Twitter } from "hugeicons-react";
import Image from "next/image";
import logo from "@/assets/logo.png"

const footerLinks = {
  features: [
    { name: "Uptime Monitoring", href: "/features/uptime-monitoring" },
    { name: "API Monitoring", href: "/features/api-monitoring" },
    { name: "Status Pages", href: "/features/status-pages" },
    { name: "Incident Response", href: "/features/incident-response" },
  ],
  resources: [
    { name: "Documentation", href: "/docs" },
    { name: "API Reference", href: "/api-reference" },
    { name: "System Status", href: "/status" },
    { name: "GitHub Repository", href: "https://github.com/rakibutsho/uptime-tracker" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Settings", href: "/cookie-settings" },
    { name: "Security SLA", href: "/security-sla" },
  ],
};

const socialLinks = [
  { name: "GitHub", href: "https://github.com/rakibutsho/uptime-tracker", icon: Github },
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "LinkedIn", href: "#", icon: Linkedin },
  { name: "Email", href: "mailto:support@spidernode.com", icon: Mail },
];

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#121212] text-slate-300 w-full font-sans">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Logo & Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              {/* <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-[#EF4444] group-hover:scale-105 transition-transform shadow-sm shadow-red-500/20">
                <Activity className="w-5 h-5" />
              </div> */}
              <Image src={logo} alt="Logo" width={50} height={50} className="w-12 h-12 object-contain" />
              <span className="text-xl font-bold tracking-tight text-white font-mono">
                Spider<span className="text-[#EF4444]">Node</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Real-time infrastructure health monitoring, HTTP uptime checks, and instant developer alerts with zero false positives.
            </p>

            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational (99.98%)</span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-[#EF4444] hover:border-slate-700 transition-colors"
                  title={social.name}
                >
                  <social.icon className="w-4 h-4" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Features Links */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-white mb-4">
              Features
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.features.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs text-slate-400 hover:text-[#EF4444] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-white mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs text-slate-400 hover:text-[#EF4444] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-white mb-4">
              Legal
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs text-slate-400 hover:text-[#EF4444] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-mono">
            © {new Date().getFullYear()} SpiderNode. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 font-mono flex items-center gap-1">
            Designed & Developed by{" "}
            <Link 
              href="https://rakibutsho.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-[#EF4444] transition-colors"
            >
              Md. Rakibul Islam
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};
