import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SurakshaOS — Disaster Readiness & Response Platform',
    short_name: 'SurakshaOS',
    description: 'Learn. Simulate. Prepare. Respond. Disaster Preparedness and Response Education System for Schools and Colleges.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#4f46e5',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
