"use client";

import Link from "next/link";
import { Mail01Icon as Mail, ArrowLeft01Icon as ArrowLeft } from "hugeicons-react";

export function VerifyEmailSent() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-panel border border-slate-800 rounded-2xl p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-emerald-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Check your email</h2>
          <p className="text-slate-400 text-sm">
            We've sent a verification link to your email address. Please click the link to verify your account.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/login"
            className="text-emerald-500 hover:text-emerald-400 font-medium text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
