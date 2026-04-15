<script setup lang="ts">
definePageMeta({
  colorMode: 'light',
})
useHead({ title: `Inicio` })

const mutado = ref(false)

const { data: home } = await useAsyncData(() => queryCollection('content').path('/').first())

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description
})
</script>

<template>
  <section class="max-w-7xl mx-auto">
    <div class="m-8 flex items-center justify-center">
      <video class="h-auto w-full max-w-225" autoplay loop :muted="!mutado">
        <source src="/video.mp4" type="video/mp4">
        Seu navegador não suporta o elemento de vídeo.
      </video>
    </div>
    <div class="flex items-center justify-center text-white">
      <UIcon v-if="mutado" name="heroicons-speaker-wave" size="30" class="m-1 text-black" />
      <UIcon v-else name="heroicons-speaker-x-mark" size="30" class="m-1 text-black" />
      <USwitch v-model="mutado" unchecked-icon="i-lucide-x" checked-icon="i-lucide-check" />
    </div>

    
    <ContentRenderer v-if="home" :value="home" />
  </section>
</template>
