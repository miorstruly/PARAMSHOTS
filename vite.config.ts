import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// Pages that go into sitemap.xml (keep in sync with the routes in src/App.tsx; the 404 page is left out on purpose).
const SITEMAP_PATHS = ['/', '/transfer', '/privacy-policy', '/terms-and-conditions']

/**
 * Adds the SEO items that need the public site address: canonical link, og:url, og:image, twitter:image,
 * JSON-LD structured data, robots.txt and sitemap.xml.
 * Set VITE_SITE_URL (for example https://www.example.com) in your host's environment settings or a local .env file.
 * If it is not set, the build still works; those address-based items are simply left out
 * (the app still fills in canonical and og tags in the browser from the current address).
 */
function siteSeo(siteUrl: string): Plugin {
  const site = siteUrl.trim().replace(/\/+$/, '')
  return {
    name: 'site-seo',
    transformIndexHtml() {
      const tags: Array<{ tag: string; attrs: Record<string, string>; children?: string; injectTo: 'head' }> = []
      if (site) {
        tags.push(
          { tag: 'link', attrs: { rel: 'canonical', href: `${site}/` }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:url', content: `${site}/` }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:image', content: `${site}/og-image.jpg` }, injectTo: 'head' },
          { tag: 'meta', attrs: { name: 'twitter:image', content: `${site}/og-image.jpg` }, injectTo: 'head' },
        )
      }
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'ParamShots',
        alternateName: 'ParamShots Pampanga Phone for Rent',
        description:
          'Phone rental service in Pampanga, Philippines. Rent a flagship iPhone 17 Pro Max for concerts, travel, weddings and content creation.',
        ...(site ? { url: `${site}/`, logo: `${site}/apple-touch-icon.png`, image: `${site}/og-image.jpg` } : {}),
        email: 'paramshots@gmail.com',
        telephone: '+63 906 548 4327',
        priceRange: '₱1,500–₱2,500 per day',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Guagua',
          addressRegion: 'Pampanga',
          addressCountry: 'PH',
        },
        areaServed: { '@type': 'AdministrativeArea', name: 'Pampanga' },
        sameAs: ['https://www.facebook.com/profile.php?id=61578515921428'],
      }
      tags.push({
        tag: 'script',
        attrs: { type: 'application/ld+json' },
        // "<" is escaped so the JSON can never close the script tag early.
        children: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        injectTo: 'head',
      })
      return tags
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: ['User-agent: *', 'Allow: /', ...(site ? ['', `Sitemap: ${site}/sitemap.xml`] : []), ''].join('\n'),
      })
      if (!site) return
      const urls = SITEMAP_PATHS.map((p) => `  <url><loc>${site}${p === '/' ? '/' : p}</loc></url>`).join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })
    },
  }
}

// Vite config — https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [react(), tailwindcss(), siteSeo(env.VITE_SITE_URL ?? '')],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    server: {
      port: 5173,
    },
  }
})
