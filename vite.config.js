import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {localStudioAPI} from './designer/local-api.mjs';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins:[localStudioAPI(root)],
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        design: resolve(root, 'design.html'),
        campus: resolve(root, 'campus.html'),
        handmade: resolve(root, 'handmade.html'),
        policies: resolve(root, 'policies.html'),
        admin: resolve(root, 'admin.html')
      }
    }
  }
});
