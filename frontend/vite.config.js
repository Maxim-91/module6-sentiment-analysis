import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    // Дозволяємо хост Rahti
    allowedHosts: [
      'sentiment-analysis-ai-sentiment-analysis2.2.rahtiapp.fi'
    ],
    // Також важливо переконатися, що порт збігається
    port: 8080,
    host: true
  }
})
