import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node';

export default defineConfig({
  integrations: [tailwind(), react()],
  output: 'static',
  server: {
    port: 3000,
    host: true
  },
  adapter: node({
    mode: 'standalone' // ou 'middleware' si tu utilises Express
  })
}); 