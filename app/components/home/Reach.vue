<script setup lang="ts">
  import { countries } from '~/data/content'

  const text = {
    eyebrow: 'Presença internacional',
    title: 'A reputação cruza fronteiras.',
    body: 'Exportamos para mais de 12 países, incluindo México, Argentina, Peru, Bolívia, Chile, Colômbia e outros mercados da América Latina.',
    proof:
      'Quando a performance em campo é comprovada, a reputação cruza fronteiras sem precisar de propaganda.',
    more: '+6 outros',
    drag: 'Arraste o globo',
    origin: 'Origem',
  }

  const focus = ref(-1)
</script>

<template>
  <section class="relative overflow-hidden bg-furo py-24 sm:py-36">
    <div
      class="mx-auto grid max-w-[90rem] items-center gap-6 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div class="relative z-10">
        <Reveal>
          <Eyebrow :depth="1120">{{ text.eyebrow }}</Eyebrow>
          <h2 class="mt-5 display text-display text-balance">{{ text.title }}</h2>
          <p class="mt-6 max-w-lg text-lede text-muted">{{ text.body }}</p>
          <p class="mt-4 max-w-lg text-lede text-fg/85">{{ text.proof }}</p>
        </Reveal>

        <Reveal :delay="0.1">
          <ul class="mt-10 flex flex-wrap gap-2">
            <li v-for="(country, index) in countries" :key="country.name">
              <button
                type="button"
                class="flex h-10 items-center gap-2 rounded-full border px-4 text-[0.875rem] transition-[border-color,background-color,color] duration-200"
                :class="
                  focus === index
                    ? 'border-red bg-red text-osso'
                    : 'border-line-strong text-fg/85 hover:border-red/60'
                "
                @pointerenter="focus = index"
                @pointerleave="focus = -1"
                @focus="focus = index"
                @blur="focus = -1">
                <span class="size-1.5 rounded-full" :class="country.home ? 'bg-osso' : 'bg-red'" />
                {{ country.name }}
                <span v-if="country.home" class="label text-[0.5625rem] opacity-70">{{
                  text.origin
                }}</span>
              </button>
            </li>
            <li
              class="flex h-10 items-center rounded-full border border-dashed border-line-strong px-4 text-[0.875rem] text-faint">
              {{ text.more }}
            </li>
          </ul>
        </Reveal>
      </div>

      <div class="relative aspect-square w-full">
        <div
          aria-hidden="true"
          class="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgb(254_0_24/0.07)_0%,transparent_70%)] blur-2xl" />
        <HomeGlobeStage :focus="focus" />
        <p
          class="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 label text-faint">
          <Icon name="ph:hand-grabbing" class="size-4" />
          {{ text.drag }}
        </p>
      </div>
    </div>
  </section>
</template>
