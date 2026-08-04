"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
  ServerCrash,
  ShieldCheck,
  XCircle,
  Activity,
  ExternalLink,
} from "lucide-react";
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

  const fetchIncidents = useCallback(async (isRefresh = false) => {
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
  }, [router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchIncidents();
    }
  }, [status, fetchIncidents]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#090D16] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#DC2626]" />
          <span className="text-xs text-slate-400 font-mono">Loading Incidents...</span>
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
    if (diffMins < 60) return `${diffMins}m`;
    const diffHrs = Math.floor(diffMins / 60);
    const remainMins = diffMins % 60;
    if (diffHrs < 24) return `${diffHrs}h ${remainMins}m`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays}d ${diffHrs % 24}h`;
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <ServerCrash className="w-6 h-6 text-[#DC2626]" />
              Incident Log
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Downtime events and resolutions across all your monitors
            </p>
          </div>
          <button
            onClick={() => fetchIncidents(true)}
            disabled={refreshing}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-[#DC2626]" : ""}`} />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono">TOTAL INCIDENTS</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-white">{incidents.length}</div>
            <p className="text-[11px] text-slate-500 mt-1">All time</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-rose-500/20">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono">ACTIVE NOW</span>
              <XCircle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-rose-400">
              {ongoingIncidents.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Ongoing outages</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono">RESOLVED</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-emerald-400">
              {resolvedIncidents.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Successfully recovered</p>
          </div>
        </div>

        {/* Active Incidents Alert Banner */}
        {ongoingIncidents.length > 0 && (
          <div className="glass-panel rounded-2xl border border-rose-500/40 p-4 flex items-center gap-3 bg-rose-500/5">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping flex-shrink-0" />
            <p className="text-sm text-rose-300 font-medium">
              <span className="font-bold">{ongoingIncidents.length} active incident{ongoingIncidents.length > 1 ? "s" : ""}</span>
              {" "}— your team has been notified via Telegram if configured.
            </p>
          </div>
        )}

        {/* Incidents List */}
        {incidents.length === 0 ? (
          <div className="glass-panel rounded-2xl border border-slate-800 p-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">All Clear!</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              No incidents recorded yet. Your monitors are healthy and running smoothly.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-red-400 text-white text-xs font-bold transition-all"
            >
              <Activity className="w-3.5 h-3.5" />
              View Monitors
            </Link>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-800/80">
              <h2 className="text-base font-bold text-white">Incident Timeline</h2>
            </div>
            <div className="divide-y divide-slate-800/60">
              {incidents.map((incident) => {
                const isOngoing = incident.status === "ONGOING";
                return (
                  <div
                    key={incident.id}
                    className="p-4 sm:p-6 hover:bg-slate-800/20 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 min-w-0">
                        <div
                          className={`mt-0.5 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isOngoing
                              ? "bg-rose-500/10 text-rose-400"
                              : "bg-emerald-500/10 text-emerald-400"
                          }`}
                        >
                          {isOngoing ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          {/* Monitor name + link */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link
                              href={`/dashboard/monitor/${incident.monitor.id}`}
                              className="text-sm font-bold text-slate-200 hover:text-[#DC2626] transition-colors truncate"
                            >
                              {incident.monitor.name}
                            </Link>
                            <a
                              href={incident.monitor.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>

                          <p className="text-xs text-slate-400 mt-1">
                            {incident.description || "Connection timeout or invalid status code."}
                          </p>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] font-mono text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-slate-600" />
                              Started: {new Date(incident.startedAt).toLocaleString()}
                            </span>
                            {!isOngoing && incident.resolvedAt && (
                              <span className="flex items-center gap-1.5 text-emerald-500/80">
                                <CheckCircle2 className="w-3 h-3" />
                                Resolved: {new Date(incident.resolvedAt).toLocaleString()}
                              </span>
                            )}
                            <span className="flex items-center gap-1.5 text-amber-500/80">
                              <AlertTriangle className="w-3 h-3" />
                              Duration: {formatDuration(incident.startedAt, incident.resolvedAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status badge */}
                      <span
                        className={`px-2.5 py-1 rounded border text-[10px] font-bold tracking-wider flex-shrink-0 ${
                          isOngoing
                            ? "bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse"
                            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        }`}
                      >
                        {isOngoing ? "ACTIVE" : "RESOLVED"}
                      </span>
                    </div>
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
