"use client";
import React from 'react';

export default function TermsContent() {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#090D16] text-slate-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading tracking-tight">
            Terms of Service
          </h1>
          <p className="text-lg text-slate-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-slate-800 space-y-10">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
            <p className="text-slate-400 leading-relaxed">
              By registering for and/or using the Services in any manner, including but not limited to visiting or browsing the SpiderNode website, you agree to these Terms of Service and all other operating rules, policies and procedures that may be published from time to time on the Site by us, each of which is incorporated by reference and each of which may be updated from time to time without notice to you.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">2. Acceptable Use Policy</h2>
            <p className="text-slate-400 leading-relaxed">
              You agree not to use the Service in any way that is unlawful, or harms SpiderNode, its service providers, suppliers or any other user. You must not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li>Use the Service in any manner that could disable, overburden, damage, or impair the Site or interfere with any other party's use of the Service.</li>
              <li>Attempt to gain unauthorized access to any part of the Service, other accounts, computer systems or networks connected to the Service.</li>
              <li>Use any robot, spider or other automatic device, process or means to access the Service for any purpose, including monitoring or copying any of the material on the Service.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. Limitation of Liability</h2>
            <p className="text-slate-400 leading-relaxed">
              In no event shall SpiderNode, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
