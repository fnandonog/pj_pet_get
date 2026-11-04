import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// configuração do vite: usa o react e o tailwind
// o front roda na porta 3000 (a mesma que liberamos no cors da API)
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 3000 },
})
