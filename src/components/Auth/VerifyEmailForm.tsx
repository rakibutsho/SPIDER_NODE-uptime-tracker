"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckmarkCircle01Icon as CheckCircle, Cancel01Icon as XCircle, Loading01Icon as Loader } from "hugeicons-react";
import { toast } from "sonner";
import { Suspense } from "react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
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
          setMessage(data.error || "Something went wrong.");
          return;
        }

        setStatus("success");
        setMessage("Email verified successfully!");
        toast.success("Email verified successfully!");
      } catch (error) {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-panel border border-slate-800 rounded-2xl p-8 text-center space-y-6">
        <div className="flex justify-center">
          {status === "loading" && (
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
              <Loader className="w-8 h-8 text-slate-400 animate-spin" />
            </div>
          )}
          {status === "success" && (
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
          )}
          {status === "error" && (
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {status === "loading" && "Verifying your email..."}
            {status === "success" && "Verification Complete"}
            {status === "error" && "Verification Failed"}
          </h2>
          <p className="text-slate-400 text-sm">
            {status === "loading" && "Please wait while we verify your email address."}
            {status === "success" && "Thank you! Your email has been verified. You can now sign in to your account."}
            {status === "error" && message}
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          {status === "success" && (
            <Link
              href="/login"
              className="w-full px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm transition-all"
            >
              Go to Login
            </Link>
          )}
          {status === "error" && (
            <Link
              href="/login"
              className="w-full px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-all"
            >
              Back to Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function VerifyEmailForm() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
