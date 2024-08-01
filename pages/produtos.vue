<script setup lang="ts">
const images = ref([
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
</script>

<template>
  <section>
    <div class=" flex flex-col items-center justify-center space-y-4 md:flex-row md:space-x-10 md:space-y-0">
      <div class="flex max-w-[500px] pt-3 md:ml-7 md:pt-0">
        <ClientOnly>
          <Carousel :value="images" circular :autoplay-interval="6000" :num-visible="1" :num-scroll="1" :show-indicators="false">
            <template #item="slotProps">
              <img :src="slotProps.data.nome" :alt="slotProps.data.nome" class="my-3 h-[300px] rounded-lg md:h-[430px]">
            </template>
          </Carousel>
          <template #fallback>
            <Skeleton class="mr-3 size-[500px]" />
          </template>
        </ClientOnly>
      </div>
      <div class="flex items-center justify-center text-white">
        <NuxtLink class="my-10 flex animate-pulse items-center justify-center rounded-full border-2 border-black bg-green-500 p-3 text-lg font-bold tracking-wide md:hidden" to="https://wa.link/vb9urm" external target="_blank">
          <Icon name="ic:baseline-whatsapp" size="24" color="white" />
          Solicite um orçamento
        </NuxtLink>
      </div>
      <div class="flex flex-col items-center">
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
        <NuxtLink class="my-10 flex animate-pulse items-center justify-center rounded-full border-2 border-black bg-green-500 p-3 text-lg font-bold tracking-wide" to="https://wa.link/vb9urm" external target="_blank">
          <Icon name="ic:baseline-whatsapp" size="24" color="white" />
          Solicite um orçamento
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
