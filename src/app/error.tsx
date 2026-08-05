"use client";

import { useEffect } from "react";
import { Alert01Icon as AlertCircle, RefreshIcon as RefreshCw } from "hugeicons-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error("App Error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full glass-panel border border-red-500/20 rounded-2xl p-8 text-center space-y-6 relative overflow-hidden bg-slate-950/80 backdrop-blur-md">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50"></div>
        
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Something went wrong!</h2>
          <p className="text-slate-400 text-sm">
            We experienced an unexpected error. Our team has been notified.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
          
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-all flex items-center justify-center"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
