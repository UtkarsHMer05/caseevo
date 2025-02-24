/** @type {import('next').NextConfig} */

const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ohyyx36bmp.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
