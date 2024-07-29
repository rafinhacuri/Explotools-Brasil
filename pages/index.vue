<script setup lang="ts">
const images = ref([{ nome: `/foto1.jpeg` }, { nome: `/foto2.jpeg` }, { nome: `/foto3.jpeg` }, { nome: `/foto4.jpeg` }, { nome: `/foto5.jpeg` }, { nome: `/foto6.jpeg` }, { nome: `/foto7.jpeg` }, { nome: `/foto8.jpeg` }])
const verdade = true
</script>

<template>
  <section>
    <div class="mt-6 flex items-center justify-center">
      <div class=" max-w-[500px] pb-3 transition-all duration-200 ease-in-out ">
        <Galleria :value="images" :circular="verdade" :show-item-navigators="verdade" :show-thumbnails="false" :auto-play="verdade" :transition-interval="4000">
          <template #item="slotProps">
            <img :src="slotProps.item.nome" :alt="slotProps.item.nome" class="size-[300px] rounded-lg object-cover md:size-[500px]">
          </template>
        </Galleria>
      </div>
    </div>

    <div class="flex items-center justify-center text-white">
      <NuxtLink class="my-10 animate-pulse rounded-full border-2 border-black bg-[#FD0116] p-5 text-lg font-bold tracking-wide" to="/lead">
        Solicite um Orçamento
      </NuxtLink>
    </div>
  </section>
</template>
