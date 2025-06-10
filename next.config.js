/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static export for Cloudflare Pages
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  trailingSlash: true,
  // Completely disable webpack cache to prevent large .pack files
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      // Disable all forms of caching
      config.cache = false;
      
      // Disable persistent cache
      if (config.infrastructureLogging) {
        config.infrastructureLogging.level = 'error';
      }
      
      // Optimize chunk sizes for Cloudflare
      if (config.optimization) {
        config.optimization.splitChunks = {
          chunks: 'all',
          maxSize: 244000, // ~240KB chunks (well under 25MB limit)
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              maxSize: 244000,
            },
          },
        };
      }
    }
    return config;
  },
}

module.exports = nextConfig