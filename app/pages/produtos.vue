<script setup lang="ts">
definePageMeta({
  colorMode: 'light',
})
useHead({ title: 'Produtos' })

const { data: images } = await useFetch<string[]>('/produtos/produtos.json', {
  default: () => [],
})

</script>

<template>
  <section>
    <div class=" mt-5 flex flex-col items-center justify-center space-y-4 md:flex-row md:space-y-0 md:space-x-10">
      <div class=" flex max-w-125 pt-3 md:ml-7 md:pt-0">
        <UCarousel v-slot="{ item }" loop :items="images" auto-scroll :ui="{ item: 'basis-2/3' } ">
          <NuxtImg :src="item" class="m-auto rounded-lg" alt="Imagem do Produto" />
        </UCarousel>
      </div>
      <div class="flex items-center justify-center text-white">
        <NuxtLink class="my-10 flex animate-pulse items-center justify-center rounded-full border-2 border-black bg-green-500 p-3 text-lg font-bold tracking-wide md:hidden" to="https://wa.link/c1di0k" external target="_blank">
          <UIcon name="ic-baseline-whatsapp" size="24" color="white" />
          Solicite um orçamento
        </NuxtLink>
      </div>
      <div class="flex flex-col items-center">
        <NuxtLink to="/catalogos/catalogo2025.pdf" download external target="_blank">
          <NuxtImg src="/catalogos/catalogo2025foto.png" alt="Baixar Catálogo" class="mx-6 mb-5 size-62.5 rounded-2xl border-2 border-black transition-all hover:size-70 md:hidden" />
          <NuxtImg src="/catalogos/catalogo2025foto2.png" alt="Baixar Catálogo" class="mx-6 mb-5 hidden h-32.5 w-70 rounded-2xl transition-all hover:h-40 hover:w-77.5 md:block" />
        </NuxtLink>
        <NuxtLink to="/catalogos/catalogo1.pdf" download external target="_blank">
          <NuxtImg src="/catalogos/catalogo1foto.jpeg" alt="Baixar Catálogo" class="mx-6 my-5 size-62.5 rounded-2xl transition-all hover:size-70 md:hidden" />
          <NuxtImg src="/catalogos/catalogo1foto2.jpeg" alt="Baixar Catálogo" class="mx-6 my-5 hidden h-32.5 w-70 rounded-2xl transition-all hover:h-40 hover:w-77.5 md:block" />
        </NuxtLink>
        <NuxtLink to="/catalogos/catalogo2.pdf" download external target="_blank">
          <NuxtImg src="/catalogos/catalogo2foto.jpeg" alt="Baixar Catálogo" class="mx-6 mb-5 size-62.5  rounded-2xl transition-all hover:size-70 md:hidden" />
          <NuxtImg src="/catalogos/catalogo2foto2.jpeg" alt="Baixar Catálogo" class="mx-6 mb-5 hidden  h-32.5  w-70 rounded-2xl transition-all hover:h-40 hover:w-77.5 md:block" />
        </NuxtLink>
        <NuxtLink to="/catalogos/catalogo3.pdf" download external target="_blank">
          <NuxtImg src="/catalogos/catalogo3foto.jpeg" alt="Baixar Catálogo" class="mx-6 mb-5 size-62.5 rounded-2xl transition-all hover:size-70 md:hidden" />
          <NuxtImg src="/catalogos/catalogo3foto2.jpeg" alt="Baixar Catálogo" class="mx-6 mb-5 hidden h-32.5 w-70 rounded-2xl transition-all  hover:h-40 hover:w-77.5 md:block" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
