<script setup lang="ts">
  import { useScroll, useTransform } from 'motion-v'

  import { principles } from '~/data/content'

  const text = {
    eyebrow: 'Como trabalhamos',
    title: 'Quatro princípios que guiam tudo.',
    lede: 'Do desenvolvimento de produto ao pós-venda, são eles que decidem.',
  }

  const tones = [
    'bg-rocha text-fg border-line',
    'bg-red text-osso border-red',
    'bg-osso text-furo border-osso',
    'bg-rocha-2 text-fg border-line-strong',
  ]
  const accents = ['text-red', 'text-furo', 'text-red', 'text-red']
  const icons = ['ph:handshake', 'ph:seal-check', 'ph:arrows-clockwise', 'ph:cpu']

  const list = useTemplateRef<HTMLElement>('list')
  const { scrollYProgress } = useScroll({ target: list, offset: ['start start', 'end end'] })
  const scales = principles.map((_, index) =>
    useTransform(
      scrollYProgress,
      [index / principles.length, 1],
      [1, 1 - (principles.length - index) * 0.035],
    ),
  )
</script>

<template>
  <section class="relative bg-furo pb-24 sm:pb-36">
    <div class="mx-auto max-w-[90rem] px-5 sm:px-8">
      <Reveal class="max-w-3xl">
        <Eyebrow :depth="910">{{ text.eyebrow }}</Eyebrow>
        <h2 class="mt-5 display text-display text-balance">{{ text.title }}</h2>
        <p class="mt-5 text-lede text-muted">{{ text.lede }}</p>
      </Reveal>

      <div ref="list" class="mt-16 flex flex-col gap-6">
        <div
          v-for="(principle, index) in principles"
          :key="principle.accent"
          class="sticky"
          :style="{ top: `calc(6rem + ${index * 1.25}rem)` }">
          <Motion
            as="article"
            class="flex min-h-[62dvh] origin-top flex-col justify-between gap-10 rounded-[2rem] border p-7 shadow-float sm:p-12 lg:min-h-[56dvh]"
            :class="pick(tones, index)"
            :style="{ scale: pick(scales, index) }">
            <Icon :name="pick(icons, index)" class="size-10 opacity-80 sm:size-12" />
            <div class="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-end">
              <h3 class="display text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.86]">
                {{ principle.title }}
                <span class="block" :class="pick(accents, index)">{{ principle.accent }}</span>
                <span v-if="principle.suffix" class="block text-[0.45em] leading-tight opacity-70">
                  {{ principle.suffix }}
                </span>
              </h3>
              <p class="max-w-md text-lede opacity-80">{{ principle.description }}</p>
            </div>
          </Motion>
        </div>
      </div>
    </div>
  </section>
</template>
