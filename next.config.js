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
  // ONLY necessary API keys - NO tracking
  env: {
    NEXT_PUBLIC_SHOTSTACK_SANDBOX_API_KEY: process.env.NEXT_PUBLIC_SHOTSTACK_SANDBOX_API_KEY,
    NEXT_PUBLIC_SHOTSTACK_PRODUCTION_API_KEY: process.env.NEXT_PUBLIC_SHOTSTACK_PRODUCTION_API_KEY,
    NEXT_PUBLIC_ANTHROPIC_API_KEY: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
  },
  // Additional static export configuration
  experimental: {
    esmExternals: false,
  },
}

module.exports = nextConfig