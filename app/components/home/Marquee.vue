<script setup lang="ts">
  import { useScroll, useTransform } from 'motion-v'

  import { photos } from '~/data/content'

  const phrases = [
    'Qualidade de importado a preço nacional',
    'Contra a hora parada',
    'Nós fabricamos — não revendemos',
    'Cotação no mesmo dia',
    'BO · NO · NO2 · HO · PO',
  ]

  const section = useTemplateRef<HTMLElement>('section')
  const { scrollYProgress } = useScroll({ target: section, offset: ['start end', 'end start'] })
  const shiftA = useTransform(scrollYProgress, [0, 1], ['4%', '-14%'])
  const shiftB = useTransform(scrollYProgress, [0, 1], ['-12%', '6%'])

  const strip = photos.filter((_, index) => index % 2 === 0)
</script>

<template>
  <section
    ref="section"
    aria-hidden="true"
    class="relative z-10 -mt-[10vh] overflow-hidden py-24 select-none">
    <Motion class="-mx-[5%] rotate-[2.5deg]" :style="{ x: shiftA }">
      <div class="flex w-max animate-marquee gap-3 [--marquee-duration:70s]">
        <NuxtImg
          v-for="(photo, index) in [...strip, ...strip]"
          :key="index"
          :src="photo.src"
          width="320"
          alt=""
          loading="lazy"
          class="size-44 shrink-0 rounded-xl object-cover sm:size-56" />
      </div>
    </Motion>

    <Motion
      class="absolute inset-x-[-5%] top-1/2 -translate-y-1/2 -rotate-[3deg] bg-red py-4 shadow-[0_20px_60px_-10px_rgb(254_0_24/0.55)]"
      :style="{ x: shiftB }">
      <div class="flex w-max animate-marquee-reverse items-center [--marquee-duration:38s]">
        <template v-for="copy in 2" :key="copy">
          <span
            v-for="phrase in phrases"
            :key="`${copy}-${phrase}`"
            class="flex items-center gap-6 pr-6 display text-[clamp(1.75rem,3.4vw,3rem)] leading-none whitespace-nowrap text-osso">
            {{ phrase }}
            <svg :viewBox="MARK_VIEWBOX" class="h-[0.8em] w-auto text-furo">
              <path fill="currentColor" :d="MARK_PATH" />
            </svg>
          </span>
        </template>
      </div>
    </Motion>
  </section>
</template>
