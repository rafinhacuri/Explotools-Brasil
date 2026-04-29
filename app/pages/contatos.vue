<script setup lang="ts">
definePageMeta({
  colorMode: 'dark',
})

useHead({ title: 'Contatos' })

useSeoMeta({
  title: 'Contatos • Explotools Brasil',
  description: 'Fale conosco pelos nossos canais oficiais e conheça soluções de alta qualidade para mineração, sondagem e perfuração.'
})

// Canais oficiais — cada um com sua cor oficial de marca
const canais = [
  {
    href: 'https://wa.link/c1di0k',
    external: true,
    icon: 'i-simple-icons-whatsapp',
    name: 'WhatsApp',
    handle: 'Atendimento direto',
    brand: '#25D366'
  },
  {
    href: 'mailto:ramoncuri@explotools.com.br',
    external: false,
    icon: 'i-lucide-mail',
    name: 'E-mail',
    handle: 'ramoncuri@explotools.com.br',
    brand: '#FD0116'
  },
  {
    href: 'https://www.instagram.com/explotools.brasil?igsh=MWc2OHBxc3ozejhsdA==',
    external: true,
    icon: 'i-simple-icons-instagram',
    name: 'Instagram',
    handle: '@explotools.brasil',
    brand: '#E4405F'
  },
  {
    href: 'https://www.facebook.com/share/p1veqrfSK8BVwVUU/?mibextid=qi2Omg',
    external: true,
    icon: 'i-simple-icons-facebook',
    name: 'Facebook',
    handle: 'Página oficial',
    brand: '#1877F2'
  },
  {
    href: 'https://www.linkedin.com/in/explotools-brasil-b6ba58273',
    external: true,
    icon: 'i-simple-icons-linkedin',
    name: 'LinkedIn',
    handle: 'Perfil corporativo',
    brand: '#0A66C2'
  },
  {
    href: 'https://maps.app.goo.gl/FGUcQ1ZqUXyxKMsT8',
    external: true,
    icon: 'i-simple-icons-googlemaps',
    name: 'Google Maps',
    handle: 'Localização',
    brand: '#EA4335'
  },
  {
    href: 'https://www.tiktok.com/@explotools.brasil?_t=8pFnT9iDWli&_r=1',
    external: true,
    icon: 'i-simple-icons-tiktok',
    name: 'TikTok',
    handle: '@explotools.brasil',
    brand: '#FE2C55'
  }
]

// Helper para converter hex em RGB e gerar a string rgba
function hexToRgb(hex: string) {
  const v = hex.replace('#', '')
  const r = parseInt(v.substring(0, 2), 16)
  const g = parseInt(v.substring(2, 4), 16)
  const b = parseInt(v.substring(4, 6), 16)
  return `${r},${g},${b}`
}

