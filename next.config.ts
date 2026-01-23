import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kidsgourmet.com.tr',
        pathname: '/**', // Tüm alt klasörlere izin ver
      },
      {
        protocol: 'https',
        hostname: '*.kidsgourmet.com.tr', // Subdomainler (api, cdn vs.)
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Demo görselleri için
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com', // Fallback görselleri için
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;