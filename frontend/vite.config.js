import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { readFileSync } from 'node:fs'

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {

  defaultConfig = {
    plugins: [vue(), vueJsx()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    build: {
      rollupOptions: {
        external: [
          "node:axios"
        ]
      }
    }
  }

  const isDev = mode == "development"

  // Use this line to launch the server locally
  // certLocation = isDev ? "../bootstrap" : "/bootstrap"
  certLocation = "/bootstrap"

  return {
    ...defaultConfig,
    server: {
      host: true,
      port: 5000,
      https: {
        key: readFileSync(certLocation + '/web-server/certs/server.key', 'utf8'),
        cert: readFileSync(certLocation + '/web-server/certs/server.crt', 'utf8'),
        ca: readFileSync(certLocation + '/ca/server.crt', 'utf8')
      }
    },
    preview: {
      port: 5000
    }}
})
