import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT for GitHub Pages: a "project site" (username.github.io/REPO_NAME)
// is served from a subfolder, not the domain root, so base is set to the
// repo name below (phannguyenhanh186/hocvoihanh -> /hocvoihanh/).
// If you deploy to Vercel/Netlify instead, change this back to base: '/'.
export default defineConfig({
  plugins: [react()],
  base: '/hocvoihanh/',
})
