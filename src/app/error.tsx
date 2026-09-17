"use client";

import { useEffect } from "react";
import { RefreshIcon as RefreshCw, Home01Icon as Home } from "hugeicons-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-8 bg-[#0C0D0E]">
      <div className="w-full max-w-2xl border border-red-500/30 bg-[#121316] p-6 sm:p-12 space-y-6">
        {/* Kicker */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#EF4444]" />
          <span className="swiss-kicker text-[#EF4444]">
            500 // RUNTIME_FAULT_DETECTED
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            Application Execution Interrupted
          </h1>
          <p className="text-xs font-mono text-[#8E929B] leading-relaxed">
            An unhandled runtime exception halted rendering. The event trace has
            been logged to the telemetry audit pipeline.
          </p>
        </div>

        {/* Diagnostics block */}
        {error.digest && (
          <div className="p-4 border border-white/10 bg-[#0C0D0E] font-mono text-xs space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-[#8E929B]">
              EXCEPTION TRACE DIGEST
            </span>
            <p className="text-white break-all">{error.digest}</p>
          </div>
        )}

        {/* Actions */}
        <div className="border-t border-white/15 pt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-[#EF4444] hover:bg-white hover:text-black text-white font-mono text-xs font-bold uppercase tracking-[0.15em] transition-colors rounded-none flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Attempt Recovery</span>
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-white/20 bg-transparent hover:bg-white/10 text-white font-mono text-xs uppercase tracking-[0.15em] transition-colors rounded-none flex items-center gap-2 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
