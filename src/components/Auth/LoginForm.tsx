"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Activity01Icon as Activity, ArrowRight01Icon as ArrowRight, GithubIcon as Github, Mail01Icon as Mail, LockIcon as Lock, ViewIcon as Eye, ViewOffIcon as EyeOff, Loading01Icon as Loader2 } from "hugeicons-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  let callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  // Sanitize callbackUrl to prevent localhost redirects in production
  try {
    if (callbackUrl.startsWith("http")) {
      const parsedUrl = new URL(callbackUrl);
      if (typeof window !== "undefined" && parsedUrl.hostname !== window.location.hostname) {
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
        router.push(callbackUrl);
        router.refresh();
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
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#121212] text-slate-100 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3 group">
            {/* <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-[#EF4444] group-hover:scale-105 transition-transform shadow-sm shadow-red-500/20">
              <Activity className="w-6 h-6" />
            </div> */}
            <Image src={logo} alt="Logo" width={50} height={50} className="w-12 h-12 object-contain" />
            <span className="text-2xl font-bold tracking-tight text-white font-mono">
              Spider<span className="text-[#EF4444]">Node</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-100 mt-2">Welcome Back</h1>
          <p className="text-sm text-slate-400 mt-1">
            Sign in to access your monitor health metrics
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel p-8 rounded-2xl shadow-2xl border border-slate-800/80">
          {/* Social Sign-In Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              disabled={!!socialLoading || isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 text-slate-200 text-sm font-medium transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              {socialLoading === "google" ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#EF4444]" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin("github")}
              disabled={!!socialLoading || isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 text-slate-200 text-sm font-medium transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              {socialLoading === "github" ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#EF4444]" />
              ) : (
                <Github className="w-4 h-4 text-slate-100" />
              )}
              <span>Continue with GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <span className="relative px-3 text-xs uppercase tracking-wider text-slate-500 bg-[#0F172A] rounded-full">
              or continue with email
            </span>
          </div>

          {/* Form */}
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
                  placeholder="developer@company.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/60 text-slate-100 placeholder-slate-500 text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-slate-400 hover:text-slate-300 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/60 text-slate-100 placeholder-slate-500 text-sm outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
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
              className="w-full mt-2 py-3 rounded-xl bg-[#EF4444] hover:bg-red-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Sign Up */}
          <div className="mt-6 text-center text-xs text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-[#EF4444] hover:underline font-medium ml-1"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoginForm() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#121212] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#EF4444]"/></div>}>
      <LoginFormContent />
    </Suspense>
  );
}
