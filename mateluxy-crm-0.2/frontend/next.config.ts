import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mateluxy-crm.s3.ap-south-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'www.propertyfinder.ae',
      },
      {
        protocol: 'https',
        hostname: 'static.shared.propertyfinder.ae',
      },
    ],
  },
};

export default nextConfig;
