"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { ArrowLeft01Icon as ArrowLeft } from "hugeicons-react";

export function VerifyEmailSent() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0C0D0E]">
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

        {/* Message */}
        <div className="border-t border-white/10 pt-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500" />
            <span className="swiss-kicker text-emerald-400">
              ACTIVATION TOKEN DISPATCHED
            </span>
          </div>
          <h1 className="text-xl font-bold uppercase tracking-tight text-white">
            Verify Email Address
          </h1>
          <p className="text-xs font-mono text-[#8E929B] leading-relaxed">
            We have transmitted an activation dispatch to your email address.
            Follow the included link to authorize your operator profile and
            access the telemetry network.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/login"
            className="w-full py-3 border border-white/20 bg-transparent hover:bg-white hover:text-black text-white font-mono text-xs font-bold uppercase tracking-[0.15em] transition-colors rounded-none flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
