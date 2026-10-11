import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'

/**
 * Social previews need absolute URLs. Set SITE_URL at build time (e.g. SITE_URL=https://anaskhan.dev npm run build)
 * to emit absolute og:image / twitter:image plus canonical and og:url. Without it, paths stay root-relative.
 */
function siteUrl(): Plugin {
  const url = (process.env.SITE_URL || '').replace(/\/$/, '')
  return {
    name: 'site-url',
    transformIndexHtml(html) {
      let out = html.replaceAll('%SITE_URL%', url)
      if (url) {
        out = out.replace(
          '</head>',
          `    <link rel="canonical" href="${url}/" />\n    <meta property="og:url" content="${url}/" />\n  </head>`,
        )
      }
      return out
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), siteUrl()],
  build: {
    target: 'es2022',
    cssMinify: true,
  },
})
