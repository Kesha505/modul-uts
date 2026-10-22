/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,

  // Compress responses (gzip/brotli) — smaller payloads for mobile
  compress: true,

  // Minimize unused CSS
  experimental: {
    optimizeCss: false, // keep off to avoid critters dependency issue
  },

  // Optimize images if used
  images: {
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
