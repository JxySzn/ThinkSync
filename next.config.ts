import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  webpack: (config) => {
    config.resolve.enforceExtension = false; // Note: it's enforceExtension, not enforceExtensions
    return config;
  },
};

export default nextConfig;
