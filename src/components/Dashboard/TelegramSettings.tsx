"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { 
  Send, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Loader2, 
  Bell,
  Trash2
} from "lucide-react";

export default function TelegramSettings() {
  const [chatId, setChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [testing, setTesting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [polling, setPolling] = useState(false);

  const fetchProfile = useCallback(async (isPolling = false) => {
    try {
      if (!isPolling) setLoading(true);
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        const currentChatId = data?.user?.telegramChatId || null;
        setChatId(currentChatId);
        
        // If polling and we now have a chat ID, stop polling and show success
        if (isPolling && currentChatId) {
          setPolling(false);
          toast.success("Successfully connected to Telegram!");
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Polling mechanism
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (polling && !chatId) {
      interval = setInterval(() => {
        fetchProfile(true);
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [polling, chatId, fetchProfile]);

  // Also refetch when window gains focus (user comes back from Telegram tab)
  useEffect(() => {
    const handleFocus = () => {
      if (polling && !chatId) {
        fetchProfile(true);
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [polling, chatId, fetchProfile]);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      const res = await fetch("/api/telegram/connect");
      if (!res.ok) throw new Error("Failed to get connection link");
      const data = await res.json();
      
      if (data.link) {
        window.open(data.link, "_blank");
        setPolling(true);
        toast.info("Waiting for Telegram connection...");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate Telegram connection");
    } finally {
      setConnecting(false);
    }
  };

  const handleTestAlert = async () => {
    try {
      setTesting(true);
      const res = await fetch("/api/telegram/test", { method: "POST" });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to send test alert");
      
      toast.success(data.message || "Test notification sent to your Telegram!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setTesting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect Telegram alerts?")) return;
    
    try {
      setDisconnecting(true);
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramChatId: "" }),
      });
      
      if (!res.ok) throw new Error("Failed to disconnect Telegram");
      
      setChatId(null);
      toast.success("Telegram disconnected successfully");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDisconnecting(false);
    }
  };

  if (loading && !chatId) {
    return (
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800/80 animate-pulse flex items-center justify-center h-48">
        <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
      </div>
    );
  }

  const isConnected = !!chatId;
  const maskedId = chatId ? `••••${chatId.slice(-4)}` : null;

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-xl relative overflow-hidden transition-all duration-300 hover:border-slate-700/80 hover:shadow-2xl hover:shadow-sky-500/5">
      {/* Background Glow */}
      <div className={`absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-colors duration-1000 ${isConnected ? 'bg-sky-500/10' : 'bg-slate-500/10'}`} />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl border ${isConnected ? 'bg-sky-500/10 text-sky-400 border-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.15)]' : 'bg-slate-800/60 text-slate-400 border-slate-700/50'}`}>
              <Send className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Telegram Alerts
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Receive instant notifications when monitors go down.
              </p>
            </div>
          </div>

          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider ${isConnected ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
            {isConnected ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Connected</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                <span>Not Connected</span>
              </>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800/60">
          {!isConnected ? (
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-slate-950/40 p-5 rounded-2xl border border-slate-800/50">
              <div className="text-sm text-slate-300">
                <p>Link your Telegram account to start receiving alerts.</p>
                {polling && (
                  <p className="text-sky-400 mt-2 flex items-center gap-2 text-xs font-medium">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Waiting for you to start the bot...
                  </p>
                )}
              </div>
              <button
                onClick={handleConnect}
                disabled={connecting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] disabled:opacity-70"
              >
                {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                Connect Telegram
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-slate-950/40 p-5 rounded-2xl border border-sky-900/30">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Chat ID</span>
                  <span className="text-lg font-mono text-white">{maskedId}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleTestAlert}
                    disabled={testing}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium transition-all shadow-sm"
                  >
                    {testing ? <Loader2 className="w-4 h-4 animate-spin text-sky-400" /> : <Bell className="w-4 h-4 text-sky-400" />}
                    Send Test Alert
                  </button>
                  <button
                    onClick={handleDisconnect}
                    disabled={disconnecting}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 hover:text-rose-300 text-sm font-medium transition-all"
                  >
                    {disconnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
