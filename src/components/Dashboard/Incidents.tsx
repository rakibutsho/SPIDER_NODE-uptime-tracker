"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Clock01Icon as Clock,
  Loading01Icon as Loader2,
  RefreshIcon as RefreshCw,
  LinkSquare01Icon as ExternalLink,
} from "hugeicons-react";
import Link from "next/link";

interface Monitor {
  id: number;
  name: string;
  url: string;
  status: string;
}

interface Incident {
  id: string;
  status: string;
  description: string | null;
  startedAt: string;
  resolvedAt: string | null;
  monitor: Monitor;
}

export function Incidents() {
  const { status } = useSession();
  const router = useRouter();

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard/incidents");
    }
  }, [status, router]);

  const fetchIncidents = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      try {
        const res = await fetch("/api/incidents");
        if (!res.ok) {
          if (res.status === 401) {
            router.push("/login");
            return;
          }
          throw new Error("Failed to fetch incidents");
        }
        const data = await res.json();
        setIncidents(data.incidents || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load incidents.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [router],
  );

  useEffect(() => {
    if (status === "authenticated") {
      fetchIncidents();
    }
  }, [status, fetchIncidents]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#0C0D0E] flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#EF4444]" />
          <span className="text-xs text-[#8E929B] uppercase tracking-widest">
            Loading Incident Stream...
          </span>
        </div>
      </div>
    );
  }

  const ongoingIncidents = incidents.filter((i) => i.status === "ONGOING");
  const resolvedIncidents = incidents.filter((i) => i.status === "RESOLVED");

  const formatDuration = (start: string, end: string | null) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}M`;
    const diffHrs = Math.floor(diffMins / 60);
    const remainMins = diffMins % 60;
    if (diffHrs < 24) return `${diffHrs}H ${remainMins}M`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays}D ${diffHrs % 24}H`;
  };

  return (
    <div className="min-h-screen bg-[#0C0D0E] text-[#F4F4F5] p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="border border-white/15 bg-[#121316] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-none text-left">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-[#EF4444]" />
              <span className="swiss-kicker">01 // INCIDENT AUDIT STREAM</span>
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">
              System Outage Log
            </h1>
            <p className="text-xs text-[#8E929B] font-mono mt-1">
              RECORDED SERVICE FAILURES AND RESOLUTION METRICS
            </p>
          </div>
          <button
            onClick={() => fetchIncidents(true)}
            disabled={refreshing}
            className="p-2.5 border border-white/15 hover:border-white/40 text-[#8E929B] hover:text-white transition-colors cursor-pointer rounded-none self-start sm:self-auto"
            title="Refresh Incident Stream"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#EF4444]" : ""}`}
            />
          </button>
        </div>

        {/* Connected Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 border border-white/15 bg-[#121316] divide-y sm:divide-y-0 sm:divide-x divide-white/15 rounded-none text-left">
          <div className="p-6">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E929B] mb-2">
              LIFETIME INCIDENTS
            </div>
            <div className="text-4xl font-black font-mono text-white tracking-tight">
              {incidents.length}
            </div>
            <p className="text-[10px] font-mono text-[#8E929B] uppercase tracking-wider mt-2">
              ALL MONITORS COMBINED
            </p>
          </div>

          <div className="p-6">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E929B] mb-2">
              ACTIVE OUTAGES
            </div>
            <div
              className={`text-4xl font-black font-mono tracking-tight ${
                ongoingIncidents.length > 0 ? "text-[#EF4444]" : "text-white"
              }`}
            >
              {ongoingIncidents.length}
            </div>
            <p className="text-[10px] font-mono text-[#8E929B] uppercase tracking-wider mt-2">
              REQUIRING RESOLUTION
            </p>
          </div>

          <div className="p-6">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E929B] mb-2">
              RECOVERED SERVICES
            </div>
            <div className="text-4xl font-black font-mono text-white tracking-tight">
              {resolvedIncidents.length}
            </div>
            <p className="text-[10px] font-mono text-[#8E929B] uppercase tracking-wider mt-2">
              NORMAL OPERATING STATE
            </p>
          </div>
        </div>

        {/* Active Alert Banner */}
        {ongoingIncidents.length > 0 && (
          <div className="border border-[#EF4444] bg-[#EF4444]/10 p-5 flex items-center justify-between gap-4 rounded-none text-left">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-[#EF4444]" />
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  CRITICAL: {ongoingIncidents.length} ACTIVE OUTAGE
                  {ongoingIncidents.length > 1 ? "S" : ""} DETECTED
                </span>
                <p className="text-xs text-[#A0A4AD] mt-0.5">
                  Notification payloads have been dispatched via configured
                  Telegram and webhook channels.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-widest bg-[#EF4444] text-white rounded-none">
              ALERTING ACTIVE
            </span>
          </div>
        )}

        {/* Incident Table */}
        <div className="border border-white/15 bg-[#121316] rounded-none text-left">
          <div className="p-6 border-b border-white/15 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-[#EF4444]" />
                <span className="swiss-kicker">02 // HISTORIC TIMELINE</span>
              </div>
              <h2 className="text-lg font-black uppercase tracking-tight text-white">
                Recorded Outage Events
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#8E929B] uppercase tracking-wider">
              {incidents.length} TOTAL ENTRIES
            </span>
          </div>

          {incidents.length === 0 ? (
            <div className="p-16 text-center space-y-3 font-mono">
              <div className="text-xs font-bold uppercase tracking-widest text-white">
                ZERO OUTAGES RECORDED
              </div>
              <p className="text-xs text-[#8E929B] max-w-sm mx-auto">
                All endpoints are currently healthy with 100% operational
                availability.
              </p>
              <Link
                href="/dashboard"
                className="inline-block mt-4 px-6 py-2.5 bg-[#EF4444] text-white text-xs font-bold uppercase tracking-[0.18em] rounded-none hover:bg-[#DC2626] transition-colors"
              >
                RETURN TO DASHBOARD
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/10 font-mono text-xs">
              {incidents.map((incident) => {
                const isOngoing = incident.status === "ONGOING";

                return (
                  <div
                    key={incident.id}
                    className="p-6 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Link
                            href={`/dashboard/monitor/${incident.monitor.id}`}
                            className="font-bold text-sm text-white hover:text-[#EF4444] transition-colors uppercase font-sans"
                          >
                            {incident.monitor.name}
                          </Link>
                          <a
                            href={incident.monitor.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#8E929B] hover:text-white inline-flex items-center gap-1 text-[11px]"
                          >
                            <span>{incident.monitor.url}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        <p className="text-xs text-[#A0A4AD]">
                          {incident.description ||
                            "HTTP Timeout or Bad Gateway Response"}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[11px] text-[#8E929B] pt-1">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            STARTED:{" "}
                            {new Date(incident.startedAt).toLocaleString()}
                          </span>
                          {!isOngoing && incident.resolvedAt && (
                            <span className="text-white">
                              RESOLVED:{" "}
                              {new Date(incident.resolvedAt).toLocaleString()}
                            </span>
                          )}
                          <span className="text-[#EF4444] font-bold">
                            DURATION:{" "}
                            {formatDuration(
                              incident.startedAt,
                              incident.resolvedAt,
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Status Stamp */}
                      <span
                        className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-none flex-shrink-0 self-start ${
                          isOngoing
                            ? "bg-[#EF4444] text-white border border-[#EF4444]"
                            : "bg-white/10 text-white border border-white/20"
                        }`}
                      >
                        {isOngoing ? "ACTIVE OUTAGE" : "RESOLVED"}
                      </span>
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
