// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({ 
      template: { transformAssetUrls }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    })
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  esbuild: {
    supported: {
      bigint: true
    }
  },
  server: {
    // https://stackoverflow.com/questions/74625283/vue3-vite-hot-reload-hmr-no-working-in-the-browser
    watch: {
      usePolling: true,
    },
    // we need this for docker (as well)
    // no!, we don't need this for docker. We will have static files served by nginx
    host: '0.0.0.0',
    port: 8080,
    // in production proxy will be done by nginx
    proxy: {
      '/graphql': {
        target: 'http://localhost:4000',
        // target: 'http://192.168.1.91:4000',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/graphql/, ''),
      },
    }
  },
  
})
