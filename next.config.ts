import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/brand/og.png",
        destination: "/og",
      },
    ];
  },
};

export default nextConfig;
