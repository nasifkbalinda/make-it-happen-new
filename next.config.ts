/** @type {import('next').NextConfig} */
// Fully static build (HTML/CSS/JS only), served from Cloudflare's free,
// unlimited static asset hosting. No server functions run at request time.
// Content changes in Sanity reach the site on the next build (see README).
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};

export default nextConfig;
