/** @type {import('next').NextConfig} */
const nextConfig = {
  // keep these out of the webpack bundle, they run on the server only
  experimental: {
    serverComponentsExternalPackages: ["yahoo-finance2", "cheerio"],
  },
};

export default nextConfig;
