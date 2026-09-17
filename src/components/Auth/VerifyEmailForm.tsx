"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import {
  Tick01Icon as Check,
  Cancel01Icon as XIcon,
  Loading01Icon as Loader2,
  ArrowRight01Icon as ArrowRight,
} from "hugeicons-react";
import { toast } from "sonner";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setMessage(data.error || "Verification failed or token expired.");
          return;
        }

        setStatus("success");
        setMessage("Email address verified. Account is fully activated.");
        toast.success("Email verified successfully.");
      } catch {
        setStatus("error");
        setMessage("An unexpected error occurred during verification.");
      }
    };

    verifyEmail();
  }, [token]);

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

        {/* State Banner */}
        <div className="border-t border-white/10 pt-4 space-y-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 ${
                status === "success"
                  ? "bg-emerald-500"
                  : status === "error"
                    ? "bg-[#EF4444]"
                    : "bg-white/40 animate-pulse"
              }`}
            />
            <span className="swiss-kicker">
              {status === "loading" && "01 // VERIFYING_TOKEN"}
              {status === "success" && "01 // VERIFICATION_CONFIRMED"}
              {status === "error" && "01 // VERIFICATION_FAILED"}
            </span>
          </div>

          <h1 className="text-xl font-bold uppercase tracking-tight text-white">
            {status === "loading" && "Validating Security Token"}
            {status === "success" && "Identity Verified"}
            {status === "error" && "Verification Rejected"}
          </h1>

          <p className="text-xs font-mono text-[#8E929B] leading-relaxed">
            {status === "loading" &&
              "Communicating with authorization node. Please wait..."}
            {status === "success" &&
              "Your email address has been verified. You may now proceed to the authentication console."}
            {status === "error" &&
              (message || "The verification token could not be authorized.")}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {status === "loading" && (
            <div className="py-3 px-4 border border-white/15 flex items-center justify-center gap-2 text-xs font-mono text-[#8E929B]">
              <Loader2 className="w-4 h-4 animate-spin text-[#EF4444]" />
              <span>PROCESSING...</span>
            </div>
          )}

          {status === "success" && (
            <Link
              href="/login"
              className="w-full py-3 bg-[#EF4444] hover:bg-white hover:text-black text-white font-mono text-xs font-bold uppercase tracking-[0.15em] transition-colors rounded-none flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          {status === "error" && (
            <div className="space-y-3">
              <Link
                href="/login"
                className="w-full py-3 border border-white/20 bg-transparent hover:bg-white hover:text-black text-white font-mono text-xs font-bold uppercase tracking-[0.15em] transition-colors rounded-none flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Return to Login</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function VerifyEmailForm() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0C0D0E]">
          <Loader2 className="w-8 h-8 animate-spin text-[#EF4444]" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
