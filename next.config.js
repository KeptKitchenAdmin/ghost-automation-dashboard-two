/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  trailingSlash: true,
  // Disable webpack cache for Cloudflare Pages deployment
  webpack: (config, { dev }) => {
    // Disable caching in production to reduce file sizes
    if (!dev) {
      config.cache = false;
    }
    return config;
  },
}

module.exports = nextConfig