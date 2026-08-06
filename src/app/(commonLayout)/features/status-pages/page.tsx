import React from "react";
import Link from "next/link";
import { WebDesign01Icon as WebDesign, GlobeIcon as Domain, PaintBoardIcon as PaintBoard, ArrowRight01Icon as ArrowRight } from "hugeicons-react";

export default function StatusPagesFeature() {
  const features = [
    {
      title: "Custom Domains",
      description: "Host your status page on your own domain (e.g., status.yourcompany.com) for a seamless brand experience.",
      icon: Domain,
    },
    {
      title: "Custom Branding",
      description: "Match your status page to your brand identity with custom logos, colors, and layouts.",
      icon: PaintBoard,
    },
    {
      title: "Incident Communication",
      description: "Post updates during an outage to keep your customers informed and reduce support ticket volume.",
      icon: WebDesign,
    },
  ];

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 overflow-hidden font-sans pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#DC2626]/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/60 border border-red-500/30 text-[#DC2626] text-xs font-mono mb-6 backdrop-blur-md">
            <WebDesign className="w-4 h-4" />
            Build Trust
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold font-heading tracking-tight mb-6">
            Beautiful <span className="red-gradient-text">Status Pages</span>
          </h1>
          <p className="text-lg text-slate-400 mb-8">
            Keep your users in the loop during downtime. Build trust with a transparent, real-time status page that reflects your brand.
          </p>
          
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#DC2626] hover:bg-red-400 text-[#090D16] font-bold text-sm transition-all shadow-xl shadow-red-500/25 group"
          >
            Create Your Status Page
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-20">
          {features.map((feature, idx) => (
            <div key={idx} className="glass-panel p-8 rounded-2xl glass-panel-hover group">
              <div className="w-12 h-12 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-center mb-6 group-hover:border-red-500/30 group-hover:text-[#DC2626] transition-colors">
                <feature.icon className="w-6 h-6 text-slate-400 group-hover:text-[#DC2626]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
