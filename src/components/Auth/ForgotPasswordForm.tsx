"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import {
  Mail01Icon as Mail,
  ArrowLeft01Icon as ArrowLeft,
  Loading01Icon as Loader2,
} from "hugeicons-react";
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
      toast.success("Password recovery link dispatched.");
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0C0D0E]">
        <div className="w-full max-w-md bg-[#121316] border border-white/15 p-6 sm:p-8 space-y-6">
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
              <span className="w-2 h-2 bg-emerald-500" />
              <span className="swiss-kicker text-emerald-400">
                DISPATCH CONFIRMED
              </span>
            </div>
            <h2 className="text-xl font-bold uppercase tracking-tight text-white">
              Check Transmission Inbox
            </h2>
            <p className="text-xs font-mono text-[#8E929B] leading-relaxed">
              A secure password reset token has been transmitted to{" "}
              <span className="text-white font-semibold">{email}</span>. Follow
              the link to complete recovery.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/login"
              className="w-full py-3 border border-white/20 bg-transparent hover:bg-white hover:text-black text-white font-mono text-xs font-bold uppercase tracking-[0.15em] transition-colors rounded-none flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Authentication</span>
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
            <span className="swiss-kicker">01 // RECOVERY PROTOCOL</span>
          </div>
          <h1 className="text-xl font-bold uppercase tracking-tight text-white">
            Reset Password
          </h1>
          <p className="text-xs font-mono text-[#8E929B]">
            SUBMIT ACCOUNT EMAIL TO RECEIVE ACCESS CREDENTIAL TOKEN
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono uppercase tracking-widest text-[#8E929B]">
              Registered Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@domain.com"
                required
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
                <span>Transmitting Token...</span>
              </>
            ) : (
              <span>Send Recovery Link</span>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#8E929B]">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
          <Link href="/register" className="hover:text-white transition-colors">
            Register Account
          </Link>
        </div>
      </div>
    </div>
  );
}
