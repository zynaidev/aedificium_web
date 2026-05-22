import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "204.168.146.182",
        port: "8001",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
