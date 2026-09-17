"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import {
  LockIcon as Lock,
  ViewIcon as Eye,
  ViewOffIcon as EyeOff,
  Loading01Icon as Loader2,
  ArrowLeft01Icon as ArrowLeft,
} from "hugeicons-react";
import { toast } from "sonner";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Missing password reset token.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must contain at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to reset password.");
        setIsLoading(false);
        return;
      }

      toast.success("Password updated. Sign in with your new credentials.");
      router.push("/login");
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0C0D0E]">
        <div className="w-full max-w-md bg-[#121316] border border-red-500/30 p-6 sm:p-8 space-y-6">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-7 h-7 flex items-center justify-center border border-white/20 bg-black/40">
              <Image
                src={logo}
                alt="SpiderNode"
                width={22}
                height={22}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-black tracking-[0.25em] text-white uppercase leading-none">
                SpiderNode
              </span>
              <span className="text-[9px] font-mono tracking-[0.25em] text-[#8E929B] uppercase mt-0.5">
                Telemetry System
              </span>
            </div>
          </Link>

          <div className="border-t border-white/10 pt-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#EF4444]" />
              <span className="swiss-kicker text-[#EF4444]">
                TOKEN MISSING OR EXPIRED
              </span>
            </div>
            <h2 className="text-xl font-bold uppercase tracking-tight text-white">
              Invalid Recovery Token
            </h2>
            <p className="text-xs font-mono text-[#8E929B] leading-relaxed">
              This password reset link is invalid or has expired. Please
              initiate a new recovery request.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/forgot-password"
              className="w-full py-3 bg-[#EF4444] hover:bg-white hover:text-black text-white font-mono text-xs font-bold uppercase tracking-[0.15em] transition-colors rounded-none flex items-center justify-center gap-2 cursor-pointer"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0C0D0E] text-slate-100">
      <div className="w-full max-w-md bg-[#121316] border border-white/15 p-6 sm:p-8 space-y-6">
        {/* Brand Header */}
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-7 h-7 flex items-center justify-center border border-white/20 bg-black/40">
            <Image
              src={logo}
              alt="SpiderNode"
              width={22}
              height={22}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-black tracking-[0.25em] text-white uppercase leading-none">
              SpiderNode
            </span>
            <span className="text-[9px] font-mono tracking-[0.25em] text-[#8E929B] uppercase mt-0.5">
              Telemetry System
            </span>
          </div>
        </Link>

        {/* Section Title */}
        <div className="border-t border-white/10 pt-4 space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#EF4444]" />
            <span className="swiss-kicker">02 // CREDENTIAL OVERWRITE</span>
          </div>
          <h1 className="text-xl font-bold uppercase tracking-tight text-white">
            Set New Password
          </h1>
          <p className="text-xs font-mono text-[#8E929B]">
            SPECIFY NEW ACCESS KEY FOR TELEMETRY ENVIRONMENT
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono uppercase tracking-widest text-[#8E929B]">
              New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                minLength={6}
                className="w-full pl-10 pr-10 py-2.5 bg-[#0C0D0E] border border-white/15 focus:border-[#EF4444] text-white placeholder-[#8E929B]/50 text-xs font-mono outline-none rounded-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono uppercase tracking-widest text-[#8E929B]">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0C0D0E] border border-white/15 focus:border-[#EF4444] text-white placeholder-[#8E929B]/50 text-xs font-mono outline-none rounded-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#EF4444] hover:bg-white hover:text-black text-white font-mono text-xs font-bold uppercase tracking-[0.15em] transition-colors rounded-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating Credentials...</span>
              </>
            ) : (
              <span>Confirm Password Update</span>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#8E929B]">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0C0D0E]">
          <Loader2 className="w-8 h-8 animate-spin text-[#EF4444]" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
