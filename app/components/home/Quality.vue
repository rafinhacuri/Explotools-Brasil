<script setup lang="ts">
  import { useMotionValueEvent, useScroll, useTransform } from 'motion-v'

  import { quality } from '~/data/content'

  const text = {
    eyebrow: 'Qualidade de ponta a ponta',
    title: 'Qualidade não é um departamento.',
    lede: 'É como a empresa inteira funciona. Do desenho técnico à expedição, cada etapa passa por controle rigoroso.',
    proof:
      'Na nossa última pesquisa de satisfação, 100% dos clientes avaliaram a qualidade dos nossos produtos com nota 4 ou 5, em uma escala de 1 a 5 — e não tivemos nenhum detrator.',
    punch: 'Esse resultado não veio de marketing. Veio do campo.',
  }

  const steps = useTemplateRef<HTMLElement>('steps')
  const { scrollYProgress } = useScroll({ target: steps, offset: ['start 80%', 'end 55%'] })
  const fill = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const lit = ref(0)

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    lit.value = Math.floor(value * quality.length + 0.25)
  })
</script>

<template>
  <section class="relative bg-osso py-24 text-furo sm:py-36">
    <div class="mx-auto max-w-[90rem] px-5 sm:px-8">
      <div class="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <Reveal>
          <Eyebrow :depth="1040" tone="ink">{{ text.eyebrow }}</Eyebrow>
          <h2 class="mt-5 display text-display text-balance">{{ text.title }}</h2>
        </Reveal>
        <Reveal :delay="0.1">
          <p class="text-lede text-furo/70">{{ text.lede }}</p>
        </Reveal>
      </div>

      <div ref="steps" class="relative mt-20">
        <div
          aria-hidden="true"
          class="absolute top-6 right-0 left-0 hidden h-0.5 bg-furo/10 lg:block">
          <Motion class="h-full bg-red" :style="{ width: fill }" />
        </div>
        <div aria-hidden="true" class="absolute top-0 bottom-0 left-6 w-0.5 bg-furo/10 lg:hidden">
          <Motion class="w-full bg-red" :style="{ height: fill }" />
        </div>

        <ol class="grid gap-10 lg:grid-cols-4 lg:gap-8">
          <li
            v-for="(step, index) in quality"
            :key="step.title"
            class="relative flex gap-6 lg:flex-col">
            <span
              class="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border-2 transition-[background-color,border-color,color] duration-500"
              :class="
                index < lit ? 'border-red bg-red text-osso' : 'border-furo/15 bg-osso text-furo/50'
              ">
              <Icon :name="step.icon" class="size-5" />
            </span>
            <div>
              <p class="font-mono text-[0.75rem] text-furo/45 tabular-nums">
                Etapa {{ index + 1 }}
              </p>
              <h3 class="mt-1 text-title font-semibold">{{ step.title }}</h3>
              <p class="mt-2 text-[0.9375rem] text-furo/65">{{ step.description }}</p>
            </div>
          </li>
        </ol>
      </div>

      <Reveal class="mt-24">
        <div
          class="relative grid overflow-hidden rounded-[2rem] bg-red p-8 text-osso sm:p-14 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-16">
          <svg
            :viewBox="MARK_VIEWBOX"
            aria-hidden="true"
            class="pointer-events-none absolute -right-10 -bottom-16 h-[140%] w-auto text-red-deep/60">
            <path fill="currentColor" :d="MARK_PATH" />
          </svg>
          <p class="relative display text-[clamp(6rem,16vw,14rem)] leading-[0.8]">
            <Counter :to="100" suffix="%" :duration="2" />
          </p>
          <div class="relative mt-6 lg:mt-0">
            <p class="max-w-xl text-lede">{{ text.proof }}</p>
            <p class="mt-6 display text-[clamp(1.75rem,3vw,2.5rem)] leading-none">
              {{ text.punch }}
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
</template>
