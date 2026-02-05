/** @type {import('next').NextConfig} */
const nextConfig = {
  // This tells Next.js to treat pdf-parse as an external package 
  // so it doesn't try to bundle it (works with both Webpack and Turbopack)
  serverExternalPackages: ["pdf-parse"],
  devIndicators: false
};

export default nextConfig;