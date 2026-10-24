<script setup lang="ts">
  import { useMotionValueEvent, useScroll, useTransform } from 'motion-v'

  import { brand, catalogs, categories, photos } from '~/data/content'

  const text = {
    title: 'Produtos',
    description:
      'Linha completa de ferramentas e consumíveis para sondagem wireline: overshots, cabeçotes, molas, cabeças d’água, cortadores, peças para bombas e acessórios. Baixe os catálogos técnicos.',
    eyebrow: 'Produtos Explotools',
    heading: ['Ferramentas', 'de sondagem', 'para alta', 'performance.'],
    lede: 'Linha técnica para mineração, sondagem e perfuração, com qualidade, resistência e suporte especializado.',
    quote: 'Solicite um orçamento',
    catalog: 'Baixar catálogo 2025',
    hint: 'Clique numa peça para ampliar',
    galleryEyebrow: 'Linha Explotools',
    galleryTitle: 'Produtos para sondagem.',
    galleryLede: 'Ferramentas e consumíveis para operações wireline em todos os diâmetros padrão.',
    all: 'Todos',
    downloads: 'Downloads',
    catalogsTitle: 'Catálogos técnicos.',
    catalogsLede: 'Baixe nossos materiais e consulte os produtos disponíveis.',
    pdf: 'Baixar PDF',
    help: 'Precisa de ajuda para escolher o produto certo?',
    helpStrong: 'Fale direto com um vendedor',
    helpTail: '— atendimento técnico no mesmo dia.',
    seller: 'Falar com vendedor',
  }

  const highlights = [
    {
      icon: 'ph:hammer',
      title: 'Alta resistência',
      description: 'Ferramentas preparadas para operações exigentes.',
    },
    {
      icon: 'ph:shield-check',
      title: 'Qualidade técnica',
      description: 'Produtos pensados para segurança e durabilidade.',
    },
    {
      icon: 'ph:chat-circle-text',
      title: 'Atendimento comercial',
      description: 'Solicite orçamento e suporte para sua demanda.',
    },
  ]

  useHead({ title: text.title })
  useSeoMeta({ description: text.description })
  defineOgImage('Explotools.takumi', {
    title: 'Ferramentas de sondagem para alta performance.',
    description: text.galleryLede,
  })

  const hero = useTemplateRef<HTMLElement>('hero')
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] })
  const progress = ref(0)
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    progress.value = value
  })
  const textY = useTransform(scrollYProgress, (value) => -120 * band(value, 0, 0.6))
  const textOpacity = useTransform(scrollYProgress, (value) => 1 - band(value, 0, 0.5))

  const filter = ref('todos')
  const lightbox = ref<number | null>(null)
  const route = useRoute()

  const visible = computed(() =>
    filter.value === 'todos' ? photos : photos.filter((photo) => photo.category === filter.value),
  )
  const img = useImage()
  const sources = photos.map((photo) => img(photo.src, { width: 640 }))

  function openPhoto(id: number): void {
    filter.value = 'todos'
    lightbox.value = photos.findIndex((photo) => photo.id === id)
  }

  function openVisible(index: number): void {
    const photo = visible.value[index]
    if (photo) lightbox.value = photos.findIndex((item) => item.id === photo.id)
  }

  onMounted(() => {
    const hash = route.hash.slice(1)
    if (!categories.some((category) => category.id === hash)) return
    filter.value = hash
    void nextTick(() => document.querySelector('#galeria')?.scrollIntoView({ behavior: 'smooth' }))
  })
</script>

