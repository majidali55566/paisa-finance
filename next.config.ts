import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["i.pravatar.cc"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
