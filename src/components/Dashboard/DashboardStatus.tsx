"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Activity01Icon as Activity,
  Clock01Icon as Clock,
  Copy01Icon as Copy,
  LinkSquare01Icon as ExternalLink,
  Loading01Icon as Loader2,
  RefreshIcon as RefreshCw,
  Tick01Icon as Check,
} from "hugeicons-react";

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
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch");
      }
      setData(await res.json());
    } catch {
      toast.error("Failed to load status telemetry data.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (status === "authenticated") fetchStatus();
  }, [status, fetchStatus]);

  const publicUrl =
    typeof window !== "undefined" && session?.user?.id
      ? `${window.location.origin}/status/${session.user.id}`
      : "";

  const copyLink = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success("Public status URL copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#EF4444]" />
      </div>
    );
  }

  const monitors = data?.monitors ?? [];
  const allUp = monitors.length > 0 && monitors.every((m) => m.status === "UP");
  const anyDown = monitors.some((m) => m.status === "DOWN");

  return (
    <div className="w-full space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="border border-white/15 bg-[#121316] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#EF4444]" />
              <span className="swiss-kicker">01 // TELEMETRY BROADCAST</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
              Public Status Board
            </h1>
            <p className="text-xs font-mono text-[#8E929B]">
              PUBLIC ACCESS ENDPOINT FOR EXTERNAL CONSUMERS AND SLA VERIFICATION
            </p>
          </div>
          <button
            onClick={fetchStatus}
            className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 bg-transparent hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider transition-colors rounded-none cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Board</span>
          </button>
        </div>
      </div>

      {/* Public URL Box */}
      <div className="border border-white/15 bg-[#121316] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="swiss-kicker">02 // PUBLIC ROUTE SPECIFICATION</div>
          {copied && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3" /> COPIED TO CLIPBOARD
            </span>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-stretch gap-2">
          <div className="flex-1 bg-[#0C0D0E] border border-white/15 px-4 py-2.5 font-mono text-xs text-white truncate select-all flex items-center">
            {publicUrl || "GENERATING_PUBLIC_ROUTE..."}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyLink}
              className="px-4 py-2.5 bg-[#EF4444] text-white hover:bg-white hover:text-black font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 rounded-none cursor-pointer shrink-0"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy URL</span>
            </button>
            {publicUrl && (
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 border border-white/20 bg-transparent text-white hover:bg-white/10 font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-2 rounded-none shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open View</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Connected 3-Metric Health Strip */}
      <div className="border border-white/15 bg-[#121316] divide-y sm:divide-y-0 sm:divide-x divide-white/15 grid grid-cols-1 sm:grid-cols-3">
        <div className="p-5 space-y-2">
          <div className="swiss-kicker">03 // SYSTEM STATE</div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 ${
                anyDown
                  ? "bg-[#EF4444]"
                  : allUp
                    ? "bg-emerald-500"
                    : "bg-amber-400"
              }`}
            />
            <span
              className={`font-mono text-base font-bold uppercase tracking-wider ${
                anyDown
                  ? "text-[#EF4444]"
                  : allUp
                    ? "text-emerald-400"
                    : "text-amber-400"
              }`}
            >
              {anyDown
                ? "[PARTIAL_OUTAGE]"
                : allUp
                  ? "[ALL_SYSTEMS_NORMAL]"
                  : "[STANDBY_MODE]"}
            </span>
          </div>
          <p className="text-[11px] font-mono text-[#8E929B]">
            CURRENT FLEET INCIDENT ASSESSMENT
          </p>
        </div>

        <div className="p-5 space-y-2">
          <div className="swiss-kicker">04 // ACTIVE ENDPOINTS</div>
          <div className="font-mono text-2xl font-bold text-white tracking-tight">
            {monitors.length.toString().padStart(2, "0")}
          </div>
          <p className="text-[11px] font-mono text-[#8E929B]">
            TOTAL MONITORED TARGET NODES
          </p>
        </div>

        <div className="p-5 space-y-2">
          <div className="swiss-kicker">05 // HEALTH DISTRIBUTION</div>
          <div className="font-mono text-sm font-bold text-white uppercase tracking-wider flex items-center gap-4">
            <span className="text-emerald-400">
              {monitors.filter((m) => m.status === "UP").length} ONLINE
            </span>
            <span className="text-[#8E929B]">/</span>
            <span className={anyDown ? "text-[#EF4444]" : "text-[#8E929B]"}>
              {monitors.filter((m) => m.status === "DOWN").length} OFFLINE
            </span>
          </div>
          <p className="text-[11px] font-mono text-[#8E929B]">
            NODE INTEGRITY BREAKDOWN
          </p>
        </div>
      </div>

      {/* Monitor List Preview */}
      <div className="border border-white/15 bg-[#121316]">
        <div className="p-5 border-b border-white/15 flex items-center justify-between">
          <div className="space-y-1">
            <div className="swiss-kicker">06 // PUBLIC VIEW DATA FEED</div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Target Nodes Telemetry Preview
            </h2>
          </div>
          <span className="text-[10px] font-mono uppercase text-[#8E929B]">
            {monitors.length} RECORDS
          </span>
        </div>

        {monitors.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <p className="text-xs font-mono text-[#8E929B] uppercase tracking-wider">
              [NO CONFIGURED MONITORS DETECTED]
            </p>
            <p className="text-[11px] font-mono text-[#8E929B]">
              Add monitor endpoints in the telemetry console to populate this
              status board.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {monitors.map((monitor, idx) => {
              const isUp = monitor.status === "UP";
              const isDown = monitor.status === "DOWN";

              return (
                <div
                  key={monitor.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-[#8E929B]">
                        {(idx + 1).toString().padStart(2, "0")}
                      </span>
                      <span className="font-bold text-sm text-white uppercase tracking-tight truncate">
                        {monitor.name}
                      </span>
                      <a
                        href={monitor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/40 hover:text-white transition-colors shrink-0"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#8E929B]">
                      <span className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-white/40" />
                        UPTIME: {monitor.uptimePercent?.toFixed(2) ?? "100.00"}%
                      </span>
                      <span className="text-white/20">|</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-white/40" />
                        LATENCY: {monitor.responseTime ?? 0}ms
                      </span>
                    </div>
                  </div>

                  <div>
                    <span
                      className={`inline-block font-mono text-xs px-2.5 py-1 border font-bold uppercase tracking-wider rounded-none ${
                        isUp
                          ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-400"
                          : isDown
                            ? "border-red-500/40 bg-red-950/20 text-[#EF4444]"
                            : "border-white/20 bg-white/5 text-[#8E929B]"
                      }`}
                    >
                      {isUp ? "[ONLINE]" : isDown ? "[OFFLINE]" : "[PENDING]"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
