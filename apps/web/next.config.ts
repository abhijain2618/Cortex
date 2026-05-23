import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow streaming responses from AI SDK
  experimental: {
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
