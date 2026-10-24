<script setup lang="ts">
  import type { NuxtError } from '#app'

  const props = defineProps({
    error: { type: Object as PropType<NuxtError>, required: true },
  })

  const notFound = computed(() => props.error.status === 404)

  const text = computed(() => ({
    eyebrow: notFound.value ? 'Furo sem testemunho' : 'Algo travou no furo',
    title: notFound.value ? 'Página não encontrada.' : 'Erro inesperado.',
    lede: notFound.value
      ? 'Perfuramos fundo e não achamos esta página. Ela pode ter mudado de endereço.'
      : 'Tivemos um problema ao carregar esta página. Tente de novo em instantes.',
    home: 'Voltar ao início',
    talk: 'Falar no WhatsApp',
  }))

  useHead({ title: String(props.error.status ?? 500) })

  function home(): void {
    void clearError({ redirect: '/' })
  }
</script>

<template>
  <div class="relative flex min-h-dvh flex-col overflow-hidden">
    <div aria-hidden="true" class="absolute inset-x-0 bottom-0 h-[55%]">
      <Strata :layers="7" :seed="44" :depth="200" :vein="3" />
    </div>
    <div
      aria-hidden="true"
      class="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_20%,rgb(254_0_24/0.18)_0%,transparent_70%)]" />
    <div
      class="relative mx-auto flex w-full max-w-[90rem] flex-1 flex-col justify-center px-5 py-16 sm:px-8">
      <Logo tagline class="text-[1.375rem]" />
      <p class="mt-16 label text-red">{{ text.eyebrow }}</p>
      <p class="mt-4 display text-[clamp(7rem,26vw,22rem)] leading-[0.78] text-red">
        {{ props.error.status ?? 500 }}
      </p>
      <h1 class="mt-4 display text-headline">{{ text.title }}</h1>
      <p class="mt-4 max-w-lg text-lede text-muted">{{ text.lede }}</p>
      <div class="mt-10 flex flex-wrap gap-3">
        <Btn size="lg" trailing="ph:arrow-right" @click="home">{{ text.home }}</Btn>
        <Btn to="https://wa.link/c1di0k" size="lg" variant="ghost" icon="simple-icons:whatsapp">{{
          text.talk
        }}</Btn>
      </div>
    </div>
  </div>
</template>
