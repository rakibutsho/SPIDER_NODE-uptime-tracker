"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  SentIcon as Send,
  CheckmarkCircle02Icon as CheckCircle2,
  CancelCircleIcon as XCircle,
  LinkSquare01Icon as ExternalLink,
  Loading01Icon as Loader2,
  Notification01Icon as Bell,
  Delete02Icon as Trash2,
} from "hugeicons-react";

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
    if (!confirm("Are you sure you want to disconnect Telegram alerts?"))
      return;

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
    <div className="p-6 sm:p-8 bg-[#121316] border border-white/15 rounded-none text-left font-sans">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-[#EF4444]" />
              <span className="swiss-kicker">03 // NOTIFICATION DISPATCH</span>
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              Telegram Alerts Channel
            </h3>
            <p className="text-xs text-[#8E929B] font-mono mt-0.5">
              INSTANT PUSH NOTIFICATIONS FOR THRESHOLD BREACHES
            </p>
          </div>

          <div
            className={`px-2.5 py-1 rounded-none border text-[10px] font-mono font-bold uppercase tracking-wider ${
              isConnected
                ? "bg-white/10 border-white/20 text-white"
                : "bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]"
            }`}
          >
            {isConnected ? "STATUS: CONNECTED" : "STATUS: UNLINKED"}
          </div>
        </div>

        <div className="pt-6 border-t border-white/10">
          {!isConnected ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between bg-[#0C0D0E] p-6 border border-white/10 rounded-none">
              <div className="text-xs font-mono text-[#A0A4AD] space-y-1">
                <p className="text-white font-bold uppercase">
                  NO ACTIVE TELEGRAM BINDING
                </p>
                <p>
                  Link your account to receive zero-latency downtime
                  notifications on your mobile device.
                </p>
                {polling && (
                  <p className="text-[#EF4444] mt-2 flex items-center gap-2 text-[11px] font-bold">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    AWAITING /start CONFIRMATION IN TELEGRAM BOT...
                  </p>
                )}
              </div>
              <button
                onClick={handleConnect}
                disabled={connecting}
                className="w-full sm:w-auto px-6 py-3 bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold text-xs uppercase tracking-[0.18em] transition-colors rounded-none cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {connecting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ExternalLink className="w-4 h-4" />
                )}
                <span>AUTHENTICATE BOT</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between bg-[#0C0D0E] p-6 border border-white/10 rounded-none font-mono">
                <div>
                  <span className="text-[10px] text-[#8E929B] uppercase tracking-[0.2em] block mb-1">
                    BOUND TELEGRAM CHAT ID
                  </span>
                  <span className="text-xl font-black text-white">
                    {maskedId}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleTestAlert}
                    disabled={testing}
                    className="px-5 py-2.5 bg-[#121316] border border-white/20 hover:border-white/50 text-white text-xs font-bold uppercase tracking-[0.15em] transition-colors rounded-none cursor-pointer flex items-center justify-center gap-2"
                  >
                    {testing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Bell className="w-3.5 h-3.5 text-[#EF4444]" />
                    )}
                    <span>TEST PAYLOAD</span>
                  </button>
                  <button
                    onClick={handleDisconnect}
                    disabled={disconnecting}
                    className="px-5 py-2.5 border border-white/15 hover:border-[#EF4444]/40 text-[#8E929B] hover:text-[#EF4444] text-xs font-bold uppercase tracking-[0.15em] transition-colors rounded-none cursor-pointer flex items-center justify-center gap-2"
                  >
                    {disconnecting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    <span>DISCONNECT</span>
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
