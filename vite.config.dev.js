import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Configuração para DESENVOLVIMENTO - SEM SEGURANÇA
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Usar HTML de desenvolvimento sem CSP
  root: '.',
  publicDir: 'public',
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    hmr: {
      overlay: true // Mostra erros na tela
    },
    // SEM CSP - Desenvolvimento livre
    cors: true,
    // Headers mínimos para desenvolvimento
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  },
  define: {
    // Variáveis de ambiente para desenvolvimento local
    'import.meta.env.VITE_API_URL': JSON.stringify('http://localhost:3000'),
    'import.meta.env.VITE_ADMIN_TOKEN': JSON.stringify('adm_8d1e3c7a5b9f2a4c6e0d1f3b7a9c5e2d'),
    'import.meta.env.DEV': JSON.stringify(true),
    'import.meta.env.PROD': JSON.stringify(false)
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true, // Source maps para debug
    minify: false, // Sem minificação para debug
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
          utils: ['axios']
        }
      }
    }
  },
  // Configurações de desenvolvimento
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'lucide-react', 'axios']
  },
  esbuild: {
    // Manter console.log para debug
    drop: []
  }
});
