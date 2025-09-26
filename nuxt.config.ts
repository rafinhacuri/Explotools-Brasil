import process from 'node:process'

const { PRODUCTION, SITE_URL, MONGO_URL, MONGO_USERNAME, MONGO_PASSWORD, MONGO_DB_NAME, DEV_URL, DEV_KEY, DEV_CERT } = process.env

export default defineNuxtConfig({
  modules: ['nuxt-auth-utils', '@nuxtjs/seo', 'nuxt-security', '@nuxt/ui', '@vueuse/nuxt', 'nuxt-aos'],
  devtools: { enabled: true },
  app: {
    head: {
      templateParams: { separator: '•' },
      meta: [{ name: 'facebook-domain-verification', content: '2aur1h4ul3t9qi39592a7ogeuekoig' }],
    },
  },
  css: ['~/assets/global.css'],
  site: {
    url: SITE_URL,
    name: 'Explotools Brasil | Ferramentas para Sondagem',
    description: 'Líder na América Latina em materiais de sondagem. Com 20 anos de experiência, alta tecnologia e presença em mais de 13 países, oferecemos produtos de qualidade importada a preços competitivos. Aumente sua produtividade e eficiência com nossa inovação',
    identity: { type: 'Organization' },
  },
  runtimeConfig: {
    MONGO_URL,
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_DB_NAME,
    public: { PRODUCTION, SITE_URL },
  },
  devServer: {
    host: DEV_URL,
    https: DEV_KEY && DEV_CERT ? { key: DEV_KEY, cert: DEV_CERT } : false,
  },
  compatibilityDate: '2025-08-06',
  nitro: { experimental: { asyncContext: true } },
  linkChecker: { enabled: false },
  robots: { disallow: ['/lead', '/obrigado', '/login'] },
  security: { headers: { crossOriginEmbedderPolicy: PRODUCTION === 'true' ? 'require-corp' : 'unsafe-none' } },
})
