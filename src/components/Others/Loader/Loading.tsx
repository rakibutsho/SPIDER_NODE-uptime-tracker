// src/components/Loading.tsx
"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50 transition-opacity duration-300 opacity-100 h-screen w-full">
      <div className="w-32 h-32">
        {" "}
        {/* You can adjust the size */}
        <DotLottieReact
          src="https://lottie.host/c719ce09-1bc3-4d1e-a80b-30daa65acb2e/taKJ2GubxU.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  );
}
