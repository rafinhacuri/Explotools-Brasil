<script setup lang="ts">
  import { useScroll, useSpring, useTransform } from 'motion-v'

  import { brand, categories, photoById } from '~/data/content'

  const text = {
    eyebrow: 'O que fabricamos',
    title: 'Ferramentas e consumíveis para wireline.',
    lede: 'Nosso portfólio cobre as principais categorias de ferramentas e consumíveis para sondagem wireline, em todos os diâmetros padrão.',
    lines: 'linhas de produto',
    drag: 'Continue rolando',
    endTitle: 'Não revendemos. Nós fabricamos.',
    endText:
      'Cada peça é projetada internamente, fabricada com matéria-prima selecionada e testada antes de sair da fábrica.',
    all: 'Ver todos os produtos',
    catalog: 'Baixar catálogo 2025',
  }

  const section = useTemplateRef<HTMLElement>('section')
  const track = useTemplateRef<HTMLElement>('track')
  const { width } = useWindowSize()
  const distance = ref(0)

  useResizeObserver(track, () => {
    distance.value = Math.max((track.value?.scrollWidth ?? 0) - width.value, 0)
  })

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.4 })
  const x = useTransform(smooth, (value) => -value * distance.value)
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  const lines = categories.map((category, index) => ({
    id: category.id,
    name: category.name,
    short: category.short,
    description: category.description,
    icon: category.icon,
    index,
    cover: photoById(category.photos[0] ?? 1),
    rest: category.photos.slice(1, 4).map((id) => photoById(id)),
  }))
</script>

<template>
  <section id="produtos" ref="section" class="relative h-[620vh] bg-furo">
    <div class="sticky top-0 flex h-dvh flex-col overflow-hidden">
      <Motion class="h-full w-max" :style="{ x }">
        <div ref="track" class="flex h-full w-max items-stretch">
          <div
            class="flex w-[92vw] shrink-0 flex-col justify-center px-5 sm:w-[70vw] sm:px-8 lg:w-[56vw] lg:pl-[max(2rem,calc((100vw-90rem)/2+2rem))]">
            <Eyebrow :depth="120">{{ text.eyebrow }}</Eyebrow>
            <h2 class="mt-6 display text-display text-balance">{{ text.title }}</h2>
            <p class="mt-6 max-w-md text-lede text-muted">{{ text.lede }}</p>
            <div class="mt-10 flex items-end gap-4">
              <span class="display text-[6rem] leading-[0.8] text-red">{{
                categories.length
              }}</span>
              <span class="pb-2 label text-fg/70"
                >{{ text.lines }}<br />{{ brand.diameters.join(' · ') }}</span
              >
            </div>
            <p class="mt-12 flex items-center gap-3 label text-faint">
              <Icon name="ph:arrow-down" class="size-3.5 animate-bounce" />
              {{ text.drag }}
            </p>
          </div>

          <article
            v-for="line in lines"
            :key="line.id"
            class="group relative flex w-[88vw] shrink-0 items-center px-3 sm:w-[78vw] lg:w-[64vw] lg:px-6">
            <div
              class="relative grid h-[78dvh] w-full overflow-hidden rounded-[2rem] border border-line bg-rocha lg:grid-cols-[1fr_1.1fr]">
              <div class="relative z-10 flex flex-col justify-between p-6 sm:p-10">
                <div class="flex items-center justify-between">
                  <span
                    class="flex size-12 items-center justify-center rounded-2xl bg-red/12 text-red ring-1 ring-red/30">
                    <Icon :name="line.icon" class="size-6" />
                  </span>
                  <span class="font-mono text-[0.75rem] text-faint tabular-nums">
                    {{ String(line.index + 1).padStart(2, '0') }} /
                    {{ String(lines.length).padStart(2, '0') }}
                  </span>
                </div>
                <div>
                  <p class="label text-red">{{ line.short }}</p>
                  <h3 class="mt-3 display text-headline">{{ line.name }}</h3>
                  <p class="mt-4 max-w-sm text-[0.9375rem] text-muted sm:text-base">
                    {{ line.description }}
                  </p>
                  <NuxtLink
                    :to="{ path: '/produtos', hash: `#${line.id}` }"
                    class="mt-6 inline-flex items-center gap-2 text-[0.875rem] font-semibold text-fg transition-colors hover:text-red">
                    Ver a linha
                    <Icon
                      name="ph:arrow-right"
                      class="size-4 transition-transform group-hover:translate-x-1" />
                  </NuxtLink>
                </div>
              </div>

              <div
                class="absolute inset-0 overflow-hidden lg:left-[42%] lg:mask-[linear-gradient(90deg,transparent_0%,#000_45%)]">
                <img
                  :src="line.cover.src"
                  :alt="line.cover.title"
                  loading="lazy"
                  class="size-full origin-right object-cover opacity-35 transition-transform duration-[1.4s] ease-out-quint group-hover:scale-105 lg:opacity-100" />
                <div
                  class="absolute inset-0 bg-linear-to-r from-rocha via-rocha/40 to-transparent lg:hidden" />
                <div class="absolute right-5 bottom-5 hidden gap-2 lg:flex">
                  <NuxtImg
                    v-for="(photo, p) in line.rest"
                    :key="photo.id"
                    :src="photo.src"
                    width="320"
                    densities="x1"
                    :alt="photo.title"
                    loading="lazy"
                    class="size-20 rounded-xl object-cover ring-1 ring-fg/15 transition-transform duration-500 ease-spring group-hover:-translate-y-2"
                    :style="{ transitionDelay: `${p * 60}ms` }" />
                </div>
              </div>
            </div>
          </article>

          <div
            class="flex w-[92vw] shrink-0 flex-col justify-center px-6 sm:w-[70vw] lg:w-[48vw] lg:px-14">
            <svg :viewBox="MARK_VIEWBOX" class="h-20 w-auto self-start text-red" aria-hidden="true">
              <path fill="currentColor" :d="MARK_PATH" />
            </svg>
            <h3 class="mt-8 display text-display text-balance">{{ text.endTitle }}</h3>
            <p class="mt-6 max-w-md text-lede text-muted">{{ text.endText }}</p>
            <div class="mt-10 flex flex-wrap gap-3">
              <Btn to="/produtos" size="lg" trailing="ph:arrow-right">{{ text.all }}</Btn>
              <Btn
                to="/catalogos/catalogo2025.pdf"
                size="lg"
                variant="ghost"
                icon="ph:download-simple"
                external>
                {{ text.catalog }}
              </Btn>
            </div>
          </div>
        </div>
      </Motion>

      <div class="absolute inset-x-5 bottom-6 h-px bg-line sm:inset-x-8">
        <Motion class="h-full bg-red" :style="{ width: bar }" />
      </div>
    </div>
  </section>
</template>
