import dns from "dns";
import createJiti from "jiti";
import { fileURLToPath } from "url";
/** @type {import('next').NextConfig} */


dns.setDefaultResultOrder('ipv4first');
createJiti(fileURLToPath(import.meta.url))("./src/env");

const nextConfig = {
  reactStrictMode: true,

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    optimizePackageImports: ['bcryptjs', 'googleapis'],
  },
  transpilePackages: [ "@local/auth", "@local/api"],
  serverExternalPackages: [ "@local/db"],
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
};

export default nextConfig;
