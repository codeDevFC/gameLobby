/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'game-lobby-kou8ncbmo-felix-cobbinahs-projects.vercel.app',
      },
    ],
  },
  output: 'standalone',
};

module.exports = nextConfig;
