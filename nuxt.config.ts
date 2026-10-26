import process from 'node:process'

import tailwindcss from '@tailwindcss/vite'

const { DEV_URL, DEV_KEY, DEV_CERT } = process.env

export default defineNuxtConfig({
  modules: [
    '@nuxt/image',
    '@nuxtjs/seo',
    '@vueuse/nuxt',
    'nuxt-security',
    'nuxt-auth-utils',
    '@vercel/analytics',
    '@vercel/speed-insights',
    '@nuxt/a11y',
    '@nuxt/hints',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/scripts',
    'reka-ui/nuxt',
    'motion-v/nuxt',
  ],
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      templateParams: { separator: '•' },
      meta: [
        { name: 'theme-color', content: '#0a0a0b' },
        { name: 'facebook-domain-verification', content: '2aur1h4ul3t9qi39592a7ogeuekoig' },
      ],
    },
  },
  css: ['~/assets/main.css'],
  site: {
    url: 'https://explotools.com.br/',
    name: 'Explotools Brasil',
    description:
      'Fabricante de ferramentas e consumíveis para sondagem diamantada wireline. Overshots, cabeçotes, molas, cabeças d’água e acessórios nos diâmetros BO, NO, HO e PO, com qualidade de importado a preço nacional.',
    identity: { type: 'Organization' },
    defaultLocale: 'pt-BR',
  },
  runtimeConfig: {
    mongoUrl: '',
    mongoDbName: 'explotools',
    public: { siteUrl: 'https://explotools.com.br' },
  },
  routeRules: {
    '/api/**': { security: { rateLimiter: { tokensPerInterval: 120, interval: 60_000 } } },
    '/api/_nuxt_icon/**': { security: { rateLimiter: false } },
    '/api/auth/**': { security: { rateLimiter: { tokensPerInterval: 10, interval: 300_000 } } },
    '/api/setup': { security: { rateLimiter: { tokensPerInterval: 10, interval: 300_000 } } },
  },
  devServer: {
    host: DEV_URL,
    https: DEV_KEY && DEV_CERT ? { key: DEV_KEY, cert: DEV_CERT } : undefined,
  },
  compatibilityDate: '2026-10-24',
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['three', 'three/addons/environments/RoomEnvironment.js', 'lenis'],
    },
  },
  fonts: {
    families: [
      {
        name: 'Saira',
        provider: 'google',
        global: true,
        weights: ['400 900'],
        styles: ['normal', 'italic'],
        subsets: ['latin', 'latin-ext'],
        providerOptions: { google: { experimental: { variableAxis: { wdth: [['50', '125']] } } } },
      },
      {
        name: 'Archivo',
        provider: 'google',
        global: true,
        weights: ['300 700'],
        styles: ['normal'],
        subsets: ['latin', 'latin-ext'],
      },
      {
        name: 'JetBrains Mono',
        provider: 'google',
        global: true,
        weights: ['400 600'],
        styles: ['normal'],
        subsets: ['latin'],
      },
    ],
  },
  icon: {
    cssLayer: 'base',
    serverBundle: { collections: ['ph', 'simple-icons'] },
  },
  linkChecker: { enabled: false },
  robots: { disallow: ['/lead', '/obrigado', '/login', '/adm'] },
  scripts: {
    registry: {
      metaPixel: { id: '1809820002998809', bundle: false, proxy: false, trigger: 'onNuxtReady' },
    },
  },
  security: {
    rateLimiter: false,
    headers: {
      contentSecurityPolicy: {
        'img-src': ["'self'", 'data:', 'blob:', 'https:'],
        'script-src': [
          "'self'",
          'https:',
          "'unsafe-inline'",
          "'strict-dynamic'",
          "'nonce-{{nonce}}'",
          "'wasm-unsafe-eval'",
        ],
        'connect-src': ["'self'", 'https:', 'wss:'],
        'media-src': ["'self'", 'blob:'],
        'worker-src': ["'self'", 'blob:'],
        'frame-src': ["'self'"],
        'object-src': ["'self'"],
      },
      crossOriginEmbedderPolicy: false,
    },
  },
  sitemap: { exclude: ['/lead', '/obrigado', '/login', '/adm', '/selecao-matriz/**'] },
})
