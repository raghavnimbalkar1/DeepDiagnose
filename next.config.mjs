/** @type {import('next').NextConfig} */
const nextConfig = {
    api: {
      // Disables body parsing (required for file uploads)
      bodyParser: false,
      // Increases request size limit to 10MB (adjust as needed)
      responseLimit: '10mb',
    },
    // Optional: Add custom webpack config for larger files
    webpack: (config) => {
      config.resolve.fallback = { 
        ...config.resolve.fallback,
        fs: false, // Needed for pdf-parse to work in browser context
      };
      return config;
    }
  };
  
  export default nextConfig;