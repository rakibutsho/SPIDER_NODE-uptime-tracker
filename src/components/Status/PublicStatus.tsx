"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import {
  Activity01Icon as Activity,
  Clock01Icon as Clock,
  LinkSquare01Icon as ExternalLink,
  Loading01Icon as Loader2,
  RefreshIcon as RefreshCw,
  Alert01Icon as AlertTriangle,
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

interface Incident {
  id: string;
  status: string;
  description: string | null;
  startedAt: string;
  monitor: { name: string };
}

interface StatusData {
  user: { id: string; name: string | null };
  monitors: Monitor[];
  recentIncidents: Incident[];
}

export function PublicStatus() {
  const params = useParams();
  const id = params?.id as string;

  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/status/${id}`);
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch");
      setData(await res.json());
      setLastRefreshed(new Date());
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-[#0C0D0E] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 font-mono text-xs text-[#8E929B]">
          <Loader2 className="w-8 h-8 animate-spin text-[#EF4444]" />
          <span className="uppercase tracking-widest">
            [ACQUIRING_TELEMETRY_FEED...]
          </span>
        </div>
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="min-h-screen bg-[#0C0D0E] flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-xl border border-white/15 bg-[#121316] p-8 sm:p-12 space-y-6 text-left font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#EF4444]" />
            <span className="swiss-kicker text-[#EF4444]">
              404 // STATUS_PAGE_NOT_FOUND
            </span>
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-white font-sans">
            Target Status Board Unreachable
          </h1>
          <p className="text-xs text-[#8E929B] leading-relaxed">
            The requested status identifier{" "}
            <span className="text-white">/{id}</span> does not correspond to an
            active telemetry broadcast node or has been decommissioned.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-block px-5 py-2.5 bg-[#EF4444] text-white hover:bg-white hover:text-black text-xs font-bold uppercase tracking-wider transition-colors rounded-none"
            >
              Return to SpiderNode Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { user, monitors, recentIncidents } = data;
  const allUp = monitors.length > 0 && monitors.every((m) => m.status === "UP");
  const anyDown = monitors.some((m) => m.status === "DOWN");
  const ownerName = user?.name ?? "SpiderNode Operator";

  return (
    <div className="min-h-screen bg-[#0C0D0E] text-[#ECECED] font-sans antialiased pb-24">
      {/* Brand Topbar */}
      <div className="border-b border-white/15 bg-[#121316]">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 flex items-center justify-center border border-white/20 bg-black/40">
              <Image
                src={logo}
                alt="SpiderNode Logo"
                width={24}
                height={24}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-[0.2em] text-white uppercase leading-none">
                SPIDERNODE
              </span>
              <span className="text-[9px] font-mono tracking-[0.25em] text-[#8E929B] uppercase mt-0.5">
                TELEMETRY NETWORK
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3 font-mono">
            <button
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/15 bg-transparent hover:bg-white/5 text-[#8E929B] hover:text-white text-xs uppercase tracking-wider transition-colors rounded-none cursor-pointer disabled:opacity-50"
              title="Refresh telemetry"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#EF4444]" : ""}`}
              />
              <span className="hidden sm:inline">Sync</span>
            </button>
            <span className="text-xs text-[#8E929B] hidden sm:inline">|</span>
            <span className="text-[11px] text-[#8E929B] uppercase tracking-wider">
              {ownerName}
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 pt-10 space-y-8">
        {/* Section Header */}
        <div className="border-b-2 border-white pb-6 text-left">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 bg-[#EF4444]" />
            <span className="swiss-kicker">
              01 // PUBLIC TELEMETRY BROADCAST
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-[-0.03em] text-white">
            System Status Board
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[#8E929B] mt-2">
            REAL-TIME HEALTH REPORT FOR SERVICES OPERATED BY{" "}
            <span className="text-white font-bold">
              {ownerName.toUpperCase()}
            </span>
          </p>
        </div>

        {/* Global Consensus Banner: Swiss Connected Strip */}
        <div className="border border-white/15 bg-[#121316] divide-y sm:divide-y-0 sm:divide-x divide-white/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 font-mono">
          <div className="p-6 space-y-2">
            <div className="swiss-kicker">01 // CONSENSUS STATE</div>
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 ${
                  anyDown
                    ? "bg-[#EF4444]"
                    : allUp
                      ? "bg-emerald-500"
                      : "bg-amber-400"
                }`}
              />
              <span
                className={`text-base font-bold uppercase tracking-wider ${
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
            <p className="text-[11px] text-[#8E929B]">
              FLEET OPERATIONAL ASSESSMENT
            </p>
          </div>

          <div className="p-6 space-y-2">
            <div className="swiss-kicker">02 // MONITORED NODES</div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {monitors.length.toString().padStart(2, "0")}
            </div>
            <p className="text-[11px] text-[#8E929B]">
              ACTIVE TARGET ENDPOINTS
            </p>
          </div>

          <div className="p-6 space-y-2">
            <div className="swiss-kicker">03 // FLEET HEALTH</div>
            <div className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-3">
              <span className="text-emerald-400">
                {monitors.filter((m) => m.status === "UP").length} ONLINE
              </span>
              <span className="text-[#8E929B]">/</span>
              <span className={anyDown ? "text-[#EF4444]" : "text-[#8E929B]"}>
                {monitors.filter((m) => m.status === "DOWN").length} OFFLINE
              </span>
            </div>
            <p className="text-[11px] text-[#8E929B]">
              NODE INTEGRITY DISTRIBUTION
            </p>
          </div>

          <div className="p-6 space-y-2">
            <div className="swiss-kicker">04 // LAST VERIFIED</div>
            <div className="text-sm font-bold text-white uppercase tracking-wider">
              {lastRefreshed.toLocaleTimeString()}
            </div>
            <p className="text-[11px] text-[#8E929B]">
              SYNCHRONIZATION CADENCE
            </p>
          </div>
        </div>

        {/* Active Incidents Block (If Any) */}
        {recentIncidents.length > 0 && (
          <div className="border border-red-500/40 bg-red-950/10 p-6 sm:p-8 space-y-4 rounded-none text-left">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#EF4444] animate-pulse" />
              <span className="swiss-kicker text-[#EF4444]">
                CRITICAL // ACTIVE INCIDENTS DETECTED
              </span>
            </div>

            <div className="divide-y divide-red-500/20">
              {recentIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="py-4 first:pt-0 last:pb-0 space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="font-bold text-base text-white uppercase tracking-tight">
                      {incident.monitor.name} — Service Interruption
                    </span>
                    <span className="font-mono text-xs text-red-400 border border-red-500/30 px-2 py-0.5 uppercase tracking-wider w-fit">
                      [UNRESOLVED]
                    </span>
                  </div>
                  <p className="text-xs font-mono text-[#8E929B]">
                    {incident.description ||
                      "The target probe failed health check telemetry."}
                  </p>
                  <p className="text-[11px] font-mono text-[#8E929B] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-red-400" />
                    <span>
                      OUTAGE COMMENCED:{" "}
                      {new Date(incident.startedAt).toLocaleString()}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monitored Services Telemetry Table */}
        <div className="border border-white/15 bg-[#121316] rounded-none text-left">
          <div className="p-6 border-b border-white/15 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-[#EF4444]" />
                <span className="swiss-kicker">02 // MONITORED ENDPOINTS</span>
              </div>
              <h2 className="text-lg font-bold uppercase tracking-tight text-white">
                Live Probe Telemetry Feed
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#8E929B] uppercase tracking-wider">
              {monitors.length} NODES CONFIGURED
            </span>
          </div>

          {monitors.length === 0 ? (
            <div className="p-12 text-center space-y-2 font-mono">
              <p className="text-xs uppercase text-[#8E929B] tracking-wider">
                [NO TARGET PROBES REGISTERED]
              </p>
              <p className="text-[11px] text-[#8E929B]">
                The operator has not configured active endpoints on this
                broadcast node.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10 font-mono text-xs">
              {monitors.map((monitor, idx) => {
                const isUp = monitor.status === "UP";
                const isDown = monitor.status === "DOWN";

                return (
                  <div
                    key={monitor.id}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[11px] text-[#8E929B]">
                          {(idx + 1).toString().padStart(2, "0")}
                        </span>
                        <span className="font-bold text-sm text-white uppercase tracking-tight truncate font-sans">
                          {monitor.name}
                        </span>
                        <a
                          href={monitor.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/40 hover:text-white transition-colors shrink-0"
                          title="Open target URL"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#8E929B]">
                        <span className="flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-white/40" />
                          UPTIME:{" "}
                          {monitor.uptimePercent?.toFixed(2) ?? "100.00"}%
                        </span>
                        <span className="text-white/20">|</span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-white/40" />
                          LATENCY: {monitor.responseTime ?? 0}ms
                        </span>
                        {monitor.lastChecked && (
                          <>
                            <span className="text-white/20 hidden md:inline">
                              |
                            </span>
                            <span className="hidden md:inline text-[11px] text-[#8E929B]">
                              CHECKED{" "}
                              {new Date(
                                monitor.lastChecked,
                              ).toLocaleTimeString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <span
                        className={`inline-block px-3 py-1 border font-mono text-xs font-bold uppercase tracking-wider rounded-none ${
                          isUp
                            ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-400"
                            : isDown
                              ? "border-red-500/40 bg-red-950/20 text-[#EF4444]"
                              : "border-white/20 bg-white/5 text-[#8E929B]"
                        }`}
                      >
                        {isUp ? "[ONLINE]" : isDown ? "[OFFLINE]" : "[STANDBY]"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Technical Note */}
        <div className="pt-8 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-[11px] text-[#8E929B] tracking-wider uppercase">
          <span>POWERED BY SPIDERNODE // INFRASTRUCTURE TELEMETRY</span>
          <span>90-DAY ROLLING FLEET SLA: 99.99%</span>
        </div>
      </main>
    </div>
  );
}
