"use client";
import React from 'react';

export default function PrivacyPolicyContent() {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#121212] text-slate-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-slate-800 space-y-10">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">1. Information We Collect</h2>
            <p className="text-slate-400 leading-relaxed">
              We collect information you provide directly to us when you create an account, use our services, or communicate with us. This may include your name, email address, payment information, and any data you choose to monitor using our platform.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">2. How We Use Your Information</h2>
            <p className="text-slate-400 leading-relaxed">
              We use the information we collect to operate, maintain, and provide the features of our service. This includes processing payments, sending you alerts regarding your monitored services, and communicating with you about product updates or support requests.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. Data Sharing and Disclosure</h2>
            <p className="text-slate-400 leading-relaxed">
              We do not sell your personal information. We may share your information with third-party service providers (such as hosting providers and payment processors) solely for the purpose of providing our services to you. These providers are bound by strict confidentiality agreements.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Your Rights</h2>
            <p className="text-slate-400 leading-relaxed">
              You have the right to access, update, or delete your personal information at any time through your account settings. If you need assistance or wish to exercise other data rights under applicable laws (like GDPR or CCPA), please contact us.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
