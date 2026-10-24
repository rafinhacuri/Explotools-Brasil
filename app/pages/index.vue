<script setup lang="ts">
  const text = {
    title: 'Ferramentas para sondagem wireline',
    description:
      'Fabricante de ferramentas e consumíveis para sondagem diamantada wireline: overshots, cabeçotes, molas, cabeças d’água, cortadores e peças para bombas. Qualidade de importado a preço nacional.',
  }

  useHead({ title: text.title })
  useSeoMeta({ description: text.description })
  defineOgImage('Explotools.takumi', {
    title: 'Ferramentas de sondagem wireline.',
    description:
      'Projetadas e fabricadas para o campo real. Qualidade de importado a preço nacional.',
  })
</script>

<template>
  <div>
    <HomeHero />
    <HomeMarquee />
    <HomeLines />
    <HomeFactory />
    <HomeAnatomy />
    <HomeStory />
    <HomePrinciples />
    <HomeQuality />
    <HomeReach />
    <HomeMatrix />
    <HomeCta />
  </div>
</template>
