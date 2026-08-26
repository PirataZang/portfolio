import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';

/*
  astro.config.mjs roda fora do pipeline do Vite, então .env não cai sozinho
  em process.env aqui — precisa do loadEnv manual (forma documentada da
  Astro). VITE_BASE_URL fica vazia em dev (base '/') e vira '/portfolio' (ou
  o path que o nginx da VPS reservar) só em produção.
*/
const { VITE_BASE_URL } = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');

/*
  import.meta.env.BASE_URL nas páginas é o valor de `base` cru, sem barra
  final adicionada por Astro — sem essa normalização, "/portfolio" vira
  "/portfoliofavicon.svg" colado.
*/
const base = VITE_BASE_URL ? `/${VITE_BASE_URL.replace(/^\/|\/$/g, '')}/` : '/';

export default defineConfig({
  base,
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
