<script setup lang="ts">
useHead({
  title: 'Recomendação',
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Saira:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap' },
  ],
})
definePageMeta({ layout: false, colorMode: 'light' })
const { uid } = useRoute().params

const id = Array.isArray(uid) ? uid[0] : uid

const { data } = await useFetch('/api/fetch/recomendacao', { method: 'POST', body: { _id: id } })
</script>

<template>
  <div class="matriz min-h-screen p-4">
    <UContainer class="py-6">
      <MatrizRecomendacao v-if="data" :data="data" />

      <div v-else class="et-sub flex h-96 items-center justify-center">
        Nenhum dado encontrado.
      </div>
    </UContainer>
  </div>
</template>
