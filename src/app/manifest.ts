import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Trip Tracker',
    short_name: 'Trip Tracker',
    description: 'Track your trips and stay compliant with UK PR requirements',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    orientation: 'portrait',
    categories: ['travel', 'utilities'],
    display_override: ['standalone', 'browser'],
    prefer_related_applications: false,
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
      // {
      //   src: '/apple-touch-icon.png',
      //   sizes: '180x180',
      //   type: 'image/png'
      // }
    ],
  }
}