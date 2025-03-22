import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    domains: ["firebasestorage.googleapis.com", "i.pravatar.cc", "lh3.googleusercontent.com"],
  },
  /* config options here */
};

export default nextConfig;
