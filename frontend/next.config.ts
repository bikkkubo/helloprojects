import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.helloproject.com",
        pathname: "/img/**",
      },
    ],
  },
};

export default nextConfig;
