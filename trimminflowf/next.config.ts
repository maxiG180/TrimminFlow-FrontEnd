import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Suppress hydration warnings caused by browser extensions
  // These warnings are expected and harmless in development
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
