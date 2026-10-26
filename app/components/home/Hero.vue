<script setup lang="ts">
  import { useMotionValueEvent, useScroll, useTransform } from 'motion-v'

  import { brand } from '~/data/content'

  const text = {
    eyebrow: 'Ferramentas wireline · Brasil / Chile',
    lead: 'Ferramentas de sondagem',
    title: ['Sondagem', 'wireline'],
    tail: 'projetadas e fabricadas para o campo real.',
    lede: 'Fabricante de consumíveis e ferramentas para sondagem wireline, com qualidade de padrão internacional e atendimento ágil. Produtos de alta performance que reduzem horas paradas por quebra de ferramental, a preço competitivo.',
    products: 'Ver produtos',
    talk: 'Fale conosco',
    hintMouse: 'Passe o mouse no cabeçote',
    hintTouch: 'Toque no cabeçote',
    diameters: 'Diâmetros',
    scroll: 'Role para perfurar',
  }

  const section = useTemplateRef<HTMLElement>('section')
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] })
  const progress = ref(0)
  const rpm = ref(90)
  const hovering = ref(false)
  const fineQuery = useMediaQuery('(pointer: fine)')
  const mounted = useMounted()
  const fine = computed(() => !mounted.value || fineQuery.value)

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    progress.value = value
  })

  const lift = useTransform(scrollYProgress, [0, 1], [0, -180])
  const fade = useTransform(scrollYProgress, (value) => 1 - band(value, 0, 0.55))
  const sink = useTransform(scrollYProgress, (value) => 1 - band(value, 0.45, 0.85))
  const rpmLabel = computed(() => String(Math.round(rpm.value)).padStart(4, '0'))
</script>

<template>
  <section ref="section" class="relative h-[175vh]">
    <div class="sticky top-0 h-dvh overflow-hidden">
      <div
        aria-hidden="true"
        class="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_72%_45%,rgb(254_0_24/0.2)_0%,transparent_65%),radial-gradient(ellipse_80%_60%_at_10%_110%,rgb(254_0_24/0.1)_0%,transparent_60%)]" />
      <div aria-hidden="true" class="absolute inset-x-0 bottom-0 h-[38%] opacity-90">
        <Strata :layers="5" :seed="3" :depth="160" :vein="-1" />
      </div>
      <div aria-hidden="true" class="grain absolute inset-0" />

      <Motion class="absolute inset-0" :style="{ opacity: sink }">
        <HomeBitStage :progress="progress" @rpm="rpm = $event" @hover="hovering = $event" />
      </Motion>

      <Motion
        class="relative mx-auto flex h-full max-w-[90rem] flex-col justify-end px-5 pt-28 pb-10 sm:px-8 lg:justify-center lg:pb-16"
        :style="{ y: lift, opacity: fade }">
        <Motion
          as="p"
          class="flex items-center gap-3 label text-fg/70"
          :initial="{ opacity: 0, y: 8 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6, delay: 0.2 }">
          <span class="relative flex size-2">
            <span class="absolute inset-0 animate-ping rounded-full bg-red opacity-70" />
            <span class="relative size-2 rounded-full bg-red" />
          </span>
          {{ text.eyebrow }}
        </Motion>

        <h1 class="mt-6 max-w-[58rem]">
          <Motion
            as="span"
            class="block wide text-[clamp(0.8rem,1.4vw,1.05rem)] text-fg/80"
            :initial="{ opacity: 0, letterSpacing: '0.6em' }"
            :animate="{ opacity: 1, letterSpacing: '0.24em' }"
            :transition="{ duration: 1.4, delay: 0.35, ease: [0.22, 1, 0.36, 1] }">
            {{ text.lead }}
          </Motion>
          <span
            class="mt-3 block display text-[clamp(4.5rem,min(15vw,21dvh),13.5rem)] leading-[0.8]">
            <span
              v-for="(word, w) in text.title"
              :key="word"
              class="block overflow-hidden pb-[0.04em]">
              <Motion
                as="span"
                class="block"
                :class="w === 1 ? 'text-red' : 'text-fg'"
                :initial="{ y: '105%', rotate: 4 }"
                :animate="{ y: '0%', rotate: 0 }"
                :transition="{
                  type: 'spring',
                  bounce: 0.12,
                  duration: 1.3,
                  delay: 0.45 + w * 0.12,
                }">
                {{ word }}
              </Motion>
            </span>
          </span>
          <Motion
            as="span"
            class="mt-4 block max-w-xl text-title font-medium text-fg/90"
            :initial="{ opacity: 0, y: 14, filter: 'blur(8px)' }"
            :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
            :transition="{ type: 'spring', bounce: 0, duration: 1, delay: 0.85 }">
            {{ text.tail }}
          </Motion>
        </h1>

        <Motion
          as="p"
          class="mt-6 max-w-lg text-[0.9375rem] text-pretty text-muted sm:text-base"
          :initial="{ opacity: 0, y: 14 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ type: 'spring', bounce: 0, duration: 1, delay: 1 }">
          {{ text.lede }}
        </Motion>

        <Motion
          class="mt-8 flex flex-wrap items-center gap-3"
          :initial="{ opacity: 0, y: 12 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ type: 'spring', bounce: 0, duration: 0.9, delay: 1.15 }">
          <Magnet :strength="0.2">
            <Btn to="/produtos" size="lg" trailing="ph:arrow-right">{{ text.products }}</Btn>
          </Magnet>
          <Btn :to="brand.whatsapp" size="lg" variant="ghost" icon="simple-icons:whatsapp">{{
            text.talk
          }}</Btn>
        </Motion>

        <Motion
          class="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :transition="{ duration: 0.8, delay: 1.4 }">
          <div class="flex items-center gap-2">
            <span class="label text-faint">{{ text.diameters }}</span>
            <span
              v-for="diameter in brand.diameters"
              :key="diameter"
              class="rounded-md border border-line-strong px-2 py-1 font-mono text-[0.75rem] text-fg/80">
              {{ diameter }}
            </span>
          </div>
          <div class="flex items-center gap-3 font-mono text-[0.75rem] text-fg/70">
            <span class="label text-faint">RPM</span>
            <span class="tabular-nums" :class="hovering ? 'text-red' : ''">{{ rpmLabel }}</span>
            <span class="hidden text-faint sm:inline"
              >· {{ fine ? text.hintMouse : text.hintTouch }}</span
            >
          </div>
        </Motion>
      </Motion>

      <Motion
        as="p"
        aria-hidden="true"
        class="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 label text-faint lg:flex"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :transition="{ delay: 2, duration: 0.8 }"
        :style="{ opacity: fade }">
        {{ text.scroll }}
        <span class="relative h-10 w-px overflow-hidden bg-line-strong">
          <span class="absolute inset-x-0 top-0 h-1/2 animate-drill bg-red" />
        </span>
      </Motion>
    </div>
  </section>
</template>
