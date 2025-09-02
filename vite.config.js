import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: false, // Permite fallback para 5174 se 5173 estiver ocupada
    host: true, // Permite acesso externo
  },
  define: {
    // Definir variáveis de ambiente para produção
    'import.meta.env.VITE_API_URL': JSON.stringify('https://goldeouro-backend.onrender.com'),
    'import.meta.env.VITE_ADMIN_TOKEN': JSON.stringify('adm_8d1e3c7a5b9f2a4c6e0d1f3b7a9c5e2d'),
  },
});
