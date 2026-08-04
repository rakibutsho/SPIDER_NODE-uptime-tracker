"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  Activity,
  ArrowLeft,
  Clock,
  Globe,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ServerCrash
} from "lucide-react";
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

interface MonitorDetails {
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

export default function MonitorDetailsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [monitor, setMonitor] = useState<MonitorDetails | null>(null);
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
      <div className="min-h-screen bg-[#090D16] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#DC2626]" />
          <span className="text-xs text-slate-400 font-mono">Loading Monitor Data...</span>
        </div>
      </div>
    );
  }

  if (!monitor) return null;

  // Chart preparation
  // Reverse pings to show oldest to newest (left to right)
  const chartPings = [...monitor.pings].reverse().slice(-50); // Show last 50
  
  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                {monitor.name}
                <span
                  className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                    !monitor.isActive
                      ? "bg-slate-500/10 text-slate-400 border-slate-500/30"
                      : monitor.status === "UP"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : monitor.status === "DOWN"
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      !monitor.isActive
                        ? "bg-slate-500"
                        : monitor.status === "UP"
                        ? "bg-emerald-400 animate-ping"
                        : "bg-rose-500"
                    }`}
                  />
                  {!monitor.isActive ? "PAUSED" : monitor.status}
                </span>
              </h1>
              <a 
                href={monitor.url} 
                target="_blank" 
                rel="noreferrer"
                className="text-sm text-slate-400 hover:text-[#DC2626] flex items-center gap-1 mt-1 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                {monitor.url}
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-slate-400 bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Check Interval</span>
              <span className="font-mono text-white">{monitor.interval} minutes</span>
            </div>
            <div className="w-px h-8 bg-slate-800"></div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Last Checked</span>
              <span className="font-mono text-white">
                {monitor.lastChecked ? new Date(monitor.lastChecked).toLocaleTimeString() : "Never"}
              </span>
            </div>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono">OVERALL UPTIME</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className={`text-3xl font-extrabold font-mono ${monitor.uptimePercent < 95 ? "text-rose-400" : "text-emerald-400"}`}>
              {monitor.uptimePercent ? monitor.uptimePercent.toFixed(2) : 100}%
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono">AVG RESPONSE TIME</span>
              <TrendingUp className="w-4 h-4 text-[#DC2626]" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-white">
              {monitor.responseTime || 0}ms
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono">TOTAL INCIDENTS</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-amber-400">
              {monitor.incidents.length}
            </div>
          </div>
        </div>

        {/* Response Time Chart (Bar Chart visualization) */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#DC2626]" />
            Response Time History (Last 50 checks)
          </h2>
          
          <div className="h-48 w-full flex items-end gap-1 overflow-hidden relative border-b border-slate-800 pb-2">
            {chartPings.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-mono text-xs">
                No ping data available yet.
              </div>
            ) : (
              chartPings.map((ping, i) => {
                // max height for 1000ms
                const heightPercent = Math.min(100, Math.max(5, (ping.responseTime / 1000) * 100));
                const isDown = ping.status === "DOWN";
                
                return (
                  <div 
                    key={ping.id} 
                    title={`${ping.responseTime}ms at ${new Date(ping.createdAt).toLocaleTimeString()}`}
                    className={`flex-1 min-w-[4px] rounded-t-sm transition-all hover:opacity-80 cursor-crosshair group relative ${
                      isDown ? 'bg-rose-500' : 'bg-[#DC2626]'
                    }`}
                    style={{ height: `${isDown ? 10 : heightPercent}%` }}
                  >
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-900 border border-slate-800 text-xs text-white px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10 transition-opacity">
                      {isDown ? 'OFFLINE' : `${ping.responseTime}ms`}
                      <div className="text-[9px] text-slate-400 mt-0.5">{new Date(ping.createdAt).toLocaleTimeString()}</div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Incident History Section */}
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-800/80">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ServerCrash className="w-5 h-5 text-slate-400" />
              Incident History
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Recent downtime events and their duration.
            </p>
          </div>
          
          {monitor.incidents.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-300">Clean History</h3>
              <p className="text-xs text-slate-500">
                No incidents recorded for this monitor.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60">
              {monitor.incidents.map((incident) => {
                const isOngoing = incident.status === "ONGOING";
                
                return (
                  <div key={incident.id} className="p-4 sm:p-6 hover:bg-slate-800/20 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isOngoing ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-400"
                        }`}>
                          {isOngoing ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">
                            {isOngoing ? "Downtime Ongoing" : "Downtime Resolved"}
                          </h4>
                          <p className="text-xs text-slate-400 mt-1">
                            {incident.description || "Connection timeout or invalid status code."}
                          </p>
                          <div className="flex items-center gap-4 mt-3 text-[11px] font-mono text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-slate-600" />
                              Started: {new Date(incident.startedAt).toLocaleString()}
                            </span>
                            {!isOngoing && incident.resolvedAt && (
                              <span className="flex items-center gap-1.5 text-emerald-500/80">
                                <Activity className="w-3 h-3" />
                                Resolved: {new Date(incident.resolvedAt).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <span className={`px-2.5 py-1 rounded border text-[10px] font-bold tracking-wider ${
                        isOngoing 
                          ? "bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse"
                          : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      }`}>
                        {isOngoing ? "ACTIVE" : "RESOLVED"}
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
