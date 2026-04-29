<script setup lang="ts">
definePageMeta({
  colorMode: 'dark',
})

useHead({ title: 'Produtos' })

useSeoMeta({
  title: 'Produtos • Explotools Brasil',
  description: 'Conheça nossa linha de produtos técnicos para mineração, sondagem e perfuração, com qualidade, resistência e suporte especializado.'
})

const produtos = [
  {
    num: '01',
    src: '/produtos/1.jpg',
    title: 'Linha Explotools',
    subtitle: 'Produtos para sondagem'
  },
  {
    num: '02',
    src: '/produtos/2.jpg',
    title: 'Linha Explotools',
    subtitle: 'Produtos para sondagem'
  },
  {
    num: '03',
    src: '/produtos/3.jpg',
    title: 'Linha Explotools',
    subtitle: 'Produtos para sondagem'
  },
  {
    num: '04',
    src: '/produtos/4.png',
    title: 'Linha Explotools',
    subtitle: 'Produtos para sondagem'
  },
  {
    num: '05',
    src: '/produtos/5.png',
    title: 'Linha Explotools',
    subtitle: 'Produtos para sondagem'
  },
  {
    num: '06',
    src: '/produtos/6.jpg',
    title: 'Linha Explotools',
    subtitle: 'Produtos para sondagem'
  },
  {
    num: '07',
    src: '/produtos/7.jpg',
    title: 'Linha Explotools',
    subtitle: 'Produtos para sondagem'
  },
  {
    num: '08',
    src: '/produtos/8.jpg',
    title: 'Linha Explotools',
    subtitle: 'Produtos para sondagem'
  },
  {
    num: '09',
    src: '/produtos/9.png',
    title: 'Linha Explotools',
    subtitle: 'Produtos para sondagem'
  },
  {
    num: '10',
    src: '/produtos/10.jpeg',
    title: 'Linha Explotools',
    subtitle: 'Produtos para sondagem'
  },
  {
    num: '11',
    src: '/produtos/11.jpeg',
    title: 'Linha Explotools',
    subtitle: 'Produtos para sondagem'
  },
  {
    num: '12',
    src: '/produtos/12.jpg',
    title: 'Linha Explotools',
    subtitle: 'Produtos para sondagem'
  },
  {
    num: '13',
    src: '/produtos/13.jpg',
    title: 'Linha Explotools',
    subtitle: 'Produtos para sondagem'
  },
  {
    num: '14',
    src: '/produtos/14.png',
    title: 'Linha Explotools',
    subtitle: 'Produtos para sondagem'
  },
  {
    num: '15',
    src: '/produtos/15.png',
    title: 'Linha Explotools',
    subtitle: 'Produtos para sondagem'
  },
  {
    num: '16',
    src: '/produtos/16.jpeg',
    title: 'Linha Explotools',
    subtitle: 'Produtos para sondagem'
  },
  {
    num: '17',
    src: '/produtos/17.jpg',
    title: 'Linha Explotools',
    subtitle: 'Produtos para sondagem'
  },
  {
    num: '18',
    src: '/produtos/18.jpg',
    title: 'Linha Explotools',
    subtitle: 'Produtos para sondagem'
  },
  {
    num: '19',
    src: '/produtos/19.jpg',
    title: 'Linha Explotools',
    subtitle: 'Produtos para sondagem'
  },
  {
    num: '20',
    src: '/produtos/20.jpg',
    title: 'Linha Explotools',
    subtitle: 'Produtos para sondagem'
  },
  {
    num: '21',
    src: '/produtos/21.jpg',
    title: 'Linha Explotools',
    subtitle: 'Produtos para sondagem'
  },
  {
    num: '22',
    src: '/produtos/22.jpg',
    title: 'Linha Explotools',
    subtitle: 'Produtos para sondagem'
  },
  {
    num: '23',
    src: '/produtos/23.jpg',
    title: 'Linha Explotools',
    subtitle: 'Produtos para sondagem'
  },
  {
    num: '24',
    src: '/produtos/24.jpg',
    title: 'Linha Explotools',
    subtitle: 'Produtos para sondagem'
  },
  {
    num: '25',
    src: '/produtos/25.jpg',
    title: 'Linha Explotools',
    subtitle: 'Produtos para sondagem'
  },
  {
    num: '26',
    src: '/produtos/26.jpg',
    title: 'Linha Explotools',
    subtitle: 'Produtos para sondagem'
  },
  {
    num: '27',
    src: '/produtos/27.jpg',
    title: 'Linha Explotools',
    subtitle: 'Produtos para sondagem'
  },
  {
    num: '28',
    src: '/produtos/28.jpg',
    title: 'Linha Explotools',
    subtitle: 'Produtos para sondagem'
  },
  {
    num: '29',
    src: '/produtos/29.jpg',
    title: 'Linha Explotools',
    subtitle: 'Produtos para sondagem'
  },
  {
    num: '30',
    src: '/produtos/30.jpg',
    title: 'Linha Explotools',
    subtitle: 'Produtos para sondagem'
  }
]

