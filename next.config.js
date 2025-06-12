/** @type {import('next').NextConfig} */
const nextConfig = {
  // CLOUDFLARE PAGES STATIC EXPORT ONLY
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Clean static export configuration
}

module.exports = nextConfig