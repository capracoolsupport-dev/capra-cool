import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath } from "url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(projectRoot, "index.html"),
        policies: resolve(projectRoot, "policies.html"),
      },
    },
  },
});
