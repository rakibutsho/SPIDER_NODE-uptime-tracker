"use client";

import React, { useState } from "react";
import {
  MessageAdd01Icon,
  Cancel01Icon as XIcon,
  Loading01Icon as Loader2,
} from "hugeicons-react";
import { toast } from "sonner";

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: "FEATURE",
    title: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to submit feedback");
      }

      toast.success("Feedback submitted to engineering team.");
      setIsOpen(false);
      setFormData({ type: "FEATURE", title: "", description: "" });
    } catch {
      toast.error("An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Swiss Floating Action Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 border border-white/20 bg-[#121316] text-white hover:bg-white hover:text-black px-3.5 py-2.5 font-mono text-xs uppercase tracking-[0.15em] flex items-center gap-2 transition-colors z-40 rounded-none cursor-pointer"
        aria-label="Submit Feedback"
      >
        <MessageAdd01Icon className="w-4 h-4 text-[#EF4444]" />
        <span>Feedback</span>
      </button>

      {/* Swiss Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#121316] border border-white/20 w-full max-w-md p-6 sm:p-8 space-y-6 rounded-none">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#EF4444]" />
                  <span className="swiss-kicker">USER TELEMETRY DISPATCH</span>
                </div>
                <h2 className="text-base font-bold uppercase tracking-tight text-white">
                  Submit Feedback
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#8E929B] hover:text-white transition-colors cursor-pointer"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#8E929B]">
                  Classification
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full bg-[#0C0D0E] border border-white/15 focus:border-[#EF4444] text-white text-xs font-mono px-3 py-2 outline-none rounded-none"
                >
                  <option value="FEATURE">Feature Request</option>
                  <option value="BUG">System Defect / Bug</option>
                  <option value="GENERAL">General Operational Feedback</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#8E929B]">
                  Subject Line
                </label>
                <input
                  type="text"
                  placeholder="Summary of report"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full bg-[#0C0D0E] border border-white/15 focus:border-[#EF4444] text-white text-xs font-mono px-3 py-2 outline-none rounded-none placeholder:text-[#8E929B]/50"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#8E929B]">
                  Report Specification
                </label>
                <textarea
                  placeholder="Detailed observations or reproduction steps..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full bg-[#0C0D0E] border border-white/15 focus:border-[#EF4444] text-white text-xs font-mono px-3 py-2 outline-none rounded-none placeholder:text-[#8E929B]/50 resize-none"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-white/15 bg-transparent hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider transition-colors rounded-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#EF4444] hover:bg-white hover:text-black text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors rounded-none cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  <span>{isSubmitting ? "Transmitting..." : "Transmit"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
