const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/lh3\.googleusercontent\.com/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-user-images',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60 * 30, // 30 days
        }
      }
    },
    {
      urlPattern: /\/_next\/image\?url/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'next-image',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60 * 30, // 30 days
        }
      }
    },
    {
      urlPattern: /\/_next\/static\/.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60 * 30, // 30 days
        }
      }
    }
  ]
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/a/**",
      },
    ],
  },
  // Empty Turbopack config to satisfy Next 16 when using a plugin (next-pwa) that adds webpack config
  turbopack: {},
};

module.exports = withPWA(nextConfig);