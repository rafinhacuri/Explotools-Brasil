<script setup lang="ts">
definePageMeta({
  colorMode: 'dark',
})

useHead({ title: 'Produtos' })

const images = [
  "/produtos/1.jpg",
  "/produtos/2.jpg",
  "/produtos/3.jpg",
  "/produtos/4.png",
  "/produtos/5.png",
  "/produtos/6.jpg",
  "/produtos/7.jpg",
  "/produtos/8.jpg",
  "/produtos/9.png",
  "/produtos/10.jpeg",
  "/produtos/11.jpeg",
  "/produtos/12.jpg",
  "/produtos/13.jpg",
  "/produtos/14.png",
  "/produtos/15.png",
  "/produtos/16.jpeg",
  "/produtos/17.jpg",
  "/produtos/18.jpg",
  "/produtos/19.jpg",
  "/produtos/20.jpg",
  "/produtos/21.jpg",
  "/produtos/22.jpg",
  "/produtos/23.jpg",
  "/produtos/24.jpg",
  "/produtos/25.jpg",
  "/produtos/26.jpg",
  "/produtos/27.jpg",
  "/produtos/28.jpg",
  "/produtos/29.jpg",
  "/produtos/30.jpg"
]

const catalogos = [
  { title: 'Catálogo 2025', description: 'Linha atualizada de ferramentas Explotools', image: '/catalogos/catalogo2025foto.png', imageDesktop: '/catalogos/catalogo2025foto2.png', file: '/catalogos/catalogo2025.pdf' },
  { title: 'Catálogo Técnico 1', description: 'Produtos e soluções para sondagem', image: '/catalogos/catalogo1foto.jpeg', imageDesktop: '/catalogos/catalogo1foto2.jpeg', file: '/catalogos/catalogo1.pdf' },
  { title: 'Catálogo Técnico 2', description: 'Equipamentos de alta resistência', image: '/catalogos/catalogo2foto.jpeg', imageDesktop: '/catalogos/catalogo2foto2.jpeg', file: '/catalogos/catalogo2.pdf' },
  { title: 'Catálogo Técnico 3', description: 'Ferramentas para operação em campo', image: '/catalogos/catalogo3foto.jpeg', imageDesktop: '/catalogos/catalogo3foto2.jpeg', file: '/catalogos/catalogo3.pdf' },
]

const diferenciais = [
  { icon: 'i-lucide-hammer', title: 'Alta resistência', description: 'Ferramentas preparadas para operações exigentes.' },
  { icon: 'i-lucide-shield-check', title: 'Qualidade técnica', description: 'Produtos pensados para segurança e durabilidade.' },
  { icon: 'i-lucide-truck', title: 'Atendimento comercial', description: 'Solicite orçamento e suporte para sua demanda.' },
]
</script>