// Destaques
const destaques = [
  {
    num: '01',
    icon: 'i-lucide-hammer',
    title: 'Alta resistência',
    desc: 'Ferramentas preparadas para operações exigentes.'
  },
  {
    num: '02',
    icon: 'i-lucide-shield-check',
    title: 'Qualidade técnica',
    desc: 'Produtos pensados para segurança e durabilidade.'
  },
  {
    num: '03',
    icon: 'i-lucide-message-square',
    title: 'Atendimento comercial',
    desc: 'Solicite orçamento e suporte para sua demanda.'
  }
]

// Catálogos
const catalogos = [
  {
    badge: 'Novo',
    title: 'Catálogo 2025',
    desc: 'Linha atualizada de ferramentas Explotools.',
    cover: '/catalogos/catalogo2025foto.png',
    pdf: '/catalogos/catalogo2025.pdf'
  },
  {
    title: 'Catálogo Técnico 1',
    desc: 'Produtos e soluções para sondagem.',
    cover: '/catalogos/catalogo1foto.jpeg',
    pdf: '/catalogos/catalogo1.pdf'
  },
  {
    title: 'Catálogo Técnico 2',
    desc: 'Equipamentos de alta resistência.',
    cover: '/catalogos/catalogo2foto.jpeg',
    pdf: '/catalogos/catalogo2.pdf'
  },
  {
    title: 'Catálogo Técnico 3',
    desc: 'Ferramentas para operação em campo.',
    cover: '/catalogos/catalogo3foto.jpeg',
    pdf: '/catalogos/catalogo3.pdf'
  }
]
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-[#050505] text-white font-[Inter]">

    <div class="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(253,1,22,0.12),transparent_60%)]" />

    <!-- ═══════════════ HERO ═══════════════ -->
    <section class="relative flex min-h-[calc(100vh-70px)] items-center overflow-hidden px-6 pt-35 pb-20">
      <div class="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_30%,rgba(253,1,22,0.18),transparent_60%),radial-gradient(ellipse_50%_40%_at_10%_80%,rgba(253,1,22,0.08),transparent_60%)]" />

      <UContainer class="relative z-10 grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-18">

        <div class="max-w-160">
          <div class="mb-8 inline-flex items-center gap-3 rounded-full border border-red-500/40 bg-red-500/10 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
            <span class="size-1.5 animate-pulse rounded-full bg-red-500 ring-4 ring-red-500/25" />
            PRODUTOS EXPLOTOOLS
          </div>

          <h1 class="mb-7 font-[Barlow_Condensed] text-[clamp(36px,4.5vw,64px)] font-extrabold leading-[1.02] tracking-tight">
            <span class="bg-linear-to-br from-white via-red-100 to-red-500 bg-clip-text text-transparent">Ferramentas de sondagem</span>
            para alta performance.
          </h1>

          <p class="mb-9 text-[clamp(15px,1.2vw,17px)] leading-[1.65] text-white/70">
            Conheça nossa linha de produtos técnicos para mineração, sondagem e perfuração, com <strong class="font-semibold text-white">qualidade, resistência e suporte especializado</strong>.
          </p>

          <div class="flex flex-wrap gap-3">
            <UButton
              to="https://wa.link/c1di0k"
              external
              target="_blank"
              size="lg"
              color="error"
              class="font-semibold tracking-wide shadow-[0_6px_24px_rgba(253,1,22,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(253,1,22,0.55)]"
              trailing-icon="i-lucide-arrow-right"
            >
              Solicite um orçamento
            </UButton>
            <UButton
              to="/catalogos/catalogo2025.pdf"
              external
              target="_blank"
              size="lg"
              variant="soft"
              color="neutral"
              class="font-semibold tracking-wide backdrop-blur-sm hover:bg-white/15"
              icon="i-lucide-download"
            >
              Baixar catálogo 2025
            </UButton>
          </div>
        </div>

        <!-- Imagem destaque -->
        <div class="relative aspect-4/5 overflow-hidden rounded-2xl border border-red-500/20 shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_60px_rgba(253,1,22,0.15)] lg:max-h-155">
          <div class="absolute left-4 top-4 z-30 size-8 border-l-2 border-t-2 border-red-500" />
          <div class="absolute bottom-4 right-4 z-30 size-8 border-b-2 border-r-2 border-red-500" />
          <div class="absolute inset-0 z-20 bg-linear-to-t from-[#050505]/40 to-transparent pointer-events-none" />
          <NuxtImg
            src="/produtos/1.jpg"
            alt="Imagem destaque dos produtos Explotools"
            class="size-full object-cover"
            loading="eager"
          />
        </div>

      </UContainer>
    </section>

    <!-- ═══════════════ GALERIA DE 30 PRODUTOS ═══════════════ -->
    <section class="relative py-30">
      <UContainer class="relative z-10">
        <div class="mb-14 flex flex-wrap items-end justify-between gap-8">
          <div>
            <div class="mb-5 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-red-500 before:block before:h-px before:w-7 before:bg-red-500">
              Linha Explotools
            </div>
            <h2 class="font-[Barlow_Condensed] text-[clamp(36px,4.5vw,56px)] font-extrabold leading-[0.95] tracking-tight">
              Produtos para sondagem.
            </h2>
          </div>
          <p class="max-w-110 text-[17px] leading-[1.65] text-white/70">
            Linha completa de ferramentas e consumíveis para operações de sondagem wireline em todos os diâmetros padrão.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
          <a
            v-for="p in produtos"
            :key="p.num"
            :href="p.src"
            target="_blank"
            class="group relative aspect-square overflow-hidden rounded-xl border border-white/6 bg-[#0a0a0a] transition-all duration-400 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-[0_12px_32px_rgba(0,0,0,0.4),0_0_24px_rgba(253,1,22,0.2)]"
          >
            <span class="absolute left-3 top-3 z-10 flex size-7 items-center justify-center rounded-md border border-red-500/30 bg-black/70 font-[Barlow_Condensed] text-xs font-bold tracking-wide text-red-500 backdrop-blur">
              {{ p.num }}
            </span>
            <NuxtImg
              :src="p.src"
              :alt="`Produto ${p.num} — ${p.title}`"
              class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div class="absolute inset-0 z-2 flex flex-col justify-end bg-linear-to-t from-[#050505]/95 via-[#050505]/40 to-transparent p-4 opacity-0 transition-opacity duration-400 group-hover:opacity-100">
              <h4 class="mb-1 text-sm font-semibold">{{ p.title }}</h4>
              <p class="text-[11px] uppercase tracking-[0.12em] text-white/60">{{ p.subtitle }}</p>
            </div>
          </a>
        </div>
      </UContainer>
    </section>

    <div class="mx-6 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

    <!-- ═══════════════ 3 DESTAQUES ═══════════════ -->
    <section class="relative bg-linear-to-b from-transparent to-[#140505]/40 py-30">
      <UContainer class="relative z-10">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          <div
            v-for="d in destaques"
            :key="d.num"
            class="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/2 p-10 transition-all duration-400 hover:-translate-y-1 hover:border-red-500/30 hover:bg-white/4"
          >
            <span class="pointer-events-none absolute right-8 top-6 font-[Barlow_Condensed] text-[88px] font-black leading-none text-white/5 transition-colors duration-400 group-hover:text-red-500/15">
              {{ d.num }}
            </span>
            <div class="mb-7 flex size-12 items-center justify-center rounded-[12px] border border-red-500/25 bg-red-500/10 text-red-500 transition-all duration-300 group-hover:scale-105 group-hover:bg-red-500/20">
              <UIcon :name="d.icon" class="size-5" />
            </div>
            <h3 class="relative z-10 mb-2.5 text-2xl font-bold leading-tight">{{ d.title }}</h3>
            <p class="relative z-10 text-sm leading-relaxed text-white/65">{{ d.desc }}</p>
          </div>
        </div>
      </UContainer>
    </section>

    <div class="mx-6 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

    <!-- ═══════════════ CATÁLOGOS TÉCNICOS ═══════════════ -->
    <section class="relative py-30">
      <UContainer class="relative z-10">
        <div class="mb-8">
          <div class="mb-5 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-red-500 before:block before:h-px before:w-7 before:bg-red-500">
            Downloads
          </div>
          <h2 class="mb-6 font-[Barlow_Condensed] text-[clamp(36px,4.5vw,56px)] font-extrabold leading-[0.95] tracking-tight">
            Catálogos técnicos.
          </h2>
          <p class="text-[17px] leading-[1.65] text-white/70">
            Baixe nossos materiais e consulte os produtos disponíveis.
          </p>
        </div>

        <!-- CTA acima dos cards -->
        <div class="mb-10 flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-red-500/20 bg-linear-to-br from-red-500/8 to-red-500/2 px-7 py-6">
          <p class="min-w-60 flex-1 text-base text-white/85">
            Precisa de ajuda para escolher o produto certo? <strong class="font-semibold text-white">Fale direto com um vendedor</strong> — atendimento técnico no mesmo dia.
          </p>
          <UButton
            to="https://wa.link/c1di0k"
            external
            target="_blank"
            color="error"
            size="lg"
            icon="i-lucide-message-circle"
            class="font-semibold tracking-wide shadow-[0_6px_24px_rgba(253,1,22,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(253,1,22,0.55)]"
          >
            Falar com vendedor
          </UButton>
        </div>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <div
            v-for="c in catalogos"
            :key="c.title"
            class="group flex flex-col rounded-2xl border border-white/8 bg-white/2 p-6 transition-all duration-400 hover:-translate-y-1 hover:border-red-500/30 hover:bg-white/4"
          >
            <div class="relative mb-5">
              <span
                v-if="c.badge"
                class="absolute right-3 top-3 z-10 rounded bg-red-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white"
              >
                {{ c.badge }}
              </span>
              <NuxtImg
                :src="c.cover"
                :alt="c.title"
                class="aspect-3/4 w-full rounded-[10px] object-cover"
                loading="lazy"
              />
            </div>
            <h3 class="mb-1.5 text-xl font-bold">{{ c.title }}</h3>
            <p class="mb-5 flex-1 text-sm leading-relaxed text-white/60">{{ c.desc }}</p>
            <UButton
              :to="c.pdf"
              external
              target="_blank"
              variant="soft"
              color="error"
              icon="i-lucide-download"
              class="justify-center font-semibold uppercase tracking-[0.06em] hover:bg-red-500 hover:text-white"
              block
            >
              Baixar PDF
            </UButton>
          </div>
        </div>
      </UContainer>
    </section>

  </div>
</template>
