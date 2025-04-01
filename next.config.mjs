/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Render deployments
  output: 'standalone',
  
  // Enable React Strict Mode
  reactStrictMode: true,

  // API route configuration
  api: {
    bodyParser: false, // Required for file uploads
    responseLimit: '10mb', // For large PDFs
    externalResolver: true, // Helps with Render's proxy
  },

  // Headers for proper MIME types
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript',
          },
        ],
      },
      {
        source: '/_next/static/css/(.*)',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css',
          },
        ],
      },
    ];
  },

  // Webpack configuration for PDF processing
  webpack: (config) => {
    config.resolve.fallback = { 
      fs: false,
      path: false,
      stream: false,
      zlib: false,
    };
    return config;
  },

  // Enable if using App Router
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'pdf-lib'],
  },
  
  // Production configuration
  assetPrefix: process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_RENDER_URL
    : undefined,
};

export default nextConfig;