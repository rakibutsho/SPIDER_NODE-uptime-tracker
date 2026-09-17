"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  UserIcon,
  Mail01Icon as Mail,
  Shield01Icon as ShieldCheck,
  Key01Icon as KeyRound,
  SentIcon as Send,
  Calendar01Icon as Calendar,
  Clock01Icon as Clock,
  Copy01Icon as Copy,
  Tick01Icon as Check,
  RefreshIcon as RefreshCw,
  AlertCircleIcon as AlertCircle,
  LockIcon as Lock,
  CheckmarkCircle02Icon as CheckCircle2,
  CancelCircleIcon as XCircle,
  FingerPrintIcon as Fingerprint,
  Edit02Icon as Edit2,
  Delete02Icon as Trash2,
  FloppyDiskIcon as Save,
  Cancel01Icon as X,
  Camera01Icon as Camera,
} from "hugeicons-react";
import TelegramSettings from "./TelegramSettings";

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  telegramChatId: string | null;
  timezone: string;
  hasPassword: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProfileComponent() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    telegramChatId: "",
    timezone: "",
    currentPassword: "",
    newPassword: "",
    image: "",
  });

  // Protect route
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard/profile");
    }
  }, [status, router]);

  // Fetch Profile API
  const fetchProfile = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const res = await fetch("/api/user/profile");
        if (!res.ok) {
          if (res.status === 401) {
            router.push("/login");
            return;
          }
          throw new Error("Failed to load user profile");
        }

        const data = await res.json();
        if (data.user) {
          setProfile(data.user);
          setEditForm((prev) => ({
            ...prev,
            name: data.user.name || "",
            telegramChatId: data.user.telegramChatId || "",
            timezone: data.user.timezone || "UTC",
          }));
          if (isRefresh) {
            toast.success("Profile reloaded.");
          }
        } else {
          throw new Error(data.error || "Profile data missing");
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "An unexpected error occurred");
        toast.error("Could not fetch profile information");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [router],
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);

      const payload: any = {};
      if (editForm.name !== profile?.name) payload.name = editForm.name;
      if (editForm.telegramChatId !== profile?.telegramChatId)
        payload.telegramChatId = editForm.telegramChatId;
      if (editForm.timezone !== profile?.timezone)
        payload.timezone = editForm.timezone;
      if (editForm.newPassword) {
        payload.newPassword = editForm.newPassword;
        payload.currentPassword = editForm.currentPassword;
      }
      if (editForm.image) payload.image = editForm.image;

      if (Object.keys(payload).length === 0) {
        toast.info("No changes to save.");
        setIsEditing(false);
        return;
      }

      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      // Update NextAuth session cookie
      await update({
        name: data.user.name,
        image: data.user.image,
      });

      toast.success("Profile updated successfully.");
      setIsEditing(false);
      setEditForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        image: "",
      }));
      fetchProfile();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch("/api/user/profile", {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }
      toast.success("Account deleted successfully");
      await signOut({ callbackUrl: "/register" });
    } catch (err: any) {
      toast.error(err.message);
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, fetchProfile]);

  const handleCopyId = () => {
    if (profile?.id) {
      navigator.clipboard.writeText(profile.id);
      setCopiedId(true);
      toast.success("User ID copied to clipboard");
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "US";
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="w-full space-y-6 animate-pulse p-4 sm:p-6 lg:p-8">
        <div className="h-44 bg-[#121316] border border-white/10 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/5 border border-white/10" />
            <div className="space-y-2">
              <div className="w-48 h-6 bg-white/10" />
              <div className="w-64 h-4 bg-white/5" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-white/10 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-[#121316] p-5 space-y-3">
              <div className="w-24 h-3 bg-white/5" />
              <div className="w-32 h-5 bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="w-full max-w-xl mx-auto p-8 border border-white/15 bg-[#121316] text-left space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#EF4444]" />
          <span className="swiss-kicker text-[#EF4444]">
            ERROR // IDENTITY_UNREACHABLE
          </span>
        </div>
        <h2 className="text-xl font-bold uppercase tracking-tight text-white">
          Failed to Load Profile
        </h2>
        <p className="text-xs font-mono text-[#8E929B]">
          {error || "User identity records unavailable."}
        </p>
        <div className="pt-2">
          <button
            onClick={() => fetchProfile()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#EF4444] text-white font-mono text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-colors rounded-none"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 p-4 sm:p-6 lg:p-8">
      {/* 1. Swiss Identity Header Card */}
      <div className="border border-white/15 bg-[#121316] p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Avatar & User Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar Container */}
            <div className="relative shrink-0 w-24 h-24 border border-white/20 bg-[#0C0D0E] overflow-hidden group">
              {editForm.image || profile.image ? (
                <img
                  src={editForm.image || profile.image || ""}
                  alt={profile.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-2xl font-mono">
                  {getInitials(profile.name, profile.email)}
                </div>
              )}

              {isEditing && (
                <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-5 h-5 text-white mb-1" />
                  <span className="text-[9px] font-mono font-bold text-white uppercase tracking-wider">
                    UPLOAD
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            {/* Info */}
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#EF4444]" />
                <span className="swiss-kicker">01 // USER PROFILE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
                {profile.name || "UNNAMED USER"}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#8E929B]">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-white/50" />
                  {profile.email || "NO EMAIL"}
                </span>
                <span className="text-white/20">|</span>
                <button
                  onClick={handleCopyId}
                  className="inline-flex items-center gap-1.5 text-white/70 hover:text-white transition-colors cursor-pointer"
                  title="Click to copy User ID"
                >
                  <Fingerprint className="w-3.5 h-3.5 text-[#EF4444]" />
                  <span>ID: {profile.id.slice(0, 12)}...</span>
                  {copiedId ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-white/40" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3 pt-2 lg:pt-0">
            <button
              onClick={() =>
                isEditing ? setIsEditing(false) : setIsEditing(true)
              }
              className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 bg-transparent text-white font-mono text-xs uppercase tracking-wider hover:bg-white/10 transition-colors rounded-none cursor-pointer"
            >
              {isEditing ? (
                <X className="w-3.5 h-3.5" />
              ) : (
                <Edit2 className="w-3.5 h-3.5" />
              )}
              <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
            </button>

            {isEditing ? (
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#EF4444] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors rounded-none cursor-pointer disabled:opacity-50"
              >
                {isUpdating ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>{isUpdating ? "Saving..." : "Save Changes"}</span>
              </button>
            ) : (
              <button
                onClick={() => fetchProfile(true)}
                disabled={refreshing}
                className="inline-flex items-center gap-2 px-4 py-2 border border-white/15 bg-transparent text-[#8E929B] hover:text-white font-mono text-xs uppercase tracking-wider hover:bg-white/5 transition-colors rounded-none cursor-pointer disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#EF4444]" : ""}`}
                />
                <span>Sync</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Connected 4-Metric Telemetry Strip */}
      <div className="border border-white/15 bg-[#121316] divide-y sm:divide-y-0 sm:divide-x divide-white/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 01: Status */}
        <div className="p-5 space-y-2">
          <div className="swiss-kicker">01 // STATUS</div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-emerald-500" />
            <span className="font-mono text-sm font-bold text-white uppercase tracking-wider">
              [ACTIVE]
            </span>
          </div>
          <p className="text-[11px] font-mono text-[#8E929B]">
            VERIFIED SYSTEM OPERATOR
          </p>
        </div>

        {/* Metric 02: Auth Provider */}
        <div className="p-5 space-y-2">
          <div className="swiss-kicker">02 // AUTH PROTOCOL</div>
          <div className="font-mono text-sm font-bold text-white uppercase tracking-wider">
            {profile.hasPassword ? "[PASSWORD_AUTH]" : "[OAUTH_SSO]"}
          </div>
          <p className="text-[11px] font-mono text-[#8E929B]">
            {profile.hasPassword
              ? "CREDENTIAL PROTECTED"
              : "FEDERATED IDENTITY"}
          </p>
        </div>

        {/* Metric 03: Telegram Webhook */}
        <div className="p-5 space-y-2">
          <div className="swiss-kicker">03 // TELEGRAM INTEGRATION</div>
          <div className="font-mono text-sm font-bold uppercase tracking-wider flex items-center gap-2">
            {profile.telegramChatId ? (
              <>
                <span className="w-2 h-2 bg-emerald-500" />
                <span className="text-emerald-400">[CONNECTED]</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-[#8E929B]" />
                <span className="text-[#8E929B]">[DISCONNECTED]</span>
              </>
            )}
          </div>
          <p className="text-[11px] font-mono text-[#8E929B] truncate">
            {profile.telegramChatId
              ? `ID: ${profile.telegramChatId}`
              : "NO DISPATCH WEBHOOK"}
          </p>
        </div>

        {/* Metric 04: Member Since */}
        <div className="p-5 space-y-2">
          <div className="swiss-kicker">04 // REGISTERED ON</div>
          <div className="font-mono text-sm font-bold text-white uppercase tracking-wider">
            {new Date(profile.createdAt).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </div>
          <p className="text-[11px] font-mono text-[#8E929B]">
            INITIAL RECORD STAMP
          </p>
        </div>
      </div>

      {/* 3. Architectural 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Account Information */}
        <div className="border border-white/15 bg-[#121316] p-6 sm:p-8 space-y-6">
          <div className="border-b border-white/15 pb-4">
            <div className="swiss-kicker">02 // RECORD DETAILS</div>
            <h2 className="text-lg font-bold uppercase tracking-tight text-white mt-1">
              Account Metadata
            </h2>
          </div>

          <div className="space-y-4">
            {/* Full Name */}
            <div className="p-4 border border-white/10 bg-[#0C0D0E] space-y-1.5">
              <label className="block text-[10px] font-mono uppercase tracking-widest text-[#8E929B]">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full bg-[#121316] border border-white/20 focus:border-[#EF4444] text-white text-sm font-mono px-3 py-2 outline-none rounded-none"
                  placeholder="Enter full name"
                />
              ) : (
                <p className="text-sm font-mono font-medium text-white">
                  {profile.name || "NOT SPECIFIED"}
                </p>
              )}
            </div>

            {/* Timezone */}
            <div className="p-4 border border-white/10 bg-[#0C0D0E] space-y-1.5">
              <label className="block text-[10px] font-mono uppercase tracking-widest text-[#8E929B]">
                System Timezone
              </label>
              {isEditing ? (
                <select
                  value={editForm.timezone}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      timezone: e.target.value,
                    }))
                  }
                  className="w-full bg-[#121316] border border-white/20 focus:border-[#EF4444] text-white text-sm font-mono px-3 py-2 outline-none rounded-none"
                >
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                  <option value="America/New_York">
                    Eastern Time (US & Canada)
                  </option>
                  <option value="America/Chicago">
                    Central Time (US & Canada)
                  </option>
                  <option value="America/Denver">
                    Mountain Time (US & Canada)
                  </option>
                  <option value="America/Los_Angeles">
                    Pacific Time (US & Canada)
                  </option>
                  <option value="Europe/London">London (GMT/BST)</option>
                  <option value="Europe/Paris">Paris (CET)</option>
                  <option value="Asia/Dubai">Dubai (GST)</option>
                  <option value="Asia/Dhaka">Dhaka (BST)</option>
                  <option value="Asia/Kolkata">Kolkata (IST)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                  <option value="Australia/Sydney">Sydney (AEST)</option>
                </select>
              ) : (
                <p className="text-sm font-mono font-medium text-white">
                  {profile.timezone || "UTC"}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div className="p-4 border border-white/10 bg-[#0C0D0E] space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#8E929B]">
                  Email Address
                </label>
                <span className="text-[10px] font-mono text-[#8E929B] uppercase">
                  LOCKED
                </span>
              </div>
              <p className="text-sm font-mono text-[#8E929B]">
                {profile.email}
              </p>
            </div>

            {/* Account UUID */}
            <div className="p-4 border border-white/10 bg-[#0C0D0E] space-y-1.5">
              <label className="block text-[10px] font-mono uppercase tracking-widest text-[#8E929B]">
                System UUID
              </label>
              <p className="text-xs font-mono text-[#8E929B] break-all">
                {profile.id}
              </p>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 border border-white/10 bg-[#0C0D0E] space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E929B]">
                  Created Stamp
                </span>
                <p className="text-xs font-mono text-white">
                  {formatDate(profile.createdAt)}
                </p>
              </div>
              <div className="p-4 border border-white/10 bg-[#0C0D0E] space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E929B]">
                  Modified Stamp
                </span>
                <p className="text-xs font-mono text-white">
                  {formatDate(profile.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Telegram & Security Credentials */}
        <div className="space-y-8">
          {/* Telegram Settings Section */}
          <TelegramSettings />

          {/* Password / Access Control Card */}
          <div className="border border-white/15 bg-[#121316] p-6 sm:p-8 space-y-6">
            <div className="border-b border-white/15 pb-4">
              <div className="swiss-kicker">03 // ACCESS CONTROL</div>
              <h2 className="text-lg font-bold uppercase tracking-tight text-white mt-1">
                Credential Security
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 border border-white/10 bg-[#0C0D0E] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-white">
                    Password Protection
                  </span>
                  <span className="text-xs font-mono text-emerald-400">
                    {profile.hasPassword ? "[CONFIGURED]" : "[OAUTH_ONLY]"}
                  </span>
                </div>
                <p className="text-xs font-mono text-[#8E929B]">
                  {profile.hasPassword
                    ? "Your account uses password authentication alongside any configured OAuth providers."
                    : "No password assigned. Access is authorized via your linked OAuth provider."}
                </p>

                {isEditing && (
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[#8E929B]">
                      UPDATE PASSWORD (LEAVE EMPTY TO KEEP CURRENT)
                    </p>
                    {profile.hasPassword && (
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-[#8E929B] mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          placeholder="Current password"
                          value={editForm.currentPassword}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              currentPassword: e.target.value,
                            }))
                          }
                          className="w-full bg-[#121316] border border-white/20 focus:border-[#EF4444] text-white text-sm font-mono px-3 py-2 outline-none rounded-none"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-[#8E929B] mb-1">
                        New Password (min. 6 chars)
                      </label>
                      <input
                        type="password"
                        placeholder="New password"
                        value={editForm.newPassword}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            newPassword: e.target.value,
                          }))
                        }
                        className="w-full bg-[#121316] border border-white/20 focus:border-[#EF4444] text-white text-sm font-mono px-3 py-2 outline-none rounded-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Danger Zone */}
      <div className="border border-red-500/30 bg-red-950/10 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#EF4444]" />
          <span className="swiss-kicker text-[#EF4444]">
            04 // IRREVERSIBLE OPERATION
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold uppercase tracking-tight text-white">
              Purge Account & Telemetry Data
            </h3>
            <p className="text-xs font-mono text-[#8E929B]">
              Permanently eradicate user identity, monitors, and historical
              uptime traces.
            </p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            disabled={isDeleting}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-red-500/40 bg-transparent hover:bg-red-500 hover:text-white text-red-400 font-mono text-xs uppercase tracking-wider transition-colors rounded-none cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isDeleting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            <span>Purge Account</span>
          </button>
        </div>
      </div>

      {/* Swiss Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="w-full max-w-md bg-[#121316] border border-red-500/50 p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#EF4444]" />
                <span className="swiss-kicker text-[#EF4444]">
                  CONFIRMATION REQUIRED
                </span>
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-white">
                Purge Account Record?
              </h3>
              <p className="text-xs font-mono text-[#8E929B] leading-relaxed">
                This operation is irrevocable. All uptime telemetry, monitor
                configurations, and notification routes will be permanently
                purged from the database.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="w-full sm:w-1/2 px-4 py-2.5 border border-white/20 bg-transparent text-white font-mono text-xs uppercase tracking-wider hover:bg-white/10 transition-colors rounded-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="w-full sm:w-1/2 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#EF4444] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors rounded-none cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Confirm Purge</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
