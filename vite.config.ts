import { resolve } from 'node:path';

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts';
import tsConfigPaths from 'vite-tsconfig-paths';
import * as packageJson from './package.json';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
// https://vitejs.dev/config/
export default defineConfig((configEnv) => ({
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
    tsConfigPaths(),
    dts({
      include: ['src/components/'],
    }),
  ],
  build: {
    lib: {
      entry: resolve('src', 'components/index.ts'),
      name: 'ReactCrossFade',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies)],
    },
  },
}))
