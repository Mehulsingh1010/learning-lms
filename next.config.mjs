/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config, { isServer }) => {
      if (!isServer) {
        // Add fallback to prevent 'fs' from being bundled in client-side code
        config.resolve.fallback = { fs: false };
      }
      return config;
    },
  };
  
  export default nextConfig;
  