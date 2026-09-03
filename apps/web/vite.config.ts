import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig, loadEnv } from 'vite'

const normalizeBasePath = (value: string | undefined) => {
  if (!value || value === '/') {
    return ''
  }

  return `/${value.replace(/^\/+|\/+$/g, '')}`
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const defaultBasePath = mode === 'production' ? '/dashboard' : ''
  const configuredBasePath = env.VITE_APP_BASE_PATH ?? defaultBasePath
  const basePath = normalizeBasePath(configuredBasePath)

  return {
    base: basePath ? `${basePath}/` : '/',
    plugins: [
      tailwindcss(),
      tanstackStart(),
      nitro({ baseURL: basePath || '/' }),
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