<template>
  <div>
    <section ref="hero" class="relative h-[200vh]">
      <div class="sticky top-0 h-dvh overflow-hidden">
        <div
          aria-hidden="true"
          class="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_70%_50%,rgb(254_0_24/0.16)_0%,transparent_70%)]" />
        <div class="absolute inset-0">
          <ProdutosHelixStage
            :progress="progress"
            :sources="sources"
            @open="(index: number) => openPhoto(index + 1)" />
        </div>

        <Motion
          class="pointer-events-none relative mx-auto flex h-full max-w-[90rem] flex-col justify-end px-5 pb-12 sm:px-8 lg:justify-center lg:pb-0"
          :style="{ y: textY, opacity: textOpacity }">
          <Motion
            as="p"
            class="label text-red"
            :initial="{ opacity: 0, y: 8 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6, delay: 0.2 }">
            {{ text.eyebrow }}
          </Motion>
          <h1 class="mt-5 display text-[clamp(3.5rem,min(10vw,15dvh),9.5rem)] leading-[0.84]">
            <span v-for="(line, index) in text.heading" :key="line" class="block overflow-hidden">
              <Motion
                as="span"
                class="block"
                :class="index === 3 ? 'text-red' : ''"
                :initial="{ y: '105%' }"
                :animate="{ y: '0%' }"
                :transition="{
                  type: 'spring',
                  bounce: 0.1,
                  duration: 1.2,
                  delay: 0.3 + index * 0.08,
                }">
                {{ line }}
              </Motion>
            </span>
          </h1>
          <Motion
            as="p"
            class="mt-6 max-w-md text-lede text-muted"
            :initial="{ opacity: 0, y: 12 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.8, delay: 0.8 }">
            {{ text.lede }}
          </Motion>
          <Motion
            class="pointer-events-auto mt-8 flex flex-wrap gap-3"
            :initial="{ opacity: 0, y: 12 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.8, delay: 0.95 }">
            <Btn :to="brand.whatsapp" size="lg" icon="simple-icons:whatsapp">{{ text.quote }}</Btn>
            <Btn
              to="/catalogos/catalogo2025.pdf"
              external
              size="lg"
              variant="ghost"
              icon="ph:download-simple">
              {{ text.catalog }}
            </Btn>
          </Motion>
          <p class="mt-8 hidden items-center gap-2 label text-faint lg:flex">
            <Icon name="ph:cursor-click" class="size-4" />
            {{ text.hint }}
          </p>
        </Motion>
      </div>
    </section>

    <section id="galeria" class="relative bg-furo py-20 sm:py-28">
      <div class="mx-auto max-w-[90rem] px-5 sm:px-8">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <Eyebrow>{{ text.galleryEyebrow }}</Eyebrow>
            <h2 class="mt-5 display text-display">{{ text.galleryTitle }}</h2>
          </Reveal>
          <Reveal :delay="0.1">
            <p class="max-w-md text-lede text-muted">{{ text.galleryLede }}</p>
          </Reveal>
        </div>

        <div
          class="sticky top-20 z-20 -mx-5 mt-10 no-scrollbar overflow-x-auto px-5 py-3 sm:mx-0 sm:px-0">
          <div class="inline-flex gap-1 rounded-full border border-line glass p-1" role="tablist">
            <button
              v-for="option in [{ id: 'todos', name: text.all }, ...categories]"
              :key="option.id"
              :id="option.id === 'todos' ? undefined : option.id"
              type="button"
              role="tab"
              :aria-selected="filter === option.id"
              class="relative h-10 shrink-0 rounded-full px-4 text-[0.8125rem] font-medium whitespace-nowrap transition-colors"
              :class="filter === option.id ? 'text-osso' : 'text-muted hover:text-fg'"
              @click="filter = option.id">
              <Motion
                v-if="filter === option.id"
                layout-id="filter-pill"
                class="absolute inset-0 rounded-full bg-red"
                :transition="{ type: 'spring', bounce: 0.18, duration: 0.5 }" />
              <span class="relative">{{ option.name }}</span>
            </button>
          </div>
        </div>

        <Motion
          as="ul"
          layout
          class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          <AnimatePresence :initial="false">
            <Motion
              v-for="(photo, index) in visible"
              :key="photo.id"
              as="li"
              layout
              :initial="{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }"
              :animate="{ opacity: 1, scale: 1, filter: 'blur(0px)' }"
              :exit="{ opacity: 0, scale: 0.9 }"
              :transition="{ type: 'spring', bounce: 0.15, duration: 0.6 }">
              <Tilt class="aspect-square">
                <button
                  type="button"
                  class="group relative block size-full overflow-hidden rounded-2xl border border-line bg-rocha text-left"
                  @click="openVisible(index)">
                  <NuxtImg
                    :src="photo.src"
                    width="320"
                    :alt="photo.title"
                    loading="lazy"
                    class="size-full object-cover transition-transform duration-700 ease-out-quint group-hover:scale-110" />
                  <span
                    class="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-furo/95 via-furo/30 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:p-4">
                    <span class="text-[0.875rem] font-semibold">{{ photo.title }}</span>
                    <span class="mt-0.5 label text-[0.625rem] text-fg/60">
                      {{ categories.find((category) => category.id === photo.category)?.short }}
                    </span>
                  </span>
                  <Icon
                    name="ph:arrows-out-simple"
                    class="absolute top-3 right-3 size-4 text-osso opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              </Tilt>
            </Motion>
          </AnimatePresence>
        </Motion>
      </div>
    </section>

    <section class="relative bg-furo pb-20 sm:pb-28">
      <div class="mx-auto grid max-w-[90rem] gap-px overflow-hidden px-5 sm:px-8 md:grid-cols-3">
        <Reveal
          v-for="(item, index) in highlights"
          :key="item.title"
          :delay="index * 0.08"
          class="border-t border-line py-10 md:border-t-0 md:border-l md:px-8 md:first:border-l-0 md:first:pl-0">
          <Icon :name="item.icon" class="size-9 text-red" />
          <h3 class="mt-6 display text-[2.25rem] leading-none">{{ item.title }}</h3>
          <p class="mt-3 text-[0.9375rem] text-muted">{{ item.description }}</p>
        </Reveal>
      </div>
    </section>

    <section class="relative bg-osso py-20 text-furo sm:py-28">
      <div class="mx-auto max-w-[90rem] px-5 sm:px-8">
        <Reveal>
          <Eyebrow tone="ink">{{ text.downloads }}</Eyebrow>
          <h2 class="mt-5 display text-display">{{ text.catalogsTitle }}</h2>
          <p class="mt-4 text-lede text-furo/70">{{ text.catalogsLede }}</p>
        </Reveal>

        <div class="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Reveal v-for="(catalog, index) in catalogs" :key="catalog.id" :delay="index * 0.06">
            <Tilt :max="6" class="h-full">
              <a
                :href="catalog.pdf"
                target="_blank"
                rel="noopener"
                class="group flex h-full flex-col overflow-hidden rounded-3xl bg-furo text-fg shadow-float">
                <span class="relative block aspect-4/5 overflow-hidden">
                  <img
                    :src="catalog.cover"
                    :alt="catalog.title"
                    loading="lazy"
                    class="size-full object-cover transition-transform duration-700 ease-out-quint group-hover:scale-105" />
                  <span
                    v-if="catalog.badge"
                    class="absolute top-4 left-4 rounded-full bg-red px-3 py-1 label text-osso">
                    {{ catalog.badge }}
                  </span>
                </span>
                <span class="flex flex-1 flex-col p-6">
                  <span class="display text-[1.75rem] leading-none">{{ catalog.title }}</span>
                  <span class="mt-2 flex-1 text-[0.875rem] text-muted">{{
                    catalog.description
                  }}</span>
                  <span
                    class="mt-6 inline-flex items-center gap-2 text-[0.875rem] font-semibold text-red">
                    <Icon
                      name="ph:download-simple"
                      class="size-4 transition-transform group-hover:translate-y-0.5" />
                    {{ text.pdf }}
                  </span>
                </span>
              </a>
            </Tilt>
          </Reveal>
        </div>

        <Reveal class="mt-14">
          <div
            class="flex flex-col gap-6 rounded-3xl border border-furo/10 bg-osso-2 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <p class="max-w-2xl text-lede text-furo/80">
              {{ text.help }} <strong class="font-semibold text-furo">{{ text.helpStrong }}</strong>
              {{ text.helpTail }}
            </p>
            <Btn :to="brand.whatsapp" size="lg" icon="ph:chat-circle-dots">{{ text.seller }}</Btn>
          </div>
        </Reveal>
      </div>
    </section>

    <ProdutosLightbox v-model:index="lightbox" :photos="photos" />
  </div>
</template>
