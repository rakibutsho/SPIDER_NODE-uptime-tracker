"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Activity,
  Plus,
  RefreshCw,
  Trash2,
  ExternalLink,
  LogOut,
  ShieldCheck,
  Globe,
  Clock,
  TrendingUp,
  AlertTriangle,
  Loader2,
  X,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface Monitor {
  id: number;
  name: string;
  url: string;
  status: string; // 'UP' | 'DOWN' | 'UNKNOWN'
  lastChecked: string | null;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loadingMonitors, setLoadingMonitors] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMonitorName, setNewMonitorName] = useState("");
  const [newMonitorUrl, setNewMonitorUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingId, setCheckingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Protect route
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard");
    }
  }, [status, router]);

  // Fetch monitors
  const fetchMonitors = useCallback(async () => {
    try {
      setLoadingMonitors(true);
      const res = await fetch("/api/monitors");
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch monitors");
      }
      const data = await res.json();
      setMonitors(data.monitors || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load monitors.");
    } finally {
      setLoadingMonitors(false);
    }
  }, [router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchMonitors();
    }
  }, [status, fetchMonitors]);

  // Create Monitor
  const handleCreateMonitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMonitorName.trim() || !newMonitorUrl.trim()) {
      toast.error("Please provide both name and URL.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/monitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newMonitorName,
          url: newMonitorUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to create monitor.");
        return;
      }

      toast.success("Monitor added successfully!");
      setNewMonitorName("");
      setNewMonitorUrl("");
      setIsAddModalOpen(false);
      fetchMonitors();
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while creating monitor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Re-check single monitor status
  const handleCheckMonitor = async (id: number) => {
    setCheckingId(id);
    try {
      const res = await fetch(`/api/monitors/${id}`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (res.ok && data.monitor) {
        toast.success(`Checked status: ${data.monitor.status}`);
        fetchMonitors();
      } else {
        toast.error(data.error || "Failed to ping monitor.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error pinging monitor.");
    } finally {
      setCheckingId(null);
    }
  };

  // Delete monitor
  const handleDeleteMonitor = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/monitors/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success(`Monitor "${name}" deleted.`);
        setMonitors((prev) => prev.filter((m) => m.id !== id));
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete monitor.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting monitor.");
    } finally {
      setDeletingId(null);
    }
  };

  if (status === "loading" || (status === "unauthenticated" && loadingMonitors)) {
    return (
      <div className="min-h-screen bg-[#090D16] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#00E5FF]" />
          <span className="text-xs text-slate-400 font-mono">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const totalMonitors = monitors.length;
  const upMonitors = monitors.filter((m) => m.status === "UP").length;
  const downMonitors = monitors.filter((m) => m.status === "DOWN").length;
  const healthPercentage =
    totalMonitors > 0
      ? Math.round((upMonitors / totalMonitors) * 100)
      : 100;
  const operationalStatus =
    downMonitors === 0 ? "ALL OPERATIONAL" : `${downMonitors} DEGRADED`;

  // Get User Initials fallback
  const userName = session?.user?.name || "Developer";
  const userEmail = session?.user?.email || "";
  const userImage = session?.user?.image;
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="glass-panel p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800">
          <div className="flex items-center gap-4">
            {userImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={userImage}
                alt={userName}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#00E5FF]/40"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00E5FF] font-mono font-bold text-lg cyan-glow">
                {userInitials}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{userName}</h1>
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-[#00E5FF] text-[10px] font-mono font-semibold border border-cyan-500/20">
                  PRO MONITOR
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{userEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00E5FF] hover:bg-cyan-400 text-[#090D16] font-bold text-xs transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Monitor</span>
            </button>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-rose-400 text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Metrics Overview Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono">TOTAL MONITORS</span>
              <Globe className="w-4 h-4 text-[#00E5FF]" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-white">
              {totalMonitors}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Endpoints active</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono">SYSTEM HEALTH</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-emerald-400">
              {healthPercentage}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Operational target 99.9%</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono">STATUS OVERVIEW</span>
              <Activity className="w-4 h-4 text-[#00E5FF]" />
            </div>
            <div
              className={`text-xl font-extrabold font-mono ${
                downMonitors === 0 ? "text-emerald-400" : "text-rose-500"
              }`}
            >
              {operationalStatus}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {upMonitors} UP • {downMonitors} DOWN
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono">AVG LATENCY</span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-[#00E5FF]">
              24ms
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Global edge pings</p>
          </div>
        </div>

        {/* Monitor Table Section */}
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-800/80 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Monitored Services</h2>
              <p className="text-xs text-slate-400">
                Real-time HTTP health check monitors linked to your account
              </p>
            </div>
            <button
              onClick={fetchMonitors}
              disabled={loadingMonitors}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Refresh List"
            >
              <RefreshCw
                className={`w-4 h-4 ${loadingMonitors ? "animate-spin text-[#00E5FF]" : ""}`}
              />
            </button>
          </div>

          {loadingMonitors ? (
            <div className="p-12 text-center text-slate-500 font-mono text-xs flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#00E5FF]" />
              <span>Fetching status records...</span>
            </div>
          ) : monitors.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-300">No Monitors Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You haven&apos;t added any endpoints yet. Click &quot;Add Monitor&quot; above to start tracking your website or API.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-2 px-4 py-2 rounded-xl bg-[#00E5FF] text-[#090D16] text-xs font-bold shadow-md shadow-cyan-500/20 cursor-pointer"
              >
                + Add Your First Monitor
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Status</th>
                    <th className="py-3.5 px-4 sm:px-6">Site Name</th>
                    <th className="py-3.5 px-4 sm:px-6">Target URL</th>
                    <th className="py-3.5 px-4 sm:px-6">Last Checked</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {monitors.map((monitor) => {
                    const isUp = monitor.status === "UP";
                    return (
                      <tr
                        key={monitor.id}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        {/* Status Badge */}
                        <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                              isUp
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isUp ? "bg-emerald-400 animate-ping" : "bg-rose-500"
                              }`}
                            />
                            {isUp ? "ONLINE" : "OFFLINE"}
                          </span>
                        </td>

                        {/* Site Name */}
                        <td className="py-4 px-4 sm:px-6 font-semibold text-slate-200 font-sans text-sm">
                          {monitor.name}
                        </td>

                        {/* URL */}
                        <td className="py-4 px-4 sm:px-6 text-slate-400">
                          <a
                            href={monitor.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 hover:text-[#00E5FF] transition-colors"
                          >
                            <span>{monitor.url}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>

                        {/* Last Checked */}
                        <td className="py-4 px-4 sm:px-6 text-slate-400">
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            {monitor.lastChecked
                              ? new Date(monitor.lastChecked).toLocaleTimeString()
                              : "Just now"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleCheckMonitor(monitor.id)}
                              disabled={checkingId === monitor.id}
                              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-[#00E5FF] transition-colors cursor-pointer disabled:opacity-50"
                              title="Re-check endpoint status"
                            >
                              <RefreshCw
                                className={`w-3.5 h-3.5 ${
                                  checkingId === monitor.id ? "animate-spin text-[#00E5FF]" : ""
                                }`}
                              />
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteMonitor(monitor.id, monitor.name)
                              }
                              disabled={deletingId === monitor.id}
                              className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950/60 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer disabled:opacity-50"
                              title="Delete Monitor"
                            >
                              {deletingId === monitor.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Monitor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Add New Monitor</h3>
            <p className="text-xs text-slate-400 mb-6">
              Configure a target URL for automated 24/7 uptime monitoring.
            </p>

            <form onSubmit={handleCreateMonitor} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Monitor Name
                </label>
                <input
                  type="text"
                  value={newMonitorName}
                  onChange={(e) => setNewMonitorName(e.target.value)}
                  placeholder="e.g. Primary API Gateway"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:border-[#00E5FF] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Target URL
                </label>
                <input
                  type="text"
                  value={newMonitorUrl}
                  onChange={(e) => setNewMonitorUrl(e.target.value)}
                  placeholder="https://api.example.com/health"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:border-[#00E5FF] outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#00E5FF] hover:bg-cyan-400 text-[#090D16] text-xs font-bold transition-all shadow-md shadow-cyan-500/20 cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Create Monitor</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}