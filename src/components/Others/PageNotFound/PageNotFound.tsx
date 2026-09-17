"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft01Icon as ArrowLeft,
  Home01Icon as Home,
} from "hugeicons-react";

interface NotFoundProps {
  pageName?: string;
}

const PageNotFound: React.FC<NotFoundProps> = ({ pageName = "requested" }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-4xl border border-white/15 bg-[#121316] p-6 sm:p-12 lg:p-16 space-y-8">
        {/* Header Kicker */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#EF4444]" />
          <span className="swiss-kicker text-[#EF4444]">
            404 // DIAGNOSTIC ROUTE_NOT_FOUND
          </span>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-t border-white/15 pt-8">
          {/* Left Column: Massive Headline */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="text-8xl sm:text-9xl font-black text-white tracking-tighter leading-none font-sans">
              404
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
              Target Route Unreachable
            </h1>
            <p className="text-xs font-mono text-[#8E929B] leading-relaxed max-w-md">
              The specified endpoint or telemetry path{" "}
              <span className="text-white font-semibold">/{pageName}</span> is
              not registered within the SpiderNode routing registry. Verify the
              path or return to base console.
            </p>
          </div>

          {/* Right Column: Monospace Diagnostics Box */}
          <div className="lg:col-span-5 border border-white/10 bg-[#0C0D0E] p-5 space-y-3 font-mono text-xs">
            <div className="text-[10px] uppercase tracking-widest text-[#8E929B] border-b border-white/10 pb-2">
              DIAGNOSTIC METADATA
            </div>
            <div className="space-y-1.5 text-[11px] text-[#8E929B]">
              <div className="flex justify-between">
                <span>STATUS_CODE:</span>
                <span className="text-white font-bold">404</span>
              </div>
              <div className="flex justify-between">
                <span>CLASSIFICATION:</span>
                <span className="text-[#EF4444]">NOT_FOUND</span>
              </div>
              <div className="flex justify-between">
                <span>REQUESTED_RESOURCE:</span>
                <span className="text-white truncate max-w-[140px]">
                  /{pageName}
                </span>
              </div>
              <div className="flex justify-between">
                <span>RECOVERY_ACTION:</span>
                <span className="text-emerald-400">REDIRECT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-white/15 pt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-[#EF4444] hover:bg-white hover:text-black text-white font-mono text-xs font-bold uppercase tracking-[0.15em] transition-colors rounded-none flex items-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 border border-white/20 bg-transparent hover:bg-white/10 text-white font-mono text-xs uppercase tracking-[0.15em] transition-colors rounded-none flex items-center gap-2 cursor-pointer"
          >
            <span>Telemetry Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
