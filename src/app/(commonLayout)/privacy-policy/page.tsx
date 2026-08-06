import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#090D16] text-slate-300">
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
            <h2 className="text-2xl font-bold text-white">1. Introduction</h2>
            <p className="text-slate-400 leading-relaxed">
              At SpiderNode ("we", "our", or "us"), we respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) or use our monitoring services, and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">2. Data We Collect</h2>
            <p className="text-slate-400 leading-relaxed">
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li><strong className="text-slate-300">Identity Data:</strong> First name, last name, username or similar identifier.</li>
              <li><strong className="text-slate-300">Contact Data:</strong> Email address, billing address, telephone numbers.</li>
              <li><strong className="text-slate-300">Financial Data:</strong> Payment card details (processed securely via Stripe).</li>
              <li><strong className="text-slate-300">Technical Data:</strong> IP address, browser type and version, time zone setting, location, operating system.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. How We Use Your Data</h2>
            <p className="text-slate-400 leading-relaxed">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g. providing uptime monitoring services).</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal or regulatory obligation.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Data Security</h2>
            <p className="text-slate-400 leading-relaxed">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
