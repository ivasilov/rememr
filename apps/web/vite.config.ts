import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const basePath = env.VITE_APP_BASE_PATH ?? '/'

  return {
    base: basePath,
    plugins: [
      tailwindcss(),
      tanstackStart(),
      nitro({ baseURL: basePath }),
      viteReact(),
    ],
    resolve: {
      tsconfigPaths: true,
    },
    server: {
      port: 3001,
    },
  }
})
