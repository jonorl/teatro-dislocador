import { defineConfig, type Connect, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from "fs"
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// Cloudflare Pages serves public/privacidad.html at /privacidad. Vite would hand that URL to the React app instead
// (a blank page, as the router only knows /), so dev and preview get the same rewrite.
const prettyHtmlUrls = (): Plugin => {
  const rewrite = (dir: string): Connect.NextHandleFunction => (req, _res, next) => {
    const pathname = req.url?.split("?")[0] ?? ""
    if (/^\/[a-z0-9-]+$/i.test(pathname) && fs.existsSync(path.join(dir, `${pathname}.html`))) {
      req.url = req.url!.replace(pathname, `${pathname}.html`)
    }
    next()
  }
  return {
    name: "pretty-html-urls",
    configureServer(server) {
      server.middlewares.use(rewrite(path.resolve(import.meta.dirname, "public")))
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite(path.resolve(import.meta.dirname, "dist")))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), prettyHtmlUrls()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
  proxy: {
    '/classes': 'http://localhost:3000',   // your backend port
    '/showcase': 'http://localhost:3000',
    '/gallery': 'http://localhost:3000'
  }
}
})

