"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Activity01Icon as Activity, CheckmarkCircle02Icon as CheckCircle2, Clock01Icon as Clock, Copy01Icon as Copy, LinkSquare01Icon as ExternalLink, GlobeIcon as Globe, Loading01Icon as Loader2, RefreshIcon as RefreshCw, CancelCircleIcon as XCircle } from "hugeicons-react";

interface Monitor {
  id: number;
  name: string;
  url: string;
  status: string;
  uptimePercent: number;
  responseTime: number;
  lastChecked: string | null;
  interval: number;
}

interface StatusData {
  user: { id: string; name: string | null };
  monitors: Monitor[];
}

export function DashboardStatus() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard/status");
    }
  }, [status, router]);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/status");
      if (!res.ok) {
        if (res.status === 401) { router.push("/login"); return; }
        throw new Error("Failed to fetch");
      }
      setData(await res.json());
    } catch {
      toast.error("Failed to load status data.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (status === "authenticated") fetchStatus();
  }, [status, fetchStatus]);

  const publicUrl = typeof window !== "undefined" && session?.user?.id
    ? `${window.location.origin}/status/${session.user.id}`
    : "";

  const copyLink = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#EF4444]" />
      </div>
    );
  }

  const monitors = data?.monitors ?? [];
  const allUp = monitors.every((m) => m.status === "UP");
  const anyDown = monitors.some((m) => m.status === "DOWN");

  return (
    <div className="min-h-screen bg-[#121212] text-slate-100 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Globe className="w-6 h-6 text-[#EF4444]" />
            Your Status Page
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Share this public URL so others can view your service health — no login required.
          </p>
        </div>

        {/* Public URL Share Card */}
        <div className="glass-panel rounded-2xl border border-[#EF4444]/30 p-4 sm:p-5 bg-[#EF4444]/5">
          <p className="text-xs font-semibold text-[#EF4444] uppercase tracking-wider mb-3">
            Your Public Status URL
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm text-slate-200 bg-black/40 rounded-xl px-3 py-2.5 truncate border border-slate-800 font-mono">
              {publicUrl || "Loading..."}
            </code>
            <button
              onClick={copyLink}
              className="p-2.5 rounded-xl bg-[#EF4444] hover:bg-red-500 text-white transition-colors cursor-pointer flex-shrink-0"
              title="Copy link"
            >
              <Copy className="w-4 h-4" />
            </button>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors flex-shrink-0"
              title="Open status page"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          {copied && (
            <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Copied!
            </p>
          )}
        </div>

        {/* Overall System Status */}
        <div
          className={`glass-panel rounded-2xl border p-5 flex items-center gap-4 ${
            anyDown
              ? "border-rose-500/40 bg-rose-500/5"
              : "border-emerald-500/30 bg-emerald-500/5"
          }`}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
              anyDown ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"
            }`}
          >
            {anyDown ? <XCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
          </div>
          <div>
            <p
              className={`text-lg font-extrabold font-mono ${
                anyDown ? "text-rose-400" : "text-emerald-400"
              }`}
            >
              {anyDown ? "PARTIAL OUTAGE" : allUp ? "ALL SYSTEMS OPERATIONAL" : "MONITORING..."}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {monitors.length} service{monitors.length !== 1 ? "s" : ""} monitored ·{" "}
              {monitors.filter((m) => m.status === "UP").length} online ·{" "}
              {monitors.filter((m) => m.status === "DOWN").length} down
            </p>
          </div>
          <button
            onClick={fetchStatus}
            className="ml-auto p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Monitor List Preview */}
        {monitors.length === 0 ? (
          <div className="glass-panel rounded-2xl border border-slate-800 p-12 text-center space-y-3">
            <Globe className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-500">No active monitors to display.</p>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800/80">
              <h2 className="text-sm font-bold text-white">Live Status Preview</h2>
              <p className="text-xs text-slate-500 mt-0.5">This is a preview of what visitors will see</p>
            </div>
            <div className="divide-y divide-slate-800/60">
              {monitors.map((monitor) => {
                const isUp = monitor.status === "UP";
                const isDown = monitor.status === "DOWN";
                return (
                  <div
                    key={monitor.id}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-slate-800/20 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-200 truncate">
                          {monitor.name}
                        </span>
                        <a
                          href={monitor.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-slate-300 flex-shrink-0"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-[11px] font-mono text-slate-500">
                        <span className="flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          {monitor.uptimePercent?.toFixed(2) ?? "100.00"}% uptime
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {monitor.responseTime ?? 0}ms
                        </span>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border flex-shrink-0 ${
                        isUp
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : isDown
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                          : "bg-slate-500/10 text-slate-400 border-slate-500/30"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isUp
                            ? "bg-emerald-400 animate-ping"
                            : isDown
                            ? "bg-rose-500"
                            : "bg-slate-400 animate-pulse"
                        }`}
                      />
                      {isUp ? "ONLINE" : isDown ? "OFFLINE" : "PENDING"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
