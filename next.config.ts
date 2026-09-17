import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
