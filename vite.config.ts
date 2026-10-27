import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // '/' а не './': страница /u/<ник> иначе грузила бы скрипты из /u/assets/.
  base: '/',
  // inspectAttr только для dev-сервера: в сборке он вписал бы в разметку
  // абсолютные пути исходников на диске.
  plugins: [...(command === 'serve' ? [inspectAttr()] : []), react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
