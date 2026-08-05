"use client";

import { Alert01Icon as AlertCircle } from "hugeicons-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-[#090D16]">
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0F172A] border border-red-500/20 rounded-2xl p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Fatal Application Error</h2>
              <p className="text-slate-400 text-sm">
                A critical error occurred. We are working to resolve the issue.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => reset()}
                className="w-full px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm transition-all"
              >
                Attempt Recovery
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
