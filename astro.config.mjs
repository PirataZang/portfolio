import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: {
    // 0.0.0.0 e não localhost: sem isso o servidor só escuta dentro do
    // container e o bind de porta do docker não alcança. Vale para `dev` e
    // para `preview`, então o --host do package.json vira redundante.
    host: '0.0.0.0',
    port: 4322,
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      // needed for hot reload through the docker bind mount
      watch: { usePolling: true },
      // túnel ngrok: o vite recusa Host header desconhecido (anti DNS rebinding)
      allowedHosts: [
        'dish-starving-endorse.ngrok-free.dev',
        '.trycloudflare.com',
      ],
    },
  },
});
