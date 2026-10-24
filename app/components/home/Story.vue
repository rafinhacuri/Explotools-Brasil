<script setup lang="ts">
  const text = {
    eyebrow: 'Quem está por trás',
    title: 'Experiência de campo, gestão e operação.',
  }

  const chapters = [
    {
      when: '2019',
      where: 'Chile',
      title: 'Nasce a Explotools',
      body: 'Fundada por um especialista com mais de 20 anos de vivência direta no setor de sondagem e mineração — no campo, no comercial e na gestão de operações.',
    },
    {
      when: '+12',
      where: 'América Latina',
      title: 'A reputação cruza fronteiras',
      body: 'O que começou focado no mercado chileno se expandiu rapidamente pela América Latina, abastecendo grandes operações internacionais.',
    },
    {
      when: '2025',
      where: 'Brasil',
      title: 'Chegada ao Brasil',
      body: 'Com uma missão clara: entregar ao mercado brasileiro a mesma qualidade de ferramental, com atendimento próximo, ágil e a preço competitivo.',
    },
    {
      when: 'Hoje',
      where: 'Brasil e exportação',
      title: 'As maiores operadoras confiam',
      body: 'Exportamos para mais de 12 países e fornecemos para as maiores operadoras de sondagem do Brasil. O crescimento vem da confiança no que entregamos.',
    },
  ]

  const stats = [
    { to: 12, prefix: '+', suffix: '', label: 'Países atendidos' },
    { to: 20, prefix: '', suffix: '+', label: 'Anos de experiência do fundador' },
    { to: 100, prefix: '', suffix: '%', label: 'Clientes satisfeitos na última pesquisa' },
  ]
</script>

<template>
  <section class="relative overflow-hidden bg-furo py-28 sm:py-40">
    <Strata :layers="7" :seed="11" :depth="520" :vein="3" />
    <div
      aria-hidden="true"
      class="absolute inset-0 bg-linear-to-b from-furo via-transparent to-furo/80" />

    <div class="relative mx-auto max-w-[90rem] px-5 sm:px-8">
      <div class="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Reveal class="lg:sticky lg:top-32">
            <Eyebrow :depth="780">{{ text.eyebrow }}</Eyebrow>
            <h2 class="mt-5 display text-display text-balance">{{ text.title }}</h2>
          </Reveal>
        </div>

        <ol class="relative flex flex-col gap-14 border-l border-line-strong pl-8 sm:pl-12">
          <Reveal
            v-for="(chapter, index) in chapters"
            :key="chapter.when"
            as="li"
            :delay="index * 0.05"
            class="relative">
            <span
              aria-hidden="true"
              class="absolute top-3 -left-[calc(2rem+5px)] size-2.5 rounded-full bg-red ring-4 ring-furo sm:-left-[calc(3rem+5px)]" />
            <p class="flex items-baseline gap-4">
              <span class="display text-[clamp(3rem,6vw,5rem)] leading-none text-red">{{
                chapter.when
              }}</span>
              <span class="label text-fg/70">{{ chapter.where }}</span>
            </p>
            <h3 class="mt-3 text-title font-semibold">{{ chapter.title }}</h3>
            <p class="mt-3 max-w-xl text-lede text-muted">{{ chapter.body }}</p>
          </Reveal>
        </ol>
      </div>

      <div
        class="mt-24 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-3">
        <Reveal
          v-for="(stat, index) in stats"
          :key="stat.label"
          :delay="index * 0.08"
          class="bg-furo/85 p-8 backdrop-blur-sm sm:p-10">
          <p class="display text-[clamp(4rem,8vw,7rem)] leading-[0.85]">
            <Counter :to="stat.to" :prefix="stat.prefix" :suffix="stat.suffix" />
          </p>
          <p class="mt-4 label text-fg/70">{{ stat.label }}</p>
        </Reveal>
      </div>
    </div>
  </section>
</template>