function cardStyle(brand: string) {
  const rgb = hexToRgb(brand)
  return {
    '--brand': brand,
    '--brand-bg': `rgba(${rgb},0.12)`,
    '--brand-glow': `rgba(${rgb},0.3)`
  }
}
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-[#050505] text-white font-[Inter]">

    <div class="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(253,1,22,0.12),transparent_60%)]" />

    <!-- ═══════════════ HERO — 1 coluna, centralizado ═══════════════ -->
    <section class="relative overflow-hidden px-6 pb-25 pt-45 text-center">
      <div class="pointer-events-none absolute left-1/2 top-0 z-0 h-150 w-200 -translate-x-1/2 bg-[radial-gradient(ellipse_50%_50%,rgba(253,1,22,0.18),transparent_60%)]" />

      <UContainer class="relative z-10">
        <div class="mb-8 inline-flex items-center gap-3 rounded-full border border-red-500/40 bg-red-500/10 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
          <span class="size-1.5 animate-pulse rounded-full bg-red-500 ring-4 ring-red-500/25" />
          EXPLOTOOLS BRASIL
        </div>

        <h1 class="mx-auto mb-7 max-w-[14ch] font-[Barlow_Condensed] text-[clamp(48px,6vw,84px)] font-black leading-none tracking-tight">
          <span class="bg-linear-to-br from-white via-red-100 to-red-500 bg-clip-text text-transparent">Entre em</span>
          Contato.
        </h1>

        <p class="mx-auto mb-11 max-w-150 text-[clamp(15px,1.3vw,18px)] leading-[1.65] text-white/70">
          Fale conosco pelos nossos canais oficiais e conheça <strong class="font-semibold text-white">soluções de alta qualidade</strong> para mineração, sondagem e perfuração.
        </p>

        <div class="flex flex-wrap justify-center gap-3">
          <UButton
            to="https://wa.link/c1di0k"
            external
            target="_blank"
            size="lg"
            color="error"
            icon="i-simple-icons-whatsapp"
            class="font-semibold tracking-wide shadow-[0_6px_24px_rgba(253,1,22,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(253,1,22,0.55)]"
          >
            Falar no WhatsApp
          </UButton>
          <UButton
            to="mailto:ramoncuri@explotools.com.br"
            size="lg"
            variant="soft"
            color="neutral"
            icon="i-lucide-mail"
            class="font-semibold tracking-wide backdrop-blur-sm hover:bg-white/15"
          >
            Enviar e-mail
          </UButton>
        </div>
      </UContainer>
    </section>

    <!-- ═══════════════ CANAIS OFICIAIS ═══════════════ -->
    <section class="relative py-25">
      <UContainer class="relative z-10">
        <div class="mx-auto mb-16 max-w-175 text-center">
          <div class="mb-5 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-red-500 before:block before:h-px before:w-6 before:bg-red-500 after:block after:h-px after:w-6 after:bg-red-500">
            Canais oficiais
          </div>
          <h2 class="mb-5 font-[Barlow_Condensed] text-[clamp(34px,4vw,52px)] font-extrabold leading-[0.95] tracking-tight">
            Escolha a melhor forma de falar com a Explotools.
          </h2>
        </div>

        <div class="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
          <a
            v-for="c in canais"
            :key="c.name"
            :href="c.href"
            :target="c.external ? '_blank' : undefined"
            :rel="c.external ? 'noopener noreferrer' : undefined"
            class="channel-card group relative flex flex-col items-center gap-4 overflow-hidden rounded-2xl border border-white/8 bg-white/2 p-8 text-center transition-all duration-400 hover:-translate-y-1.5"
            :style="cardStyle(c.brand)"
          >
            <span class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,var(--brand-bg),transparent_70%)] opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

            <div class="channel-icon-wrap relative flex size-16 items-center justify-center rounded-2xl text-(--brand) transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3 group-hover:text-white">
              <UIcon :name="c.icon" class="size-7" />
            </div>

            <div class="relative font-[Barlow_Condensed] text-[22px] font-bold uppercase tracking-[0.04em] text-white">
              {{ c.name }}
            </div>

            <div class="relative break-all text-xs font-medium tracking-wide text-white/45">
              {{ c.handle }}
            </div>
          </a>
        </div>
      </UContainer>
    </section>

    <!-- ═══════════════ ATENDIMENTO ESPECIALIZADO ═══════════════ -->
    <section class="relative pb-25 pt-10">
      <UContainer class="relative z-10">
        <div class="relative mx-auto max-w-230 overflow-hidden rounded-3xl border border-red-500/25 bg-linear-to-br from-[#0a0a0a] to-[#1a0606] p-12 text-center md:p-14">
          <div class="pointer-events-none absolute -top-1/2 left-1/2 h-125 w-150 -translate-x-1/2 bg-[radial-gradient(ellipse_50%_50%,rgba(253,1,22,0.18),transparent_60%)]" />

          <div class="relative">
            <div class="mb-5 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-red-500 before:block before:h-px before:w-6 before:bg-red-500 after:block after:h-px after:w-6 after:bg-red-500">
              Atendimento especializado
            </div>
            <h2 class="mb-5 font-[Barlow_Condensed] text-[clamp(32px,4vw,46px)] font-extrabold leading-tight tracking-tight">
              Suporte para quem opera no campo.
            </h2>
            <p class="mx-auto mb-9 max-w-130 text-base leading-[1.65] text-white/75">
              Suporte para ferramentas de sondagem, produtos técnicos e soluções para operações de campo.
            </p>

            <div class="mx-auto mb-8 grid max-w-130 grid-cols-1 gap-3 text-left sm:grid-cols-2">
              <div class="flex items-center gap-3.5 rounded-[10px] border border-white/8 bg-white/4 px-5 py-4 transition-all duration-300 hover:border-red-500/30 hover:bg-white/6">
                <div class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                  <UIcon name="i-lucide-mail" class="size-4" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="mb-0.5 text-[10px] uppercase tracking-[0.18em] text-white/45">E-mail</div>
                  <a href="mailto:ramoncuri@explotools.com.br" class="wrap-break-word text-sm font-medium text-white transition-colors hover:text-red-500">
                    ramoncuri@explotools.com.br
                  </a>
                </div>
              </div>

              <div class="flex items-center gap-3.5 rounded-[10px] border border-white/8 bg-white/4 px-5 py-4 transition-all duration-300 hover:border-red-500/30 hover:bg-white/6">
                <div class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                  <UIcon name="i-lucide-map-pin" class="size-4" />
                </div>
                <div>
                  <div class="mb-0.5 text-[10px] uppercase tracking-[0.18em] text-white/45">Localização</div>
                  <div class="text-sm font-medium text-white">Brasil</div>
                </div>
              </div>
            </div>

            <UButton
              to="https://wa.link/c1di0k"
              external
              target="_blank"
              color="error"
              size="lg"
              icon="i-simple-icons-whatsapp"
              class="px-9 py-4.5 font-semibold uppercase tracking-[0.06em] shadow-[0_6px_24px_rgba(253,1,22,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(253,1,22,0.55)]"
            >
              Falar no WhatsApp
            </UButton>
          </div>
        </div>
      </UContainer>
    </section>

  </div>
</template>

<style scoped>
/* Background do ícone que muda no hover usando CSS variables */
.channel-card .channel-icon-wrap {
  background: var(--brand-bg);
}
.channel-card:hover .channel-icon-wrap {
  background: var(--brand);
  box-shadow: 0 8px 24px var(--brand-glow);
}
.channel-card:hover {
  border-color: var(--brand);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), 0 0 30px var(--brand-glow);
}
</style>
