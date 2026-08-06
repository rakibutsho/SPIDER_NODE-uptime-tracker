"use client";

import React, { useState } from 'react';

export default function CookieSettingsPage() {
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#090D16] text-slate-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading tracking-tight">
            Cookie Settings
          </h1>
          <p className="text-lg text-slate-400">
            Manage your cookie preferences. We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
          </p>
        </div>

        <div className="space-y-6">
          
          {/* Essential */}
          <div className="glass-panel p-6 md:p-8 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Essential Cookies</h2>
              <p className="text-sm text-slate-400 max-w-2xl">
                These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas.
              </p>
            </div>
            <div className="shrink-0">
              <span className="px-3 py-1 bg-slate-800 text-slate-400 text-sm font-semibold rounded-full">
                Always Active
              </span>
            </div>
          </div>

          {/* Analytics */}
          <div className="glass-panel p-6 md:p-8 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Analytics Cookies</h2>
              <p className="text-sm text-slate-400 max-w-2xl">
                These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are.
              </p>
            </div>
            <div className="shrink-0">
              <button 
                onClick={() => setAnalytics(!analytics)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${analytics ? 'bg-[#DC2626]' : 'bg-slate-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${analytics ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          {/* Marketing */}
          <div className="glass-panel p-6 md:p-8 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Marketing Cookies</h2>
              <p className="text-sm text-slate-400 max-w-2xl">
                These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed.
              </p>
            </div>
            <div className="shrink-0">
              <button 
                onClick={() => setMarketing(!marketing)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${marketing ? 'bg-[#DC2626]' : 'bg-slate-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${marketing ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button className="px-6 py-3 bg-[#DC2626] hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all">
              Save Preferences
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
