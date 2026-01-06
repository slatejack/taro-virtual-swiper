import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/style.ts'],
      outDir: 'dist',
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        style: resolve(__dirname, 'src/style.ts'),
      },
      name: 'TaroVirtualSwiper',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        if (entryName === 'style') {
          return `style.${format === 'es' ? 'mjs' : 'cjs'}`;
        }
        return `index.${format === 'es' ? 'mjs' : 'cjs'}`;
      },
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        '@tarojs/taro',
        '@tarojs/components',
        '@tarojs/runtime',
        '@tarojs/react',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@tarojs/taro': 'Taro',
          '@tarojs/components': 'TaroComponents',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'style.css';
          }
          return assetInfo.name || 'assets/[name]-[hash][extname]';
        },
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
  },
});
