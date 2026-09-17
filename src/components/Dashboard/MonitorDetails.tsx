"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft01Icon as ArrowLeft,
  Clock01Icon as Clock,
  GlobeIcon as Globe,
  Loading01Icon as Loader2,
} from "hugeicons-react";
import Link from "next/link";

interface Ping {
  id: string;
  status: string;
  responseTime: number;
  createdAt: string;
}

interface Incident {
  id: string;
  status: string;
  description: string;
  startedAt: string;
  resolvedAt: string | null;
}

interface MonitorDetailsData {
  id: number;
  name: string;
  url: string;
  status: string;
  lastChecked: string | null;
  createdAt: string;
  isActive: boolean;
  interval: number;
  responseTime: number;
  uptimePercent: number;
  pings: Ping[];
  incidents: Incident[];
}

export function MonitorDetails() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [monitor, setMonitor] = useState<MonitorDetailsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Protect route
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard/monitor/" + id);
    }
  }, [status, router, id]);

  const fetchDetails = useCallback(async () => {
    try {
      const res = await fetch(`/api/monitors/${id}/details`);
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        if (res.status === 404) {
          toast.error("Monitor not found");
          router.push("/dashboard");
          return;
        }
        throw new Error("Failed to fetch monitor details");
      }
      const data = await res.json();
      setMonitor(data.monitor);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load details.");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (status === "authenticated" && id) {
      fetchDetails();

      const interval = setInterval(() => {
        fetchDetails();
      }, 30000); // 30s refresh

      return () => clearInterval(interval);
    }
  }, [status, id, fetchDetails]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#0C0D0E] flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#EF4444]" />
          <span className="text-xs text-[#8E929B] uppercase tracking-widest">
            Awaiting Telemetry Stream...
          </span>
        </div>
      </div>
    );
  }

  if (!monitor) return null;

  const chartPings = [...monitor.pings].reverse().slice(-50);
  const isUp = monitor.isActive && monitor.status === "UP";
  const isDown = monitor.isActive && monitor.status === "DOWN";

  return (
    <div className="min-h-screen bg-[#0C0D0E] text-[#F4F4F5] p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Bar */}
        <div className="border border-white/15 bg-[#121316] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-none text-left">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-3 border border-white/15 text-[#8E929B] hover:text-white hover:border-white/40 transition-colors cursor-pointer rounded-none"
              title="Return to Console"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-[#EF4444]" />
                <span className="swiss-kicker">
                  01 // TARGET TELEMETRY NODE
                </span>
              </div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-3">
                {monitor.name}
                <span
                  className={`px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-none ${
                    isUp
                      ? "bg-white/10 text-white border border-white/20"
                      : isDown
                        ? "bg-[#EF4444] text-white border border-[#EF4444]"
                        : "bg-white/5 text-[#8E929B] border border-white/10"
                  }`}
                >
                  {!monitor.isActive ? "PAUSED" : monitor.status}
                </span>
              </h1>
              <a
                href={monitor.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#8E929B] hover:text-white flex items-center gap-1.5 mt-1 font-mono transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{monitor.url} ↗</span>
              </a>
            </div>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs border-t sm:border-t-0 sm:border-l border-white/15 pt-4 sm:pt-0 sm:pl-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8E929B] tracking-wider block">
                POLLING CYCLE
              </span>
              <span className="text-white font-bold">
                {monitor.interval} MIN
              </span>
            </div>
            <div className="w-px h-8 bg-white/15" />
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8E929B] tracking-wider block">
                LAST PROBE
              </span>
              <span className="text-white font-bold">
                {monitor.lastChecked
                  ? new Date(monitor.lastChecked).toLocaleTimeString()
                  : "NEVER"}
              </span>
            </div>
          </div>
        </div>

        {/* Swiss Connected Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 border border-white/15 bg-[#121316] divide-y sm:divide-y-0 sm:divide-x divide-white/15 rounded-none text-left">
          <div className="p-6">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E929B] mb-2">
              OVERALL UPTIME
            </div>
            <div
              className={`text-4xl font-black font-mono tracking-tight ${
                monitor.uptimePercent < 95 ? "text-[#EF4444]" : "text-white"
              }`}
            >
              {monitor.uptimePercent ? monitor.uptimePercent.toFixed(2) : 100}%
            </div>
            <p className="text-[10px] font-mono text-[#8E929B] uppercase tracking-wider mt-2">
              ROLLING 30-DAY WINDOW
            </p>
          </div>

          <div className="p-6">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E929B] mb-2">
              AVG RESPONSE TIME
            </div>
            <div className="text-4xl font-black font-mono text-[#EF4444] tracking-tight">
              {monitor.responseTime || 0}
              <span className="text-sm font-normal text-[#8E929B] ml-1">
                MS
              </span>
            </div>
            <p className="text-[10px] font-mono text-[#8E929B] uppercase tracking-wider mt-2">
              LAST RECORDED PROBE
            </p>
          </div>

          <div className="p-6">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E929B] mb-2">
              RECORDED INCIDENTS
            </div>
            <div className="text-4xl font-black font-mono text-white tracking-tight">
              {monitor.incidents.length}
            </div>
            <p className="text-[10px] font-mono text-[#8E929B] uppercase tracking-wider mt-2">
              LIFETIME FAILURES
            </p>
          </div>
        </div>

        {/* Response Time Telemetry Strip (Bar visualization) */}
        <div className="border border-white/15 bg-[#121316] p-6 text-left rounded-none">
          <div className="flex items-baseline justify-between mb-6 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-[#EF4444]" />
                <span className="swiss-kicker">
                  02 // HISTORIC RESPONSE TIME
                </span>
              </div>
              <h2 className="text-lg font-black uppercase tracking-tight text-white">
                Last 50 Probe Cycles
              </h2>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E929B]">
              SCALE: 0MS — 1000MS
            </span>
          </div>

          <div className="h-44 w-full flex items-end gap-1 overflow-hidden relative border-b border-white/15 pb-2">
            {chartPings.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-[#8E929B] font-mono text-xs uppercase tracking-widest">
                NO TELEMETRY RECORDED YET
              </div>
            ) : (
              chartPings.map((ping) => {
                const heightPercent = Math.min(
                  100,
                  Math.max(5, (ping.responseTime / 1000) * 100),
                );
                const pingDown = ping.status === "DOWN";

                return (
                  <div
                    key={ping.id}
                    title={`${ping.responseTime}ms at ${new Date(ping.createdAt).toLocaleTimeString()}`}
                    className={`flex-1 min-w-[4px] transition-colors group relative cursor-crosshair rounded-none ${
                      pingDown ? "bg-[#EF4444]" : "bg-white/40 hover:bg-white"
                    }`}
                    style={{ height: `${pingDown ? 10 : heightPercent}%` }}
                  >
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-[#0C0D0E] border border-white/20 text-xs font-mono text-white px-2 py-1 pointer-events-none whitespace-nowrap z-10 rounded-none">
                      {pingDown ? "OFFLINE" : `${ping.responseTime}ms`}
                      <div className="text-[9px] text-[#8E929B] mt-0.5">
                        {new Date(ping.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Incident History Section */}
        <div className="border border-white/15 bg-[#121316] text-left rounded-none">
          <div className="p-6 border-b border-white/15">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-[#EF4444]" />
              <span className="swiss-kicker">03 // EVENT LOG</span>
            </div>
            <h2 className="text-lg font-black uppercase tracking-tight text-white">
              Incident Audit Log
            </h2>
            <p className="text-xs text-[#8E929B] font-mono mt-1">
              HISTORICAL DOWNTIME EVENTS AND DURATION
            </p>
          </div>

          {monitor.incidents.length === 0 ? (
            <div className="p-16 text-center space-y-2">
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-white">
                NO RECORDED OUTAGES
              </div>
              <p className="text-xs text-[#8E929B] font-mono">
                This endpoint has maintained 100% operational availability
                during tracking.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10 font-mono text-xs">
              {monitor.incidents.map((incident) => {
                const isOngoing = incident.status === "ONGOING";

                return (
                  <div
                    key={incident.id}
                    className="p-6 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-none ${
                              isOngoing
                                ? "bg-[#EF4444] text-white border border-[#EF4444]"
                                : "bg-white/10 text-white border border-white/20"
                            }`}
                          >
                            {isOngoing ? "ACTIVE OUTAGE" : "RESOLVED"}
                          </span>
                          <span className="font-bold text-white uppercase">
                            {incident.description ||
                              "HTTP Timeout or Status Code Failure"}
                          </span>
                        </div>
                        <div className="flex items-center gap-6 mt-3 text-[11px] text-[#8E929B]">
                          <span>
                            STARTED:{" "}
                            {new Date(incident.startedAt).toLocaleString()}
                          </span>
                          {!isOngoing && incident.resolvedAt && (
                            <span className="text-white">
                              RESOLVED:{" "}
                              {new Date(incident.resolvedAt).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
