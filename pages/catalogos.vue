<script setup lang="ts">
const images = ref([
  { nome: `/produtos/1.png` },
  { nome: `/produtos/2.jpg` },
  { nome: `/produtos/3.jpg` },
  { nome: `/produtos/4.png` },
  { nome: `/produtos/5.jpg` },
  { nome: `/produtos/6.jpg` },
  { nome: `/produtos/7.jpg` },
  { nome: `/produtos/8.jpg` },
  { nome: `/produtos/9.jpg` },
  { nome: `/produtos/10.jpg` },
  { nome: `/produtos/11.jpg` },
  { nome: `/produtos/12.jpg` },
  { nome: `/produtos/13.png` },
  { nome: `/produtos/14.jpg` },
  { nome: `/produtos/15.jpg` },
  { nome: `/produtos/16.jpg` },
  { nome: `/produtos/17.jpg` },
  { nome: `/produtos/18.png` },
  { nome: `/produtos/19.jpg` },
  { nome: `/produtos/20.jpg` },
  { nome: `/produtos/21.jpg` },
  { nome: `/produtos/22.jpg` },
  { nome: `/produtos/23.jpg` },
  { nome: `/produtos/24.jpg` },
  { nome: `/produtos/25.jpg` },
  { nome: `/produtos/26.jpg` },
  { nome: `/produtos/27.jpg` },
  { nome: `/produtos/28.jpg` },
  { nome: `/produtos/29.jpg` },
  { nome: `/produtos/30.jpg` },
  { nome: `/produtos/31.jpg` },
  { nome: `/produtos/32.jpg` },
  { nome: `/produtos/33.jpg` },
  { nome: `/produtos/34.jpg` },
  { nome: `/produtos/35.jpg` },
  { nome: `/produtos/36.jpg` },
  { nome: `/produtos/37.jpg` },
  { nome: `/produtos/38.jpg` },
  { nome: `/produtos/39.jpg` },
  { nome: `/produtos/40.jpg` },
  { nome: `/produtos/41.jpg` },
  { nome: `/produtos/42.jpg` },
  { nome: `/produtos/43.jpg` },
  { nome: `/produtos/44.jpg` },
  { nome: `/produtos/45.jpg` },
  { nome: `/produtos/46.jpg` },
])
const verdade = true
</script>

<template>
  <div class="ml-7 grid grid-cols-1 items-center justify-center space-y-4 md:grid-cols-2 md:space-x-40 md:space-y-0">
    <div class="max-w-[500px]">
      <Galleria :value="images" :circular="verdade" :show-item-navigators="verdade" :show-thumbnails="false" :auto-play="verdade" :transition-interval="3000">
        <template #item="slotProps">
          <img :src="slotProps.item.nome" :alt="slotProps.item.nome" class="size-[300px] rounded-lg object-cover md:size-[500px]">
        </template>
      </Galleria>
    </div>
    <div class="flex flex-col items-center">
      <NuxtLink to="/catalogos/catalogo1.pdf" download>
        <img src="/catalogos/catalogo1foto.jpeg" alt="Baixar Catálogo" class="mx-6 my-5 size-[250px] rounded-2xl transition-all hover:size-[280px]">
      </NuxtLink>
      <NuxtLink to="/catalogos/catalogo2.pdf" download>
        <img src="/catalogos/catalogo2foto.jpeg" alt="Baixar Catálogo" class="mx-6 mb-5 size-[250px] rounded-2xl transition-all hover:size-[280px]">
      </NuxtLink>
      <NuxtLink to="/catalogos/catalogo3.pdf" download>
        <img src="/catalogos/catalogo3foto.jpeg" alt="Baixar Catálogo" class="mx-6 mb-5 size-[250px] rounded-2xl transition-all hover:size-[280px]">
      </NuxtLink>
    </div>
  </div>
</template>
