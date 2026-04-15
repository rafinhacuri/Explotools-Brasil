import process from 'node:process'

const { NUXT_PUBLIC_PRODUCTION, NUXT_PUBLIC_SITE_URL, NUXT_MONGO_URL, NUXT_MONGO_USERNAME, NUXT_MONGO_PASSWORD, NUXT_MONGO_DB_NAME, DEV_URL, DEV_KEY, DEV_CERT } = process.env

export default defineNuxtConfig({
  modules: ['nuxt-auth-utils', '@nuxtjs/seo', 'nuxt-security', '@nuxt/ui', '@vueuse/nuxt', 'nuxt-aos', '@nuxt/image', '@nuxt/content', 'nuxt-studio'],
  devtools: { enabled: true },
  app: {
    head: {
      templateParams: { separator: '•' },
      meta: [{ name: 'facebook-domain-verification', content: '2aur1h4ul3t9qi39592a7ogeuekoig' }],
      script: [
        {
          id: 'meta-pixel',
          type: 'text/javascript',
          innerHTML: `!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1809820002998809')`,
        },
      ],
      noscript: [
        {
          innerHTML: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1809820002998809&ev=PageView&noscript=1" />`,
        },
      ],
    },
  },
  css: ['~/assets/global.css'],
  site: {
    name: 'Explotools Brasil | Ferramentas para Sondagem',
    description: 'Líder na América Latina em materiais de sondagem. Com 20 anos de experiência, alta tecnologia e presença em mais de 13 países, oferecemos produtos de qualidade importada a preços competitivos. Aumente sua produtividade e eficiência com nossa inovação',
    identity: { type: 'Organization' },
  },
  runtimeConfig: {
    MONGO_URL: NUXT_MONGO_URL,
    MONGO_USERNAME: NUXT_MONGO_USERNAME,
    MONGO_PASSWORD: NUXT_MONGO_PASSWORD,
    MONGO_DB_NAME: NUXT_MONGO_DB_NAME,
    public: { PRODUCTION: NUXT_PUBLIC_PRODUCTION, SITE_URL: NUXT_PUBLIC_SITE_URL },
  },
  devServer: {
    host: DEV_URL,
    https: DEV_KEY && DEV_CERT ? { key: DEV_KEY, cert: DEV_CERT } : false,
  },
  compatibilityDate: '2025-08-06',
  nitro: { experimental: { asyncContext: true } },
  linkChecker: { enabled: false },
  robots: { disallow: ['/lead', '/obrigado', '/login'] },
  security: NUXT_PUBLIC_PRODUCTION === 'true'
    ? {
        headers: {
          crossOriginEmbedderPolicy: 'require-corp',
          contentSecurityPolicy: {
            'img-src': ['\'self\'', 'data:', 'https://www.facebook.com', 'https://www.facebook.net'],
            'script-src': ['\'self\'', '\'unsafe-inline\'', 'https://connect.facebook.net', 'https://va.vercel-scripts.com'],
            'connect-src': ['\'self\'', 'https://www.facebook.com', 'https://www.facebook.net', 'https://capig.madgicx.ai'],
          },
        },
      }
    : {
        headers: {
          crossOriginEmbedderPolicy: 'unsafe-none',
          contentSecurityPolicy: {
            'img-src': ['\'self\'', 'data:', 'blob:', 'https:'],
            'script-src': ['\'self\'', '\'unsafe-inline\'', '\'unsafe-eval\'', '\'wasm-unsafe-eval\'', 'https:'],
            'style-src': ['\'self\'', '\'unsafe-inline\'', 'https:'],
            'font-src': ['\'self\'', 'data:', 'https:'],
            'connect-src': ['\'self\'', 'ws:', 'wss:', 'https:'],
            'worker-src': ['\'self\'', 'blob:'],
          },
        },
      },
  studio: {
    route: '/admin',
    i18n: {
      defaultLocale: 'pt-br',
    },
    repository: {
      provider: 'github',
      owner: 'rafinhacuri',
      repo: 'Explotools-Brasil',
      branch: 'main',
    },
},
})
