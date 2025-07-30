import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
            tailwindcss()
  ],
  server: {
      allowedHosts: ['fdf09e503c17.ngrok-free.app']
  }

})
