<script setup lang="ts">
  import { brand } from '~/data/content'

  const text = {
    eyebrow: 'Vamos conversar?',
    title: ['Teste um fabricante', 'que entrega', 'qualidade real.'],
    body: 'Se você opera sondas wireline e quer qualidade real, com atendimento rápido e preço justo, fale com a gente. Mande sua lista de necessidades pelo WhatsApp e respondemos hoje mesmo.',
    cta: 'Chamar no WhatsApp',
    catalog: 'Baixar catálogo 2025',
    sign: 'Junte-se a nós nessa jornada de desenvolvimento e inovação.',
  }
</script>

<template>
  <section class="relative overflow-hidden bg-red text-osso">
    <svg
      :viewBox="MARK_VIEWBOX"
      aria-hidden="true"
      class="pointer-events-none absolute -top-[20%] right-[-8%] h-[150%] w-auto text-red-deep/50">
      <path fill="currentColor" :d="MARK_PATH" />
    </svg>
    <div class="relative mx-auto max-w-[90rem] px-5 py-24 sm:px-8 sm:py-36">
      <Reveal>
        <p class="flex items-center gap-3 label text-osso/80">
          <span class="tabular-nums">1200 m</span>
          <span class="h-px w-8 bg-current opacity-60" />
          {{ text.eyebrow }}
        </p>
      </Reveal>
      <h2 class="mt-6 display text-display">
        <span v-for="(line, index) in text.title" :key="line" class="block overflow-hidden">
          <Motion
            as="span"
            class="block"
            :class="index === 2 ? 'text-furo' : ''"
            :initial="{ y: '100%' }"
            :while-in-view="{ y: '0%' }"
            :in-view-options="{ once: true, amount: 0.6 }"
            :transition="{ type: 'spring', bounce: 0.1, duration: 1.1, delay: index * 0.08 }">
            {{ line }}
          </Motion>
        </span>
      </h2>
      <Reveal :delay="0.2">
        <div class="mt-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <p class="max-w-2xl text-lede text-osso/90">{{ text.body }}</p>
          <div class="flex flex-wrap gap-3">
            <Magnet :strength="0.22">
              <Btn :to="brand.whatsapp" size="lg" variant="dark" icon="simple-icons:whatsapp">{{
                text.cta
              }}</Btn>
            </Magnet>
            <Btn
              to="/catalogos/catalogo2025.pdf"
              external
              size="lg"
              variant="light"
              icon="ph:download-simple">
              {{ text.catalog }}
            </Btn>
          </div>
        </div>
        <p
          class="mt-14 border-t border-osso/25 pt-6 display text-[clamp(1.5rem,2.6vw,2.25rem)] leading-none text-osso/90">
          {{ text.sign }}
        </p>
      </Reveal>
    </div>
  </section>
</template>
