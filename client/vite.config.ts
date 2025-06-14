// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  // configurações opcionais aqui
  resolve: {
    alias: {
      "@": "/src", // se quiser usar import de '@/types'
    },
  },
});
