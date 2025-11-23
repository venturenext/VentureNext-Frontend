import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBase = env.PUBLIC_API_BASE || env.PRIVATE_API_BASE || 'http://localhost:8000/api/v1';
  const backendUrl = apiBase.replace(/\/api\/v\d+$/, '');

  return {
    plugins: [sveltekit()],
    server: {
      proxy: {
        '/storage': {
          target: backendUrl,
          changeOrigin: true,
        },
      },
    },
  };
});

