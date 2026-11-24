/** @type {import('next').NextConfig} */
// Fully static build (HTML/CSS/JS only), served from Cloudflare's free,
// unlimited static asset hosting. No server functions run at request time.
// Content changes in Sanity reach the site on the next build (see README).
const nextConfig = {
  output: 'export',
  // Public (non-secret) Sanity identifiers, defaulted so the site builds on any
  // host without dashboard env vars. A host-level value still takes priority.
  env: {
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kusrdi3w',
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  },
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
