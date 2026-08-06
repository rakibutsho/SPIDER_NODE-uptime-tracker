import React from 'react';

export default function ApiReferencePage() {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#090D16] text-slate-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading tracking-tight">
            API Reference
          </h1>
          <p className="text-lg text-slate-400">
            Build custom workflows and automate your infrastructure monitoring using our REST API.
          </p>
        </div>

        <div className="space-y-12">
          
          {/* Authentication */}
          <section className="glass-panel p-8 md:p-10 rounded-3xl border border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-4">Authentication</h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              All API endpoints require authentication using a Bearer token. You can generate an API token in your account settings dashboard.
            </p>
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-700/50 mb-4">
              <pre className="text-sm font-mono text-emerald-400 overflow-x-auto">
                <code>Authorization: Bearer sk_live_xxxxxxxxxxxx</code>
              </pre>
            </div>
          </section>

          {/* Endpoints */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-white mb-6 font-heading">Core Endpoints</h2>
            
            {/* List Monitors */}
            <div className="glass-panel p-8 rounded-3xl border border-slate-800">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-sm font-bold border border-emerald-500/20">
                  GET
                </span>
                <h3 className="text-xl font-bold text-white font-mono">/v1/monitors</h3>
              </div>
              <p className="text-slate-400 text-sm mb-6">
                Returns a paginated list of all monitors configured in your account.
              </p>
              
              <h4 className="text-white font-semibold mb-2 text-sm uppercase tracking-wider">Example Response</h4>
              <div className="bg-[#0f172a] rounded-xl p-5 border border-slate-700/50">
                <pre className="text-xs font-mono text-slate-300 overflow-x-auto">
{`{
  "data": [
    {
      "id": "mon_123abc",
      "name": "Production API",
      "url": "https://api.spidernode.com/health",
      "status": "up",
      "uptime_percentage": 99.98
    }
  ],
  "has_more": false
}`}
                </pre>
              </div>
            </div>

            {/* Create Monitor */}
            <div className="glass-panel p-8 rounded-3xl border border-slate-800">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 rounded-md bg-blue-500/10 text-blue-400 font-mono text-sm font-bold border border-blue-500/20">
                  POST
                </span>
                <h3 className="text-xl font-bold text-white font-mono">/v1/monitors</h3>
              </div>
              <p className="text-slate-400 text-sm mb-6">
                Programmatically create a new HTTP/HTTPS monitor.
              </p>
              
              <h4 className="text-white font-semibold mb-2 text-sm uppercase tracking-wider">Request Body</h4>
              <div className="bg-[#0f172a] rounded-xl p-5 border border-slate-700/50">
                <pre className="text-xs font-mono text-slate-300 overflow-x-auto">
{`{
  "name": "Background Worker",
  "url": "https://worker.yourdomain.com",
  "interval_seconds": 60,
  "alert_policies": ["ap_789xyz"]
}`}
                </pre>
              </div>
            </div>

          </section>
        </div>
      </div>
    </div>
  );
}
