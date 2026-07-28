"use client";

import React from "react";
import Link from "next/link";
import { Activity, Github, Linkedin, Mail, Twitter } from "lucide-react";

const footerLinks = {
  product: [
    { name: "Uptime Monitoring", href: "#" },
    { name: "API Monitoring", href: "#" },
    { name: "Status Pages", href: "#" },
    { name: "Incident Response", href: "#" },
  ],
  resources: [
    { name: "Documentation", href: "#" },
    { name: "API Reference", href: "#" },
    { name: "System Status", href: "#" },
    { name: "GitHub Repository", href: "https://github.com" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Settings", href: "#" },
    { name: "Security SLA", href: "#" },
  ],
};

const socialLinks = [
  { name: "GitHub", href: "https://github.com", icon: Github },
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "LinkedIn", href: "#", icon: Linkedin },
  { name: "Email", href: "mailto:support@pulseguard.io", icon: Mail },
];

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#090D16] text-slate-300 w-full font-sans">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Logo & Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[#00E5FF] group-hover:scale-105 transition-transform cyan-glow">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-mono">
                Pulse<span className="text-[#00E5FF]">Guard</span>
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
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-[#00E5FF] hover:border-slate-700 transition-colors"
                  title={social.name}
                >
                  <social.icon className="w-4 h-4" />
                  <span className="sr-only">{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-white mb-4">
              Product
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs text-slate-400 hover:text-[#00E5FF] transition-colors"
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
                  <a
                    href={link.href}
                    className="text-xs text-slate-400 hover:text-[#00E5FF] transition-colors"
                  >
                    {link.name}
                  </a>
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
                    className="text-xs text-slate-400 hover:text-[#00E5FF] transition-colors"
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
            © {new Date().getFullYear()} PulseGuard. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 font-mono">
            Designed for high availability & engineering teams.
          </p>
        </div>
      </div>
    </footer>
  );
};
