import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  base: '/', // ✅ Set base path
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // ✅ Ensure `@` maps correctly
    }
  },
  server: {
    port: 5173, // ✅ Set a fixed port
  }
});
