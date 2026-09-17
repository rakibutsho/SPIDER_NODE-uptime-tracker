"use client";

import React from "react";
import HeroSection from "./HeroSection";
import LivePreviewMockup from "./LivePreviewMockup";
import HowItWorks from "./HowItWorks";
import FeatureGrid from "./FeatureGrid";

export default function Home() {
  return (
    <div className="w-full bg-[#0C0D0E] text-[#F4F4F5] overflow-hidden font-sans">
      <HeroSection />
      <LivePreviewMockup />
      <HowItWorks />
      <FeatureGrid />
    </div>
  );
}
