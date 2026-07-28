"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  User as UserIcon,
  Mail,
  ShieldCheck,
  KeyRound,
  Send,
  Calendar,
  Clock,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Lock,
  CheckCircle2,
  XCircle,
  Fingerprint,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  telegramChatId: string | null;
  hasPassword: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProfileComponent() {
  const { status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Protect route
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard/profile");
    }
  }, [status, router]);

  // Fetch Profile API
  const fetchProfile = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const res = await fetch("/api/user/profile");
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to load user profile");
      }

      const data = await res.json();
      if (data.user) {
        setProfile(data.user);
        if (isRefresh) {
          toast.success("Profile reloaded!");
        }
      } else {
        throw new Error(data.error || "Profile data missing");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
      toast.error("Could not fetch profile information");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, fetchProfile]);

  const handleCopyId = () => {
    if (profile?.id) {
      navigator.clipboard.writeText(profile.id);
      setCopiedId(true);
      toast.success("User ID copied to clipboard!");
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // Avatar fallback letters
  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "US";
  };

  // Date formatter helper
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-6 animate-pulse p-4 sm:p-6 lg:p-8">
        {/* Banner Skeleton */}
        <div className="h-44 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-slate-800" />
            <div className="space-y-2">
              <div className="w-44 h-6 bg-slate-800 rounded-md" />
              <div className="w-60 h-4 bg-slate-800/70 rounded-md" />
            </div>
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800" />
              <div className="w-24 h-4 bg-slate-800 rounded-md" />
              <div className="w-32 h-3 bg-slate-800/60 rounded-md" />
            </div>
          ))}
        </div>

        {/* Details Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 rounded-2xl bg-slate-900/60 border border-slate-800 p-6" />
          <div className="h-72 rounded-2xl bg-slate-900/60 border border-slate-800 p-6" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="w-full max-w-xl mx-auto p-8 rounded-2xl bg-slate-900/90 text-center">
        <div className="inline-flex p-4 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white font-mono">Failed to Load Profile</h2>
        <p className="text-sm text-slate-400">{error || "User information is unavailable."}</p>
        <button
          onClick={() => fetchProfile()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00E5FF] text-[#090D16] font-bold text-xs hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10 p-5 sm:p-8 lg:p-10 pb-24">
      {/* 1. Header Profile Cover Card */}
      <div className="relative rounded-2xl border border-slate-800/90 bg-slate-900/80 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Cover Background Banner */}
        <div className="h-32 sm:h-40 w-full bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 relative border-b border-slate-800/80">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px]" />

          {/* Top Right Action Buttons (Refresh & Pro Member) */}
          <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-[#00E5FF] text-xs font-semibold font-mono backdrop-blur-md shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pro Member</span>
            </span>

            <button
              onClick={() => fetchProfile(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium backdrop-blur-md transition-all cursor-pointer shadow-md hover:border-slate-700 disabled:opacity-50"
              title="Refresh Profile Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#00E5FF]" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="p-6 sm:p-10 pt-0 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 -mt-14 sm:-mt-20">
            {/* Avatar & User Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
              {/* Avatar Container with Active Dot */}
              <div className="relative shrink-0 w-28 h-28 sm:w-32 sm:h-32">
                <Avatar className="w-full h-full border-4 border-[#090D16] shadow-2xl rounded-full bg-slate-950">
                  <AvatarImage src={profile.image || undefined} alt={profile.name || "User"} className="object-cover w-full h-full rounded-full" />
                  <AvatarFallback className="bg-gradient-to-br from-slate-800 to-slate-950 text-[#00E5FF] font-bold text-2xl font-mono">
                    {getInitials(profile.name, profile.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-1 right-1 z-10 w-4.5 h-4.5 rounded-full bg-emerald-500 border-2 border-[#090D16] shadow-md" title="Active Account" />
              </div>

              {/* Name & Email */}
              <div className="space-y-1.5 pb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {profile.name || "Anonymous User"}
                </h1>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="font-mono text-slate-300">{profile.email || "No email attached"}</span>
                </div>
              </div>
            </div>

            {/* User ID Copy Button Pill */}
            <div className="pb-1">
              <button
                onClick={handleCopyId}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950/90 hover:bg-slate-800/80 border border-slate-800 text-slate-300 text-xs font-mono transition-all cursor-pointer shadow-md hover:border-slate-700"
                title="Click to copy User ID"
              >
                <Fingerprint className="w-4 h-4 text-[#00E5FF]" />
                <span className="text-slate-200 font-semibold">{profile.id}</span>
                {copiedId ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <Copy className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Account Status Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-slate-700/80 transition-all space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Account Status</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </p>
            <p className="text-xs text-slate-400 mt-1">Verified System User</p>
          </div>
        </div>

        {/* Security / Auth Method Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-slate-700/80 transition-all space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Auth Method</span>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-[#00E5FF] border border-cyan-500/20">
              <KeyRound className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl font-bold text-white truncate">
              {profile.hasPassword ? "Password Auth" : "OAuth Provider"}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {profile.hasPassword ? "Secured via Password" : "Social Login Enabled"}
            </p>
          </div>
        </div>

        {/* Telegram Alerts Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-slate-700/80 transition-all space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Telegram Alerts</span>
            <div className={`p-2.5 rounded-xl border ${profile.telegramChatId ? "bg-sky-500/10 text-sky-400 border-sky-500/20" : "bg-slate-800/60 text-slate-500 border-slate-700/50"}`}>
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl font-bold text-white flex items-center gap-2">
              {profile.telegramChatId ? (
                <span className="text-sky-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4.5 h-4.5" /> Connected
                </span>
              ) : (
                <span className="text-slate-400 flex items-center gap-1.5">
                  <XCircle className="w-4.5 h-4.5 text-slate-500" /> Disconnected
                </span>
              )}
            </p>
            <p className="text-xs text-slate-400 mt-1 truncate">
              {profile.telegramChatId ? `ID: ${profile.telegramChatId}` : "No alert bot linked"}
            </p>
          </div>
        </div>

        {/* Joined Date Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-slate-700/80 transition-all space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Member Since</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl font-bold text-white truncate">
              {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </p>
            <p className="text-xs text-slate-400 mt-1">Account Creation Date</p>
          </div>
        </div>
      </div>

      {/* 3. Main Details Section (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal & Account Information */}
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-8 shadow-xl">
          <div className="flex items-center gap-4 pb-5 border-b border-slate-800/80">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[#00E5FF]">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Account Information</h3>
              <p className="text-xs text-slate-400">Personal metadata and account details</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="p-5 sm:px-6 sm:py-5 rounded-2xl bg-slate-950/60 border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</span>
              <span className="text-sm font-medium text-white">{profile.name || "Not provided"}</span>
            </div>

            <div className="p-5 sm:px-6 sm:py-5 rounded-2xl bg-slate-950/60 border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</span>
              <span className="text-sm font-medium text-white font-mono">{profile.email}</span>
            </div>

            <div className="p-5 sm:px-6 sm:py-5 rounded-2xl bg-slate-950/60 border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Account ID</span>
              <span className="text-xs font-mono text-[#00E5FF] bg-cyan-950/40 px-3 py-1.5 rounded-lg border border-cyan-800/40 truncate max-w-full">
                {profile.id}
              </span>
            </div>
          </div>
        </div>

        {/* Telegram Notifications & Security Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-8 shadow-xl">
          <div className="flex items-center gap-4 pb-5 border-b border-slate-800/80">
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Telegram & Security</h3>
              <p className="text-xs text-slate-400">Notifications integration & access status</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="p-5 sm:px-6 sm:py-6 rounded-2xl bg-slate-950/60 border border-slate-800/60 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Telegram Chat ID</span>
                {profile.telegramChatId ? (
                  <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 text-xs font-mono">
                    {profile.telegramChatId}
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-md bg-slate-900 text-slate-500 text-xs font-medium">
                    Not configured
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                When a monitor changes status (e.g. goes DOWN or recovers UP), instant alert dispatches will be pushed to your configured Telegram Chat ID.
              </p>
            </div>

            <div className="p-5 sm:px-6 sm:py-5 rounded-2xl bg-slate-950/60 border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password Protection</span>
              <span className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                {profile.hasPassword ? "Custom Password Set" : "OAuth Managed Account"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Timestamps & Metadata Card (Full Width) */}
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-8 shadow-xl">
        <div className="flex items-center gap-4 pb-5 border-b border-slate-800/80">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Account Timestamps</h3>
            <p className="text-xs text-slate-400">Creation and modification history</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-5 sm:px-6 sm:py-5 rounded-2xl bg-slate-950/60 border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Created At</span>
            <span className="text-xs text-slate-200 font-mono font-medium">{formatDate(profile.createdAt)}</span>
          </div>

          <div className="p-5 sm:px-6 sm:py-5 rounded-2xl bg-slate-950/60 border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Updated</span>
            <span className="text-xs text-slate-200 font-mono font-medium">{formatDate(profile.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}