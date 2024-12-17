/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Add fallback to prevent 'fs' from being bundled in client-side code
      config.resolve.fallback = { fs: false };
    }

    // Add path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': process.cwd(),
      '@/components': `${process.cwd()}/components`,
      '@/lib': `${process.cwd()}/lib`,
      '@/hooks': `${process.cwd()}/hooks`,
      '@/styles': `${process.cwd()}/styles`,
      '@/utils': `${process.cwd()}/utils`,
      '@/constants': `${process.cwd()}/constants`,
      '@/types': `${process.cwd()}/types`
    }

    return config;
  },
};

export default nextConfig;