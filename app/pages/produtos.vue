<script setup lang="ts">
useHead({ title: 'Produtos' })

defineOgImageComponent('NuxtSeo', { theme: '#3FA1B0', colorMode: 'dark' })

const images = ref([
  '/produtos/1.jpg',
  '/produtos/2.jpg',
  '/produtos/3.jpg',
  '/produtos/4.png',
  '/produtos/5.png',
  '/produtos/6.jpg',
  '/produtos/7.jpg',
  '/produtos/8.jpg',
  '/produtos/9.png',
  '/produtos/10.jpeg',
  '/produtos/11.jpeg',
  '/produtos/12.jpg',
  '/produtos/13.jpg',
  '/produtos/14.png',
  '/produtos/15.png',
  '/produtos/16.jpeg',
  '/produtos/17.jpg',
  '/produtos/18.jpg',
  '/produtos/19.jpg',
  '/produtos/20.jpg',
  '/produtos/21.jpg',
  '/produtos/22.jpg',
  '/produtos/23.jpg',
  '/produtos/24.jpg',
  '/produtos/25.jpg',
  '/produtos/26.jpg',
  '/produtos/27.jpg',
  '/produtos/28.jpg',
  '/produtos/29.jpg',
  '/produtos/30.jpg',
])
</script>

<template>
  <section>
    <div class=" mt-5 flex flex-col items-center justify-center space-y-4 md:flex-row md:space-x-10 md:space-y-0">
      <div class="flex max-w-[500px] pt-3 md:ml-7 md:pt-0">
        <ClientOnly>
          <Carousel :value="images" circular :autoplay-interval="6000" :num-visible="1" :num-scroll="1" :show-indicators="false">
            <template #item="slotProps">
              <img :src="slotProps.data" :alt="slotProps.data" class="my-3 h-[300px] rounded-lg md:h-[430px]">
            </template>
          </Carousel>
          <template #fallback>
            <Skeleton class="mr-3 size-[500px]" />
          </template>
        </ClientOnly>
      </div>
      <div class="flex items-center justify-center text-white">
        <NuxtLink class="my-10 flex animate-pulse items-center justify-center rounded-full border-2 border-black bg-green-500 p-3 text-lg font-bold tracking-wide md:hidden" to="https://wa.link/c1di0k" external target="_blank">
          <Icon name="ic:baseline-whatsapp" size="24" color="white" />
          Solicite um orçamento
        </NuxtLink>
      </div>
      <div class="flex flex-col items-center">
        <NuxtLink to="/catalogos/catalogo2025.pdf" download external target="_blank">
          <img src="/catalogos/catalogo2025foto.png" alt="Baixar Catálogo" class="mx-6 mb-5 size-[250px] rounded-2xl border-2 border-black transition-all hover:size-[280px] md:hidden ">
          <img src="/catalogos/catalogo2025foto2.png" alt="Baixar Catálogo" class="mx-6 mb-5 hidden h-[130px] w-[280px] rounded-2xl transition-all hover:h-[160px] hover:w-[310px] md:block">
        </NuxtLink>
        <NuxtLink to="/catalogos/catalogo1.pdf" download external target="_blank">
          <img src="/catalogos/catalogo1foto.jpeg" alt="Baixar Catálogo" class="mx-6 my-5 size-[250px] rounded-2xl transition-all hover:size-[280px] md:hidden">
          <img src="/catalogos/catalogo1foto2.jpeg" alt="Baixar Catálogo" class="mx-6 my-5 hidden h-[130px]  w-[280px] rounded-2xl transition-all hover:h-[160px] hover:w-[310px] md:block">
        </NuxtLink>
        <NuxtLink to="/catalogos/catalogo2.pdf" download external target="_blank">
          <img src="/catalogos/catalogo2foto.jpeg" alt="Baixar Catálogo" class="mx-6 mb-5 size-[250px]  rounded-2xl transition-all hover:size-[280px] md:hidden">
          <img src="/catalogos/catalogo2foto2.jpeg" alt="Baixar Catálogo" class="mx-6 mb-5 hidden  h-[130px]  w-[280px] rounded-2xl transition-all hover:h-[160px] hover:w-[310px] md:block">
        </NuxtLink>
        <NuxtLink to="/catalogos/catalogo3.pdf" download external target="_blank">
          <img src="/catalogos/catalogo3foto.jpeg" alt="Baixar Catálogo" class="mx-6 mb-5 size-[250px] rounded-2xl transition-all hover:size-[280px] md:hidden">
          <img src="/catalogos/catalogo3foto2.jpeg" alt="Baixar Catálogo" class="mx-6 mb-5 hidden h-[130px]  w-[280px] rounded-2xl transition-all  hover:h-[160px] hover:w-[310px] md:block">
        </NuxtLink>
      </div>
    </div>
    <div>
      <div class="flex items-center justify-center text-white">
        <NuxtLink class="my-10 flex animate-pulse items-center justify-center rounded-full border-2 border-black bg-green-500 p-3 text-lg font-bold tracking-wide" to="https://wa.link/c1di0k" external target="_blank">
          <Icon name="ic:baseline-whatsapp" size="24" color="white" />
          Solicite um orçamento
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
