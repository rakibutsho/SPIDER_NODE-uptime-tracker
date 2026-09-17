"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Activity01Icon as Activity,
  PlusSignIcon as Plus,
  RefreshIcon as RefreshCw,
  Delete02Icon as Trash2,
  LinkSquare01Icon as ExternalLink,
  Logout01Icon as LogOut,
  Shield01Icon as ShieldCheck,
  GlobeIcon as Globe,
  Clock01Icon as Clock,
  ArrowUpRight01Icon as TrendingUp,
  Loading01Icon as Loader2,
  Cancel01Icon as X,
  Edit02Icon as Edit2,
  EcoPowerIcon as Power,
} from "hugeicons-react";
import Link from "next/link";

interface Monitor {
  id: number;
  name: string;
  url: string;
  status: string; // 'UP' | 'DOWN' | 'UNKNOWN' | 'PENDING'
  lastChecked: string | null;
  createdAt: string;
  isActive: boolean;
  interval: number;
  responseTime: number;
  uptimePercent: number;
}

export function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loadingMonitors, setLoadingMonitors] = useState(true);
  const [checkingId, setCheckingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMonitorName, setNewMonitorName] = useState("");
  const [newMonitorUrl, setNewMonitorUrl] = useState("");
  const [newMonitorInterval, setNewMonitorInterval] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMonitor, setEditingMonitor] = useState<Monitor | null>(null);
  const [editMonitorName, setEditMonitorName] = useState("");
  const [editMonitorUrl, setEditMonitorUrl] = useState("");
  const [editMonitorInterval, setEditMonitorInterval] = useState(5);
  const [isUpdating, setIsUpdating] = useState(false);

  // Protect route
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard");
    }
  }, [status, router]);

  // Fetch monitors
  const fetchMonitors = useCallback(async () => {
    try {
      const res = await fetch("/api/monitors");
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        let errorMsg = "Failed to fetch monitors";
        try {
          const errData = await res.json();
          if (errData.details) errorMsg += `: ${errData.details}`;
        } catch (e) {}
        throw new Error(errorMsg);
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

      // Auto-refresh every 30 seconds
      const interval = setInterval(() => {
        fetchMonitors();
      }, 30000);

      return () => clearInterval(interval);
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
          interval: newMonitorInterval,
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
      setNewMonitorInterval(5);
      setIsAddModalOpen(false);
      fetchMonitors();
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while creating monitor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (monitor: Monitor) => {
    setEditingMonitor(monitor);
    setEditMonitorName(monitor.name);
    setEditMonitorUrl(monitor.url);
    setEditMonitorInterval(monitor.interval || 5);
    setIsEditModalOpen(true);
  };

  // Update Monitor
  const handleEditMonitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMonitor) return;

    if (!editMonitorName.trim() || !editMonitorUrl.trim()) {
      toast.error("Please provide both name and URL.");
      return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/monitors/${editingMonitor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editMonitorName,
          url: editMonitorUrl,
          interval: editMonitorInterval,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to update monitor.");
        return;
      }

      toast.success("Monitor updated successfully!");
      setIsEditModalOpen(false);
      setEditingMonitor(null);
      fetchMonitors();
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while updating monitor.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Re-check single monitor status
  const handleCheckMonitor = async (id: number) => {
    setCheckingId(id);
    try {
      const res = await fetch(`/api/monitors/${id}/check`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Check triggered manually`);
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

  // Toggle Active Status
  const handleToggleActive = async (monitor: Monitor) => {
    setTogglingId(monitor.id);
    try {
      const res = await fetch(`/api/monitors/${monitor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isActive: !monitor.isActive,
        }),
      });

      if (res.ok) {
        toast.success(monitor.isActive ? "Monitor paused" : "Monitor resumed");
        fetchMonitors();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to toggle monitor.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error toggling monitor.");
    } finally {
      setTogglingId(null);
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

  if (
    status === "loading" ||
    (status === "unauthenticated" && loadingMonitors)
  ) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#EF4444]" />
          <span className="text-xs text-slate-400 font-mono">
            Loading Dashboard...
          </span>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const activeMonitors = monitors.filter((m) => m.isActive);
  const totalMonitors = activeMonitors.length;
  const upMonitors = activeMonitors.filter((m) => m.status === "UP").length;
  const downMonitors = activeMonitors.filter((m) => m.status === "DOWN").length;
  const healthPercentage =
    totalMonitors > 0 ? Math.round((upMonitors / totalMonitors) * 100) : 100;
  const operationalStatus =
    downMonitors === 0 ? "ALL OPERATIONAL" : `${downMonitors} DEGRADED`;

  const avgLatency =
    activeMonitors.length > 0
      ? Math.round(
          activeMonitors.reduce((acc, m) => acc + (m.responseTime || 0), 0) /
            activeMonitors.length,
        )
      : 0;

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
    <div className="min-h-screen bg-[#0C0D0E] text-[#F4F4F5] p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="border border-white/15 bg-[#121316] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-none">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 bg-[#0C0D0E] border border-white/20 flex items-center justify-center text-white font-mono font-black text-lg rounded-none">
              {userInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#EF4444]" />
                <h1 className="text-xl font-black uppercase tracking-tight text-white">
                  {userName}
                </h1>
                <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest bg-white/10 text-white border border-white/20 rounded-none">
                  PRO CONSOLE
                </span>
              </div>
              <p className="text-xs text-[#8E929B] font-mono mt-0.5">
                OPERATOR ID // {userEmail}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-start sm:justify-end">
            <Link
              href="/dashboard/profile"
              className="px-4 py-2.5 border border-white/20 hover:border-white/60 text-[#A0A4AD] hover:text-white text-xs font-mono uppercase tracking-wider transition-colors rounded-none"
            >
              Account
            </Link>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold text-xs uppercase tracking-[0.18em] transition-colors rounded-none shadow-none cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register Monitor</span>
            </button>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-2.5 border border-white/15 text-[#8E929B] hover:text-[#EF4444] hover:border-[#EF4444]/40 transition-colors cursor-pointer rounded-none"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Swiss Connected Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-white/15 bg-[#121316] divide-y sm:divide-y-0 sm:divide-x divide-white/15 rounded-none text-left">
          <div className="p-6">
            <div className="flex items-center justify-between text-[#8E929B] mb-2 font-mono text-[10px] uppercase tracking-[0.2em]">
              <span>ACTIVE MONITORS</span>
              <Globe className="w-3.5 h-3.5 text-[#EF4444]" />
            </div>
            <div className="text-4xl font-black font-mono text-white tracking-tight">
              {totalMonitors}
            </div>
            <p className="text-[10px] font-mono text-[#8E929B] uppercase tracking-wider mt-2">
              TOTAL {monitors.length} REGISTERED
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between text-[#8E929B] mb-2 font-mono text-[10px] uppercase tracking-[0.2em]">
              <span>SYSTEM HEALTH</span>
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="text-4xl font-black font-mono text-white tracking-tight">
              {healthPercentage}%
            </div>
            <p className="text-[10px] font-mono text-[#8E929B] uppercase tracking-wider mt-2">
              TARGET 99.90% SLA
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between text-[#8E929B] mb-2 font-mono text-[10px] uppercase tracking-[0.2em]">
              <span>STATUS OVERVIEW</span>
              <Activity className="w-3.5 h-3.5 text-[#EF4444]" />
            </div>
            <div
              className={`text-2xl font-black font-mono uppercase tracking-tight ${
                downMonitors === 0 ? "text-white" : "text-[#EF4444]"
              }`}
            >
              {operationalStatus}
            </div>
            <p className="text-[10px] font-mono text-[#8E929B] uppercase tracking-wider mt-2">
              {upMonitors} OPERATIONAL • {downMonitors} FAILING
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between text-[#8E929B] mb-2 font-mono text-[10px] uppercase tracking-[0.2em]">
              <span>AVG LATENCY</span>
              <TrendingUp className="w-3.5 h-3.5 text-[#EF4444]" />
            </div>
            <div className="text-4xl font-black font-mono text-[#EF4444] tracking-tight">
              {avgLatency}
              <span className="text-sm font-normal text-[#8E929B] ml-1">
                MS
              </span>
            </div>
            <p className="text-[10px] font-mono text-[#8E929B] uppercase tracking-wider mt-2">
              GLOBAL PING SAMPLE
            </p>
          </div>
        </div>

        {/* Monitor Table Section */}
        <div className="border border-white/15 bg-[#121316] rounded-none">
          <div className="p-6 border-b border-white/15 flex items-center justify-between text-left">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-[#EF4444]" />
                <span className="swiss-kicker">02 // ACTIVE ENDPOINTS</span>
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">
                Monitored Telemetry Services
              </h2>
              <p className="text-xs text-[#8E929B] font-mono mt-1">
                SYNCHRONOUS HTTP / TCP HEALTH CHECKS
              </p>
            </div>
            <button
              onClick={fetchMonitors}
              disabled={loadingMonitors}
              className="p-2.5 border border-white/15 hover:border-white/40 text-[#8E929B] hover:text-white transition-colors cursor-pointer rounded-none"
              title="Refresh List"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loadingMonitors ? "animate-spin text-[#EF4444]" : ""}`}
              />
            </button>
          </div>

          {loadingMonitors && monitors.length === 0 ? (
            <div className="p-16 text-center text-[#8E929B] font-mono text-xs flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-[#EF4444]" />
              <span className="uppercase tracking-widest">
                AWAITING TELEMETRY STREAMS...
              </span>
            </div>
          ) : monitors.length === 0 ? (
            <div className="p-16 text-center space-y-4">
              <div className="w-12 h-12 border border-white/20 text-[#8E929B] flex items-center justify-center mx-auto rounded-none">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                NO MONITORS CONFIGURED
              </h3>
              <p className="text-xs text-[#8E929B] max-w-sm mx-auto font-mono">
                No active endpoints are being probed. Register your first
                production URL to start tracking latency.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 px-6 py-3 bg-[#EF4444] text-white text-xs font-bold uppercase tracking-[0.18em] hover:bg-[#DC2626] transition-colors rounded-none shadow-none cursor-pointer"
              >
                + REGISTER FIRST ENDPOINT
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-white/[0.02] border-b border-white/15 text-[#8E929B] uppercase tracking-[0.2em] text-[10px]">
                  <tr>
                    <th className="py-4 px-6">STATUS & PING</th>
                    <th className="py-4 px-6">TARGET ENDPOINT</th>
                    <th className="py-4 px-6">AVAILABILITY</th>
                    <th className="py-4 px-6">LAST PROBE</th>
                    <th className="py-4 px-6 text-right">COMMANDS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {monitors.map((monitor) => {
                    const isUp = monitor.isActive && monitor.status === "UP";
                    const isDown =
                      monitor.isActive && monitor.status === "DOWN";

                    return (
                      <tr
                        key={monitor.id}
                        className={`hover:bg-white/[0.02] transition-colors ${!monitor.isActive ? "opacity-50" : ""} ${
                          isDown
                            ? "border-l-2 border-l-[#EF4444] bg-[#EF4444]/5"
                            : ""
                        }`}
                      >
                        {/* Status & Latency Badge */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-none ${
                                isUp
                                  ? "bg-white/10 text-white border border-white/20"
                                  : isDown
                                    ? "bg-[#EF4444] text-white border border-[#EF4444]"
                                    : "bg-white/5 text-[#8E929B] border border-white/10"
                              }`}
                            >
                              {monitor.isActive ? monitor.status : "PAUSED"}
                            </span>
                            {monitor.isActive && (
                              <span
                                className={`text-xs font-mono font-bold ${
                                  isDown ? "text-[#EF4444]" : "text-white"
                                }`}
                              >
                                {monitor.responseTime || 0} MS
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Site Name & URL */}
                        <td className="py-4 px-6">
                          <Link href={`/dashboard/monitor/${monitor.id}`}>
                            <div className="font-bold text-white text-sm hover:text-[#EF4444] transition-colors cursor-pointer uppercase tracking-tight font-sans">
                              {monitor.name}
                            </div>
                          </Link>
                          <a
                            href={monitor.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[#8E929B] hover:text-white transition-colors text-[11px] font-mono mt-0.5"
                          >
                            <span className="truncate max-w-xs">
                              {monitor.url}
                            </span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>

                        {/* Uptime */}
                        <td className="py-4 px-6">
                          <div
                            className={`font-mono font-bold text-sm ${
                              monitor.uptimePercent < 95
                                ? "text-[#EF4444]"
                                : "text-white"
                            }`}
                          >
                            {monitor.uptimePercent
                              ? monitor.uptimePercent.toFixed(2)
                              : 100}
                            %
                          </div>
                          <div className="text-[10px] text-[#8E929B] font-mono uppercase tracking-wider">
                            {monitor.interval || 5}M CYCLE
                          </div>
                        </td>

                        {/* Last Checked */}
                        <td className="py-4 px-6 text-[#8E929B] font-mono text-[11px]">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-[#8E929B]" />
                            {monitor.lastChecked
                              ? new Date(
                                  monitor.lastChecked,
                                ).toLocaleTimeString()
                              : "NEVER"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            {/* Toggle Pause/Resume */}
                            <button
                              onClick={() => handleToggleActive(monitor)}
                              disabled={togglingId === monitor.id}
                              className="p-2 bg-[#0C0D0E] border border-white/15 text-[#8E929B] hover:text-white hover:border-white/40 transition-colors cursor-pointer rounded-none disabled:opacity-50"
                              title={
                                monitor.isActive
                                  ? "Pause Monitor"
                                  : "Resume Monitor"
                              }
                            >
                              {togglingId === monitor.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Power className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Manual Check */}
                            <button
                              onClick={() => handleCheckMonitor(monitor.id)}
                              disabled={
                                checkingId === monitor.id || !monitor.isActive
                              }
                              className="p-2 bg-[#0C0D0E] border border-white/15 text-[#8E929B] hover:text-[#EF4444] hover:border-[#EF4444]/40 transition-colors cursor-pointer rounded-none disabled:opacity-50"
                              title="Re-check endpoint status"
                            >
                              <RefreshCw
                                className={`w-3.5 h-3.5 ${
                                  checkingId === monitor.id
                                    ? "animate-spin text-[#EF4444]"
                                    : ""
                                }`}
                              />
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => openEditModal(monitor)}
                              className="p-2 bg-[#0C0D0E] border border-white/15 text-[#8E929B] hover:text-white hover:border-white/40 transition-colors cursor-pointer rounded-none"
                              title="Edit Configuration"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() =>
                                handleDeleteMonitor(monitor.id, monitor.name)
                              }
                              disabled={deletingId === monitor.id}
                              className="p-2 bg-[#0C0D0E] border border-white/15 text-[#8E929B] hover:text-[#EF4444] hover:border-[#EF4444]/40 transition-colors cursor-pointer rounded-none disabled:opacity-50"
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

      {/* Swiss Add Monitor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="w-full max-w-md p-8 bg-[#121316] border border-white/20 rounded-none text-left relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-6 right-6 text-[#8E929B] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-[#EF4444]" />
              <span className="swiss-kicker">01 // TARGET REGISTRATION</span>
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">
              Add New Monitor
            </h3>
            <p className="text-xs text-[#8E929B] font-mono mb-6">
              CONFIGURE ENDPOINT FOR 30S POLLING
            </p>

            <form
              onSubmit={handleCreateMonitor}
              className="space-y-5 font-mono"
            >
              <div>
                <label className="block text-[10px] uppercase tracking-[0.18em] text-[#A0A4AD] mb-2">
                  Service Identifier (Name)
                </label>
                <input
                  type="text"
                  value={newMonitorName}
                  onChange={(e) => setNewMonitorName(e.target.value)}
                  placeholder="e.g. Primary API Gateway"
                  required
                  className="w-full px-4 py-3 bg-[#0C0D0E] border border-white/15 text-white text-xs rounded-none focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.18em] text-[#A0A4AD] mb-2">
                  Target URL (HTTP/HTTPS)
                </label>
                <input
                  type="url"
                  value={newMonitorUrl}
                  onChange={(e) => setNewMonitorUrl(e.target.value)}
                  placeholder="https://api.spidernode.site/health"
                  required
                  className="w-full px-4 py-3 bg-[#0C0D0E] border border-white/15 text-white text-xs rounded-none focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.18em] text-[#A0A4AD] mb-2">
                  Polling Interval
                </label>
                <select
                  value={newMonitorInterval}
                  onChange={(e) =>
                    setNewMonitorInterval(Number(e.target.value))
                  }
                  className="w-full px-4 py-3 bg-[#0C0D0E] border border-white/15 text-white text-xs rounded-none focus:border-white focus:outline-none uppercase"
                >
                  <option value={1}>Every 1 Minute</option>
                  <option value={5}>Every 5 Minutes</option>
                  <option value={10}>Every 10 Minutes</option>
                  <option value={30}>Every 30 Minutes</option>
                  <option value={60}>Every 60 Minutes</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 border border-white/15 text-[#A0A4AD] hover:text-white text-xs uppercase tracking-wider rounded-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-bold uppercase tracking-[0.18em] rounded-none shadow-none cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>INITIALIZING...</span>
                    </>
                  ) : (
                    <span>CONFIRM MONITOR</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Swiss Edit Monitor Modal */}
      {isEditModalOpen && editingMonitor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="w-full max-w-md p-8 bg-[#121316] border border-white/20 rounded-none text-left relative">
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingMonitor(null);
              }}
              className="absolute top-6 right-6 text-[#8E929B] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-[#EF4444]" />
              <span className="swiss-kicker">02 // CONFIGURATION MUTATION</span>
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">
              Edit Monitor
            </h3>
            <p className="text-xs text-[#8E929B] font-mono mb-6">
              MUTATING CONFIGURATION FOR {editingMonitor.name}
            </p>

            <form onSubmit={handleEditMonitor} className="space-y-5 font-mono">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.18em] text-[#A0A4AD] mb-2">
                  Service Identifier (Name)
                </label>
                <input
                  type="text"
                  value={editMonitorName}
                  onChange={(e) => setEditMonitorName(e.target.value)}
                  placeholder="e.g. Primary API Gateway"
                  required
                  className="w-full px-4 py-3 bg-[#0C0D0E] border border-white/15 text-white text-xs rounded-none focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.18em] text-[#A0A4AD] mb-2">
                  Target URL (HTTP/HTTPS)
                </label>
                <input
                  type="url"
                  value={editMonitorUrl}
                  onChange={(e) => setEditMonitorUrl(e.target.value)}
                  placeholder="https://api.spidernode.site/health"
                  required
                  className="w-full px-4 py-3 bg-[#0C0D0E] border border-white/15 text-white text-xs rounded-none focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.18em] text-[#A0A4AD] mb-2">
                  Polling Interval
                </label>
                <select
                  value={editMonitorInterval}
                  onChange={(e) =>
                    setEditMonitorInterval(Number(e.target.value))
                  }
                  className="w-full px-4 py-3 bg-[#0C0D0E] border border-white/15 text-white text-xs rounded-none focus:border-white focus:outline-none uppercase"
                >
                  <option value={1}>Every 1 Minute</option>
                  <option value={5}>Every 5 Minutes</option>
                  <option value={10}>Every 10 Minutes</option>
                  <option value={30}>Every 30 Minutes</option>
                  <option value={60}>Every 60 Minutes</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingMonitor(null);
                  }}
                  className="px-4 py-2.5 border border-white/15 text-[#A0A4AD] hover:text-white text-xs uppercase tracking-wider rounded-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-bold uppercase tracking-[0.18em] rounded-none shadow-none cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>UPDATING...</span>
                    </>
                  ) : (
                    <span>COMMIT CHANGES</span>
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
