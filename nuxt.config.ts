import process from 'node:process'

const { PRODUCTION, SITE_URL, MONGO_URL, MONGO_USERNAME, MONGO_PASSWORD, MONGO_DB_NAME, DEV_URL, DEV_KEY, DEV_CERT } = process.env

export default defineNuxtConfig({
  modules: ['@nuxt/ui', 'nuxt-auth-utils', '@nuxtjs/seo', 'nuxt-gtag', 'nuxt-security'],
  app: {
    head: { templateParams: { separator: '•' } },
    pageTransition: { name: 'slide-left', mode: 'out-in' },
  },
  css: ['~/assets/global.css'],
  site: {
    url: SITE_URL,
    name: 'Explotools Brasil',
    description: 'Nossa proposta é oferecer produtos de qualidade importada para sondagem a preços acessíveis, permitindo uma redução de custos significativa sem comprometer a qualidade e a produtividade',
    identity: { type: 'Organization' },
    twitter: '@cbpf_mcti',
  },
  security: { headers: { crossOriginEmbedderPolicy: PRODUCTION === 'true' ? 'require-corp' : 'unsafe-none' } },
  linkChecker: { enabled: false },
  runtimeConfig: {
    MONGO_URL,
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_DB_NAME,
    session: { maxAge: 8 * 60 * 60 },
    public: {
      PRODUCTION,
      SITE_URL,
    },
  },
  devServer: {
    host: DEV_URL,
    https: { key: DEV_KEY, cert: DEV_CERT },
  },
  devtools: { enabled: true },
})
