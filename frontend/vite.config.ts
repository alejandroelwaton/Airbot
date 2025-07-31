import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
            tailwindcss()
  ],
  server: {
      allowedHosts: ["9ee2f4ce0360.ngrok-free.app"]
  }

})
