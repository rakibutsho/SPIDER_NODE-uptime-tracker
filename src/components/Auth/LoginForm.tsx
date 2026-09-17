"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import {
  ArrowRight01Icon as ArrowRight,
  GithubIcon as Github,
  Mail01Icon as Mail,
  LockIcon as Lock,
  ViewIcon as Eye,
  ViewOffIcon as EyeOff,
  Loading01Icon as Loader2,
} from "hugeicons-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  let callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  // Sanitize callbackUrl to prevent localhost redirects in production
  try {
    if (callbackUrl.startsWith("http")) {
      const parsedUrl = new URL(callbackUrl);
      if (
        typeof window !== "undefined" &&
        parsedUrl.hostname !== window.location.hostname
      ) {
        callbackUrl = parsedUrl.pathname + parsedUrl.search;
      }
    }
  } catch (e) {
    callbackUrl = "/dashboard";
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  useEffect(() => {
    const authError = searchParams.get("error");
    if (authError) {
      if (authError === "OAuthAccountNotLinked") {
        toast.error(
          "An account already exists with this email using another login provider.",
        );
      } else if (authError === "OAuthSignin" || authError === "OAuthCallback") {
        toast.error("Social authentication failed. Please try again.");
      } else if (authError === "AccessDenied") {
        toast.error("Access denied. Please check your account permissions.");
      } else {
        toast.error(`Authentication error: ${authError}`);
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error || "Invalid email or password.");
      } else if (res?.ok) {
        toast.success("Welcome back! Redirecting to dashboard...");
        window.location.href = callbackUrl;
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred during sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    setSocialLoading(provider);
    try {
      await signIn(provider, { callbackUrl });
    } catch (err) {
      console.error(err);
      toast.error(`Failed to initiate sign in with ${provider}`);
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 bg-[#0C0D0E] text-[#F4F4F5] font-sans">
      <div className="w-full max-w-md border border-white/15 bg-[#121316] p-8 sm:p-10 rounded-none">
        {/* Brand Header */}
        <div className="border-b border-white/15 pb-6 mb-8 text-left">
          <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
            <Image
              src={logo}
              alt="SpiderNode Logo"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-[-0.04em] text-white uppercase leading-none">
                SpiderNode
              </span>
              <span className="text-[9px] font-mono tracking-[0.25em] text-[#8E929B] uppercase mt-0.5">
                Telemetry System
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-[#EF4444]" />
            <span className="swiss-kicker">01 // IDENTITY ACCESS PROTOCOL</span>
          </div>
          <h1 className="text-xl font-bold uppercase tracking-tight text-white mt-1">
            System Authentication
          </h1>
          <p className="text-xs text-[#8E929B] font-mono mt-1">
            VERIFY CREDENTIALS TO ACCESS TELEMETRY CONSOLE
          </p>
        </div>

        {/* Social Sign-In Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            disabled={!!socialLoading || isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#0C0D0E] hover:bg-white/[0.05] border border-white/15 text-white text-xs font-bold uppercase tracking-[0.15em] transition-colors rounded-none disabled:opacity-50 cursor-pointer"
          >
            {socialLoading === "google" ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#EF4444]" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#FFFFFF"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#FFFFFF"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FFFFFF"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#FFFFFF"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Authenticate with Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin("github")}
            disabled={!!socialLoading || isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#0C0D0E] hover:bg-white/[0.05] border border-white/15 text-white text-xs font-bold uppercase tracking-[0.15em] transition-colors rounded-none disabled:opacity-50 cursor-pointer"
          >
            {socialLoading === "github" ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#EF4444]" />
            ) : (
              <Github className="w-4 h-4 text-white" />
            )}
            <span>Authenticate with GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/15" />
          </div>
          <span className="relative px-3 text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E929B] bg-[#121316]">
            OR EMAIL DIRECT
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-[0.18em] text-[#A0A4AD] mb-2">
              Email Endpoint Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E929B]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@spidernode.site"
                required
                className="w-full pl-10 pr-4 py-3 bg-[#0C0D0E] border border-white/15 focus:border-white focus:outline-none text-white placeholder-[#5A5E67] text-xs font-mono rounded-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] font-mono uppercase tracking-[0.18em] text-[#A0A4AD]">
                Security Passkey
              </label>
              <Link
                href="/forgot-password"
                className="text-[10px] font-mono uppercase tracking-wider text-[#8E929B] hover:text-[#EF4444] transition-colors"
              >
                Reset Key?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E929B]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-10 pr-10 py-3 bg-[#0C0D0E] border border-white/15 focus:border-white focus:outline-none text-white placeholder-[#5A5E67] text-xs font-mono rounded-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8E929B] hover:text-white"
                aria-label="Toggle password view"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !!socialLoading}
            className="w-full mt-4 py-3.5 bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold text-xs uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 rounded-none shadow-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>VERIFYING CREDENTIALS...</span>
              </>
            ) : (
              <>
                <span>ENTER SYSTEM</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Switch to Sign Up */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center font-mono text-[11px] text-[#8E929B] uppercase tracking-wider">
          NEW OPERATOR?{" "}
          <Link
            href="/register"
            className="text-white hover:text-[#EF4444] font-bold underline underline-offset-4 ml-1"
          >
            CREATE ACCOUNT
          </Link>
        </div>
      </div>
    </div>
  );
}

export function LoginForm() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0C0D0E] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#EF4444]" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
