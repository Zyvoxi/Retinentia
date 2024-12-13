import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
  plugins: [
    react({
      plugins: [['@swc/plugin-styled-components', { displayName: true }]],
    }),
    createHtmlPlugin({
      inject: {
        injectData: {
          title: 'Retinentia by Zyvoxi',
        },
      },
      minify: true, // Minifica o HTML gerado
    }),
  ],
  base: '/retinentia',
  build: {
    target: 'es2022',
    sourcemap: true,
    minify: 'esbuild',
    chunkSizeWarningLimit: 512,
  },
});
