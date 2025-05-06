import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wbmaxqeszzieqjmxjhwb.supabase.co",
      },
    ],
  },
};

export default nextConfig;
