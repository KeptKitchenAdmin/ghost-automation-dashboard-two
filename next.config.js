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
  // NEXT_PUBLIC_ variables are automatically included in static builds
  // Additional static export configuration
  experimental: {
    esmExternals: false,
  },
}

module.exports = nextConfig