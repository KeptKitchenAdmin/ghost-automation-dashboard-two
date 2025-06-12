/** @type {import('next').NextConfig} */
const nextConfig = {
  // STATIC EXPORT for Cloudflare Pages
  output: 'export', // This generates static files only
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  trailingSlash: true,
  
  // Remove server-side packages since we're going static
  // experimental: {
  //   serverComponentsExternalPackages: ['@aws-sdk/client-s3'],
  // },
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