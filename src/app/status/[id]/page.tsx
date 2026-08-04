"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Globe,
  Loader2,
  XCircle,
} from "lucide-react";

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

export default function PublicStatusPage() {
  const params = useParams();
  const id = params.id as string; // Changed from userId to id

  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/status/${id}`);
        if (res.status === 404) { setNotFound(true); return; }
        if (!res.ok) throw new Error("Failed to fetch");
        setData(await res.json());
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#DC2626]" />
          <span className="text-xs text-slate-400 font-mono">Loading status...</span>
        </div>
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-center px-4">
        <div className="space-y-4">
          <Globe className="w-12 h-12 text-slate-600 mx-auto" />
          <h1 className="text-2xl font-bold text-white">Status Page Not Found</h1>
          <p className="text-slate-400 text-sm">This status page does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const { user, monitors, recentIncidents } = data;
  const allUp = monitors.every((m) => m.status === "UP");
  const anyDown = monitors.some((m) => m.status === "DOWN");
  const ownerName = user.name ?? "SpiderNode User";

  return (
    <div className="text-slate-100">
      {/* Top nav bar (only if we want an extra header, but since this is in commonLayout, the main Navbar is already there. So let's just make it a clean header inside the content) */}
      <div className="border-b border-slate-800 bg-black/40 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-black border border-[#DC2626]/50 flex items-center justify-center">
              <Activity className="w-4 h-4 text-[#DC2626]" />
            </div>
            <span className="font-bold text-white text-sm">SpiderNode</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">{ownerName}&apos;s Status Page</span>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-8 min-h-[80vh]">

        {/* Overall Status Banner */}
        <div
          className={`rounded-2xl border p-6 text-center ${
            anyDown
              ? "border-rose-500/40 bg-rose-500/5"
              : "border-emerald-500/30 bg-emerald-500/5"
          }`}
        >
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              anyDown ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"
            }`}
          >
            {anyDown ? <XCircle className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
          </div>
          <h1
            className={`text-2xl font-extrabold font-mono mb-1 ${
              anyDown ? "text-rose-400" : "text-emerald-400"
            }`}
          >
            {anyDown
              ? "PARTIAL OUTAGE"
              : allUp
              ? "ALL SYSTEMS OPERATIONAL"
              : "MONITORING..."}
          </h1>
          <p className="text-sm text-slate-400">
            {monitors.length} service{monitors.length !== 1 ? "s" : ""} monitored ·{" "}
            {monitors.filter((m) => m.status === "UP").length} online ·{" "}
            {monitors.filter((m) => m.status === "DOWN").length} down
          </p>
          <p className="text-[11px] text-slate-600 mt-3 font-mono">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>

        {/* Active Incidents */}
        {recentIncidents.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Active Incidents
            </h2>
            {recentIncidents.map((incident) => (
              <div
                key={incident.id}
                className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 flex items-start gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-rose-300">{incident.monitor.name} is down</p>
                  <p className="text-xs text-slate-400 mt-0.5">{incident.description || "Service is unreachable."}</p>
                  <p className="text-[11px] text-slate-500 mt-1 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Since {new Date(incident.startedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Services */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-500" />
            Services
          </h2>
          {monitors.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 p-8 text-center text-slate-500 text-sm">
              No services are currently being monitored.
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800/60">
              {monitors.map((monitor) => {
                const isUp = monitor.status === "UP";
                const isDown = monitor.status === "DOWN";
                return (
                  <div
                    key={monitor.id}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 bg-slate-900/30 hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-100 truncate">
                          {monitor.name}
                        </span>
                        <a
                          href={monitor.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-600 hover:text-slate-400"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-[11px] font-mono text-slate-500">
                        <span className="flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          {monitor.uptimePercent?.toFixed(2) ?? "100.00"}%
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {monitor.responseTime ?? 0}ms
                        </span>
                        {monitor.lastChecked && (
                          <span>
                            checked {new Date(monitor.lastChecked).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border flex-shrink-0 ${
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
                      {isUp ? "Operational" : isDown ? "Down" : "Pending"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-600 font-mono pb-4">
          Powered by{" "}
          <span className="text-[#DC2626] font-bold">SpiderNode</span> — Real-time Uptime Monitoring
        </div>
      </main>
    </div>
  );
}
