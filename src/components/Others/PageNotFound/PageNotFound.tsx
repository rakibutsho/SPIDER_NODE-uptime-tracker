// src/components/NotFound/NotFound.tsx
"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface NotFoundProps {
  pageName?: string;
}

const PageNotFound: React.FC<NotFoundProps> = ({ pageName = "This page" }) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      {/* Large Lottie Animation */}
      <div className="mb-8">
        <DotLottieReact
          src="https://lottie.host/22b19dd0-bedc-48d5-8007-d00d51bef6ec/tBFRsuL10q.lottie"
          loop
          autoplay
          className="w-96 h-96"
        />
      </div>

      {/* Minimal Content */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-gray-900">
          The {pageName} Page Not Found
        </h1>
      </div>
    </div>
  );
};

export default PageNotFound;
