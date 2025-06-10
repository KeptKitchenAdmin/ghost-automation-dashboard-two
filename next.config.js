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
  // COMPLETELY disable webpack cache to prevent ANY .pack files
  webpack: (config, { dev, isServer }) => {
    // Disable ALL caching regardless of environment
    config.cache = false;
    
    // Disable filesystem cache completely
    if (config.cache && typeof config.cache === 'object') {
      config.cache = false;
    }
    
    // Remove any cache-related plugins
    if (config.plugins) {
      config.plugins = config.plugins.filter(plugin => 
        !plugin.constructor.name.includes('Cache')
      );
    }
    
    // Disable optimization cache
    if (config.optimization) {
      config.optimization.moduleIds = 'deterministic';
      config.optimization.chunkIds = 'deterministic';
      // Remove splitChunks to prevent large vendor chunks
      delete config.optimization.splitChunks;
    }
    
    // Ensure no cache directories are created
    config.infrastructureLogging = {
      level: 'error',
      debug: false
    };
    
    return config;
  },
}

module.exports = nextConfig