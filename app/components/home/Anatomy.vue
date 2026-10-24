<script setup lang="ts">
  import { useMotionValueEvent, useScroll } from 'motion-v'

  const text = {
    eyebrow: 'Anatomia do barrilete',
    title: 'Peça por peça, do cabo à rocha.',
    lede: 'Um conjunto interno wireline em vista explodida. Passe o mouse sobre as peças — cada uma corresponde a uma linha que fabricamos.',
    line: 'Linha',
  }

  const parts = [
    {
      name: 'Pino lança',
      line: 'Overshots',
      to: '/produtos#overshots',
      description: 'Ponto de engate do overshot para içar o conjunto pelo cabo.',
    },
    {
      name: 'Cabeçote',
      line: 'Cabeçotes',
      to: '/produtos#cabecotes',
      description: 'Trava o conjunto interno no barrilete e o libera no resgate.',
    },
    {
      name: 'Mola',
      line: 'Molas e caixas de mola',
      to: '/produtos#molas',
      description: 'Mantém a pressão e o alinhamento do conjunto durante a perfuração.',
    },
    {
      name: 'Caixa de mola',
      line: 'Molas e caixas de mola',
      to: '/produtos#molas',
      description: 'Abriga a mola com tolerância controlada para não travar em campo.',
    },
    {
      name: 'Tubo interno',
      line: 'Acessórios de sondagem',
      to: '/produtos#acessorios',
      description: 'Recebe e protege o testemunho enquanto a coroa avança.',
    },
    {
      name: 'Extrator',
      line: 'Molas e caixas de mola',
      to: '/produtos#molas',
      description: 'Prende o testemunho na hora de quebrar e recuperar a amostra.',
    },
    {
      name: 'Coroa',
      line: 'Seleção de matriz',
      to: '/selecao-matriz',
      description: 'Corta a rocha. A matriz certa depende da dureza e da abrasividade da formação.',
    },
  ]

  const section = useTemplateRef<HTMLElement>('section')
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const progress = ref(0)
  const hovered = ref(-1)
  const anchor = ref<{ x: number; y: number } | null>(null)

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    progress.value = value
  })

  const explode = computed(() => clamp(progress.value / 0.14))
  const scrolled = computed(() =>
    Math.min(
      parts.length - 1,
      Math.max(0, Math.floor(((progress.value - 0.14) / 0.84) * parts.length)),
    ),
  )
  const focus = computed(() => (hovered.value >= 0 ? hovered.value : scrolled.value))
  const current = computed(() => pick(parts, focus.value))
</script>

<template>
  <section ref="section" class="relative h-[360vh] bg-furo">
    <div class="sticky top-0 grid h-dvh overflow-hidden lg:grid-cols-[0.85fr_1.15fr]">
      <div
        aria-hidden="true"
        class="absolute inset-0 bg-[radial-gradient(ellipse_45%_60%_at_68%_50%,rgb(254_0_24/0.13)_0%,transparent_70%)]" />
      <div
        aria-hidden="true"
        class="absolute inset-0 bg-[linear-gradient(rgb(242_240_236/0.035)_1px,transparent_1px),linear-gradient(90deg,rgb(242_240_236/0.035)_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_70%_at_65%_50%,#000_30%,transparent_80%)] bg-size-[48px_48px]" />

      <div
        class="relative z-10 flex flex-col justify-center px-5 pt-20 sm:px-8 lg:pl-[max(2rem,calc((100vw-90rem)/2+2rem))]">
        <Eyebrow :depth="520">{{ text.eyebrow }}</Eyebrow>
        <h2 class="mt-5 display text-headline text-balance">{{ text.title }}</h2>
        <p class="mt-4 hidden max-w-md text-[0.9375rem] text-muted sm:block">{{ text.lede }}</p>

        <ol class="mt-8 hidden flex-col lg:flex">
          <li v-for="(part, index) in parts" :key="part.name">
            <NuxtLink
              :to="part.to"
              class="group flex items-baseline gap-4 border-b border-line py-2.5 transition-colors"
              :class="focus === index ? 'text-fg' : 'text-faint hover:text-fg/80'"
              @pointerenter="hovered = index"
              @pointerleave="hovered = -1"
              @focus="hovered = index"
              @blur="hovered = -1">
              <span
                class="w-6 font-mono text-[0.75rem] tabular-nums"
                :class="focus === index ? 'text-red' : ''">
                {{ String(index + 1).padStart(2, '0') }}
              </span>
              <span class="display text-[1.75rem] leading-none">{{ part.name }}</span>
              <Icon
                name="ph:arrow-up-right"
                class="ml-auto size-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </NuxtLink>
          </li>
        </ol>
      </div>

      <div class="absolute inset-0 lg:relative">
        <HomeAssemblyStage
          :explode="explode"
          :active="focus"
          @hover="hovered = $event"
          @anchor="anchor = $event" />

        <div
          v-if="anchor"
          aria-hidden="true"
          class="pointer-events-none absolute hidden transition-[left,top] duration-300 ease-out-quint lg:block"
          :style="{ left: `${anchor.x}px`, top: `${anchor.y}px` }">
          <span
            class="absolute -top-3 -left-3 size-6 animate-ping rounded-full border border-red/60" />
          <span
            class="absolute -top-1 -left-1 size-2 rounded-full bg-red shadow-[0_0_12px_#fe0018]" />
        </div>
      </div>

      <div
        class="absolute inset-x-5 bottom-8 z-10 sm:inset-x-8 lg:top-1/2 lg:right-16 lg:bottom-auto lg:left-auto lg:w-[22rem] lg:-translate-y-1/2">
        <Transition
          mode="out-in"
          enter-active-class="transition duration-300 ease-out-quint"
          enter-from-class="translate-y-3 opacity-0 blur-sm"
          leave-active-class="transition duration-150"
          leave-to-class="opacity-0">
          <div :key="current.name" class="rounded-2xl border border-line glass p-5">
            <p class="label text-red">{{ text.line }} · {{ current.line }}</p>
            <p class="mt-2 display text-[2rem] leading-none">{{ current.name }}</p>
            <p class="mt-2 text-[0.9375rem] text-muted">{{ current.description }}</p>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>
