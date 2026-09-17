"use client";

import { RefreshIcon as RefreshCw } from "hugeicons-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0C0D0E] text-[#EDEDED] font-sans antialiased m-0 p-0">
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-xl border border-red-500/40 bg-[#121316] p-6 sm:p-10 space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#EF4444]" />
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-bold text-[#EF4444]">
                CRITICAL // ROOT_EXCEPTION
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold uppercase tracking-tight text-white">
                Fatal Kernel Fault
              </h1>
              <p className="text-xs font-mono text-[#8E929B] leading-relaxed">
                A critical framework error interrupted top-level application
                hydration. An emergency re-initialization is required.
              </p>
            </div>

            {error?.digest && (
              <div className="p-3 border border-white/10 bg-[#0C0D0E] font-mono text-[11px] text-[#8E929B]">
                TRACE_ID: {error.digest}
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => reset()}
                className="w-full py-3 bg-[#EF4444] hover:bg-white hover:text-black text-white font-mono text-xs font-bold uppercase tracking-[0.15em] transition-colors rounded-none flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-Initialize Application</span>
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
