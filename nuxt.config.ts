import process from 'node:process'

const { PRODUCTION, SITE_URL, MONGO_URL, MONGO_USERNAME, MONGO_PASSWORD, MONGO_DB_NAME, DEV_URL, DEV_KEY, DEV_CERT } = process.env

export default defineNuxtConfig({
  modules: ['nuxt-auth-utils', '@nuxtjs/seo', '@nuxtjs/tailwindcss', 'nuxt-gtag', 'nuxt-security', 'nuxt-primevue', 'nuxt-icon'],

  app: {
    head: { templateParams: { separator: '•' } },
    pageTransition: { name: 'slide-left', mode: 'out-in' },
  },

  robots: { disallow: ['/lista', '/obrigado', '/login'] },
  css: ['~/assets/global.css', 'primevue/resources/primevue.min.css', 'primevue/resources/themes/aura-light-green/theme.css'],

  site: {
    url: SITE_URL,
    name: 'Explotools Brasil | Ferramentas para Sondagem',
    description: 'Líder na América Latina em materiais de sondagem. Com 20 anos de experiência, alta tecnologia e presença em mais de 13 países, oferecemos produtos de qualidade importada a preços competitivos. Aumente sua produtividade e eficiência com nossa inovação',
    identity: { type: 'Organization' },
  },

  imports: {
    imports: [
      { name: 'useToast', from: 'primevue/usetoast' },
      { name: 'FilterMatchMode', from: 'primevue/api' },
    ],
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
    https: DEV_KEY && DEV_CERT ? { key: DEV_KEY, cert: DEV_CERT } : false,
  },

  devtools: { enabled: true },
  compatibilityDate: '2024-08-19',
})
