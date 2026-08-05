"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail01Icon as Mail, ArrowLeft01Icon as ArrowLeft, Loading01Icon as Loader2 } from "hugeicons-react";
import { toast } from "sonner";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Something went wrong.");
        setIsLoading(false);
        return;
      }

      setIsSent(true);
      toast.success("Password reset email sent!");
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#090D16]">
        <div className="max-w-md w-full glass-panel border border-slate-800 rounded-2xl p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-emerald-500" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Check your email</h2>
            <p className="text-slate-400 text-sm">
              We've sent a password reset link to <span className="text-white font-medium">{email}</span>.
            </p>
          </div>
          <div className="pt-4 flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-all"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#090D16] text-slate-100 relative overflow-hidden">
      <div className="w-full max-w-md z-10 my-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-100">Forgot Password</h1>
          <p className="text-sm text-slate-400 mt-1">
            Enter your email to receive a reset link
          </p>
        </div>

        <div className="glass-panel p-8 rounded-2xl shadow-2xl border border-slate-800/80">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-[#DC2626]/60 focus:ring-1 focus:ring-[#DC2626]/60 text-slate-100 placeholder-slate-500 text-sm outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-[#DC2626] hover:bg-red-500 text-white font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Link...</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