<template>
  <section class="relative min-h-screen overflow-hidden bg-black text-white">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(253,1,22,0.26),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(253,1,22,0.18),transparent_35%)]" />
    <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-size-[48px_48px]" />

    <UContainer class="relative py-16">
      <section class="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <UBadge color="error" variant="soft" size="lg" class="mb-6 rounded-full px-5 py-2 uppercase tracking-[0.25em]">
            Produtos Explotools
          </UBadge>

          <h1 class="max-w-3xl bg-linear-to-r from-white via-red-100 to-red-500 bg-clip-text text-4xl font-black tracking-tight text-transparent md:text-6xl">
            Ferramentas de sondagem para alta performance
          </h1>

          <p class="mt-6 max-w-2xl text-base leading-8 text-white/65 md:text-lg">
            Conheça nossa linha de produtos técnicos para mineração, sondagem e perfuração, com qualidade, resistência e suporte especializado.
          </p>

          <div class="mt-8 flex flex-col gap-4 sm:flex-row">
            <UButton to="https://wa.link/c1di0k" external target="_blank" icon="i-simple-icons-whatsapp" color="error" size="xl" class="rounded-2xl font-bold shadow-[0_0_28px_rgba(253,1,22,0.45)] transition hover:scale-[1.02]">
              Solicite um orçamento
            </UButton>

            <UButton to="/catalogos/catalogo2025.pdf" external target="_blank" icon="i-lucide-download" color="neutral" variant="soft" size="xl" class="rounded-2xl font-bold">
              Baixar catálogo 2025
            </UButton>
          </div>
        </div>

        <UCard :ui="{ root: 'overflow-hidden border border-red-500/20 bg-zinc-950/80 shadow-[0_0_55px_rgba(253,1,22,0.18)] backdrop-blur-xl', body: 'p-3 md:p-5' }">
          <UCarousel v-slot="{ item }" loop auto-scroll :items="images" class="w-full" :ui="{ item: 'basis-full sm:basis-2/3 lg:basis-full px-2' }">
            <div class="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/4">
              <div class="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-70" />
              <NuxtImg :src="item" alt="Imagem do produto Explotools" class="h-105 w-full object-cover transition duration-700 group-hover:scale-105" />
              <div class="absolute bottom-0 left-0 right-0 p-5">
                <p class="text-sm font-bold uppercase tracking-[0.22em] text-red-400">
                  Linha Explotools
                </p>
                <p class="mt-1 text-xl font-black">
                  Produtos para sondagem
                </p>
              </div>
            </div>
          </UCarousel>
        </UCard>
      </section>

      <section class="mt-14 grid gap-5 md:grid-cols-3">
        <UCard v-for="item in diferenciais" :key="item.title" :ui="{ root: 'border border-white/10 bg-white/[0.04] backdrop-blur-xl transition hover:-translate-y-1 hover:border-red-500/40 hover:shadow-[0_0_30px_rgba(253,1,22,0.18)]', body: 'p-6' }">
          <div class="mb-5 flex size-14 items-center justify-center rounded-2xl bg-red-600/15">
            <UIcon :name="item.icon" class="size-7 text-red-500" />
          </div>

          <h2 class="text-xl font-black">
            {{ item.title }}
          </h2>

          <p class="mt-2 text-sm leading-6 text-white/55">
            {{ item.description }}
          </p>
        </UCard>
      </section>

      <section class="mt-20">
        <div class="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <UBadge color="error" variant="subtle" class="mb-4 rounded-full uppercase tracking-[0.2em]">
              Downloads
            </UBadge>

            <h2 class="text-3xl font-black md:text-4xl">
              Catálogos técnicos
            </h2>

            <p class="mt-3 max-w-2xl text-white/55">
              Baixe nossos materiais e consulte os produtos disponíveis.
            </p>
          </div>

          <UButton to="https://wa.link/c1di0k" external target="_blank" icon="i-simple-icons-whatsapp" color="error" variant="soft" size="lg" class="rounded-2xl font-bold">
            Falar com vendedor
          </UButton>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <NuxtLink v-for="catalogo in catalogos" :key="catalogo.title" :to="catalogo.file" download external target="_blank" class="group">
            <UCard :ui="{ root: 'h-full overflow-hidden border border-red-500/20 bg-zinc-950/85 shadow-[0_0_35px_rgba(253,1,22,0.12)] backdrop-blur-xl transition duration-300 group-hover:-translate-y-2 group-hover:border-red-500/60 group-hover:shadow-[0_0_45px_rgba(253,1,22,0.28)]', body: 'p-0' }">
              <div class="relative overflow-hidden">
                <div class="absolute inset-0 z-10 bg-linear-to-t from-black via-black/10 to-transparent" />
                <NuxtImg :src="catalogo.image" :alt="catalogo.title" class="h-72 w-full object-cover transition duration-700 group-hover:scale-110 md:hidden" />
                <NuxtImg :src="catalogo.imageDesktop" :alt="catalogo.title" class="hidden h-52 w-full object-cover transition duration-700 group-hover:scale-110 md:block" />

                <div class="absolute right-4 top-4 z-20 flex size-11 items-center justify-center rounded-full bg-[#FD0116] shadow-[0_0_24px_rgba(253,1,22,0.55)]">
                  <UIcon name="i-lucide-download" class="size-5 text-white" />
                </div>
              </div>

              <div class="p-5">
                <h3 class="text-xl font-black">
                  {{ catalogo.title }}
                </h3>

                <p class="mt-2 text-sm leading-6 text-white/55">
                  {{ catalogo.description }}
                </p>

                <div class="mt-5 flex items-center justify-between text-sm font-bold text-red-400">
                  <span>Baixar PDF</span>
                  <UIcon name="i-lucide-arrow-up-right" class="size-5 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>
            </UCard>
          </NuxtLink>
        </div>
      </section>
    </UContainer>
  </section>
</template>