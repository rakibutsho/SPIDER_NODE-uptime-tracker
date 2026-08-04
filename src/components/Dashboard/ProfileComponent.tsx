"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  User as UserIcon,
  Mail,
  ShieldCheck,
  KeyRound,
  Send,
  Calendar,
  Clock,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Lock,
  CheckCircle2,
  XCircle,
  Fingerprint,
  Edit2,
  Trash2,
  Save,
  X,
  Camera,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TelegramSettings from "./TelegramSettings";

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  telegramChatId: string | null;
  hasPassword: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProfileComponent() {
  const { status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    telegramChatId: "",
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
  const fetchProfile = useCallback(async (isRefresh = false) => {
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
        setEditForm(prev => ({
          ...prev,
          name: data.user.name || "",
          telegramChatId: data.user.telegramChatId || "",
        }));
        if (isRefresh) {
          toast.success("Profile reloaded!");
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
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      
      const payload: any = {};
      if (editForm.name !== profile?.name) payload.name = editForm.name;
      if (editForm.telegramChatId !== profile?.telegramChatId) payload.telegramChatId = editForm.telegramChatId;
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
      
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setEditForm(prev => ({ ...prev, currentPassword: "", newPassword: "", image: "" }));
      fetchProfile();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your account? This action is permanent and cannot be undone.")) return;
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
      toast.success("User ID copied to clipboard!");
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // Avatar fallback letters
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

  // Date formatter helper
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
      <div className="w-full max-w-6xl mx-auto space-y-6 animate-pulse p-4 sm:p-6 lg:p-8">
        {/* Banner Skeleton */}
        <div className="h-44 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-slate-800" />
            <div className="space-y-2">
              <div className="w-44 h-6 bg-slate-800 rounded-md" />
              <div className="w-60 h-4 bg-slate-800/70 rounded-md" />
            </div>
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800" />
              <div className="w-24 h-4 bg-slate-800 rounded-md" />
              <div className="w-32 h-3 bg-slate-800/60 rounded-md" />
            </div>
          ))}
        </div>

        {/* Details Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 rounded-2xl bg-slate-900/60 border border-slate-800 p-6" />
          <div className="h-72 rounded-2xl bg-slate-900/60 border border-slate-800 p-6" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="w-full max-w-xl mx-auto p-8 rounded-2xl bg-slate-900/90 text-center">
        <div className="inline-flex p-4 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white font-mono">Failed to Load Profile</h2>
        <p className="text-sm text-slate-400">{error || "User information is unavailable."}</p>
        <button
          onClick={() => fetchProfile()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#DC2626] text-[#090D16] font-bold text-xs hover:bg-red-400 transition-all shadow-md shadow-red-500/20"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10 p-5 sm:p-8 lg:p-10 pb-24">
      {/* 1. Premium Header Profile Card */}
      <div className="relative rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] p-6 sm:p-10 overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-8 w-full">
          
          {/* Avatar & Info (Left Side) */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 w-full sm:w-auto">
            
            {/* Avatar Container */}
            <div className="relative shrink-0 flex-none group" style={{ width: '120px', height: '120px' }}>
              <div className="absolute inset-0 rounded-[2rem] border-[3px] border-slate-800/80 shadow-2xl bg-slate-950 overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:border-red-500/50 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]">
                {(editForm.image || profile.image) ? (
                  <img 
                    src={editForm.image || profile.image || ""} 
                    alt={profile.name || "User"} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-[#DC2626] font-bold text-4xl font-mono">
                    {getInitials(profile.name, profile.email)}
                  </div>
                )}

                {isEditing && (
                  <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-300 z-10 m-0 backdrop-blur-sm">
                    <Camera className="w-8 h-8 text-white mb-2 transform transition-transform group-hover:scale-110" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                )}
              </div>
            </div>

            {/* Info Text */}
            <div className="space-y-3 text-center sm:text-left min-w-0">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 tracking-tight truncate">
                {profile.name || "Anonymous User"}
              </h1>
              
              <div className="flex items-center justify-center sm:justify-start gap-2.5 text-slate-400 text-sm truncate">
                <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400 shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span className="font-mono text-slate-300 font-medium truncate">{profile.email || "No email attached"}</span>
              </div>
              
              <div className="pt-2 flex justify-center sm:justify-start">
                <button
                  onClick={handleCopyId}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/50 hover:bg-slate-900 border border-slate-800/80 text-slate-300 text-xs font-mono transition-all cursor-pointer shadow-sm hover:border-slate-700 max-w-full group"
                  title="Click to copy User ID"
                >
                  <Fingerprint className="w-4 h-4 text-[#DC2626] shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-slate-200 font-medium truncate">{profile.id}</span>
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Copy className="w-3.5 h-3.5 text-slate-500 shrink-0 group-hover:text-slate-300 transition-colors" />}
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons (Right Side) */}
          <div className="flex flex-row flex-wrap items-center justify-center sm:justify-end gap-3 w-full sm:w-auto sm:ml-auto self-center">
            <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-red-500/30 text-[#DC2626] text-xs font-semibold font-mono shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pro Member</span>
            </span>

            <button
              onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-sm font-medium transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
              <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
            </button>

            {isEditing ? (
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-400 hover:to-blue-400 text-white text-sm font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {isUpdating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isUpdating ? "Saving..." : "Save"}</span>
              </button>
            ) : (
              <button
                onClick={() => fetchProfile(true)}
                disabled={refreshing}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-sm font-medium transition-all cursor-pointer shadow-sm hover:shadow-md disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-[#DC2626]" : ""}`} />
                <span>Refresh</span>
              </button>
            )}
          </div>
          
        </div>
      </div>

      {/* 2. Key Metrics Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 mb-6">
        {/* Account Status Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-slate-700/80 transition-all space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Account Status</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </p>
            <p className="text-xs text-slate-400 mt-1">Verified System User</p>
          </div>
        </div>

        {/* Security / Auth Method Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-slate-700/80 transition-all space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Auth Method</span>
            <div className="p-2.5 rounded-xl bg-red-500/10 text-[#DC2626] border border-red-500/20">
              <KeyRound className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl font-bold text-white truncate">
              {profile.hasPassword ? "Password Auth" : "OAuth Provider"}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {profile.hasPassword ? "Secured via Password" : "Social Login Enabled"}
            </p>
          </div>
        </div>

        {/* Telegram Alerts Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-slate-700/80 transition-all space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Telegram Alerts</span>
            <div className={`p-2.5 rounded-xl border ${profile.telegramChatId ? "bg-sky-500/10 text-sky-400 border-sky-500/20" : "bg-slate-800/60 text-slate-500 border-slate-700/50"}`}>
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl font-bold text-white flex items-center gap-2">
              {profile.telegramChatId ? (
                <span className="text-sky-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4.5 h-4.5" /> Connected
                </span>
              ) : (
                <span className="text-slate-400 flex items-center gap-1.5">
                  <XCircle className="w-4.5 h-4.5 text-slate-500" /> Disconnected
                </span>
              )}
            </p>
            <p className="text-xs text-slate-400 mt-1 truncate">
              {profile.telegramChatId ? `ID: ${profile.telegramChatId}` : "No alert bot linked"}
            </p>
          </div>
        </div>

        {/* Joined Date Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-slate-700/80 transition-all space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Member Since</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl font-bold text-white truncate">
              {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </p>
            <p className="text-xs text-slate-400 mt-1">Account Creation Date</p>
          </div>
        </div>
      </div>

      {/* 3. Main Details Section (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal & Account Information */}
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-8 shadow-xl">
          <div className="flex items-center gap-4 pb-5">
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-[#DC2626]">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Account Information</h3>
              <p className="text-xs text-slate-400">Personal metadata and account details</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="p-5 sm:px-6 sm:py-5 rounded-2xl bg-slate-950/60 border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</span>
              {isEditing ? (
                <input 
                  type="text" 
                  value={editForm.name} 
                  onChange={(e) => setEditForm(prev => ({...prev, name: e.target.value}))}
                  className="bg-slate-950/50 border border-slate-700 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 rounded-xl px-4 py-2 text-sm text-white transition-all w-full sm:w-1/2 shadow-inner"
                  placeholder="Enter your full name"
                />
              ) : (
                <span className="text-sm font-medium text-white">{profile.name || "Not provided"}</span>
              )}
            </div>

            <div className="p-5 sm:px-6 sm:py-5 rounded-2xl bg-slate-950/60 border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</span>
              <span className="text-sm font-medium text-slate-400 font-mono">{profile.email} {isEditing && <span className="text-xs text-slate-500 ml-2">(Cannot be changed)</span>}</span>
            </div>

            <div className="p-5 sm:px-6 sm:py-5 rounded-2xl bg-slate-950/60 border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Account ID</span>
              <span className="text-xs font-mono text-[#DC2626] bg-red-950/40 px-3 py-1.5 rounded-lg border border-red-800/40 truncate max-w-full">
                {profile.id}
              </span>
            </div>
          </div>
        </div>

        {/* Security & Password Card */}
        <div className="flex flex-col gap-8">
          <TelegramSettings />

          <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-8 shadow-xl mb-6 flex-1">
            <div className="flex items-center gap-4 pb-5">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Security</h3>
                <p className="text-xs text-slate-400">Account access status</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="p-5 sm:px-6 sm:py-5 rounded-2xl bg-slate-950/60 border border-slate-800/60 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password Protection</span>
                  <span className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    {profile.hasPassword ? "Custom Password Set" : "OAuth Managed Account"}
                  </span>
                </div>
                
                {isEditing && (
                  <div className="pt-5 mt-3 border-t border-slate-800/80 space-y-4">
                    <p className="text-xs text-slate-400">Change Password (leave blank to keep current)</p>
                    {profile.hasPassword && (
                      <input 
                        type="password" 
                        placeholder="Current Password"
                        value={editForm.currentPassword} 
                        onChange={(e) => setEditForm(prev => ({...prev, currentPassword: e.target.value}))}
                        className="bg-slate-950/50 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 rounded-xl px-4 py-2.5 text-sm text-white transition-all w-full shadow-inner"
                      />
                    )}
                    <input 
                      type="password" 
                      placeholder="New Password (min 6 characters)"
                      value={editForm.newPassword} 
                      onChange={(e) => setEditForm(prev => ({...prev, newPassword: e.target.value}))}
                      className="bg-slate-950/50 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 rounded-xl px-4 py-2.5 text-sm text-white transition-all w-full shadow-inner"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Save Button when editing */}
      {isEditing && (
        <div className="flex justify-end pt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-500 to-blue-600 hover:from-red-400 hover:to-blue-500 text-white font-bold text-sm transition-all cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isUpdating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isUpdating ? "Saving Your Changes..." : "Save All Changes"}
          </button>
        </div>
      )}

      {/* 4. Timestamps & Metadata Card (Full Width) */}
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-8 shadow-xl">
        <div className="flex items-center gap-4 pb-5">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Account Timestamps</h3>
            <p className="text-xs text-slate-400">Creation and modification history</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-5 sm:px-6 sm:py-5 rounded-2xl bg-slate-950/60 border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Created At</span>
            <span className="text-xs text-slate-200 font-mono font-medium">{formatDate(profile.createdAt)}</span>
          </div>

          <div className="p-5 sm:px-6 sm:py-5 rounded-2xl bg-slate-950/60 border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Updated</span>
            <span className="text-xs text-slate-200 font-mono font-medium">{formatDate(profile.updatedAt)}</span>
          </div>
        </div>
      </div>

      {/* 5. Danger Zone */}
      <div className="p-6 mt-6 sm:p-10 rounded-3xl bg-rose-950/20 border border-rose-900/30 backdrop-blur-md space-y-6 shadow-xl">
        <div className="flex items-center gap-4 pb-5">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-rose-500">Danger Zone</h3>
            <p className="text-xs text-rose-400/80">Irreversible account actions</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6">
          <div>
            <p className="text-sm font-medium text-slate-200">Delete Account</p>
            <p className="text-xs text-slate-500 mt-1">Permanently remove your account and all associated data.</p>
          </div>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 text-sm font-bold transition-all disabled:opacity-50 cursor-pointer"
          >
            {isDeleting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {isDeleting ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
}