<script setup lang="ts">
definePageMeta({
  colorMode: 'dark',
})

useHead({ title: 'Inicio' })

const mutado = ref(true)

const { data: home } = await useAsyncData(() =>
  queryCollection('content').path('/').first()
)

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description
})
</script>

<template>
  <section class="relative min-h-screen overflow-hidden bg-black text-white">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(253,1,22,0.25),transparent_40%)]" />
    <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[48px_48px]" />

    <UContainer class="relative py-10">

      <section class="relative mb-16 overflow-hidden rounded-3xl border border-red-500/20 shadow-[0_0_50px_rgba(253,1,22,0.2)]">
        
        <div class="absolute inset-0 z-10 bg-linear-to-t from-black via-black/40 to-transparent" />

        <video
          class="h-75 w-full object-cover md:h-125"
          autoplay
          loop
          playsinline
          :muted="mutado"
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>

        <div class="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
          <h1 class="bg-linear-to-r from-white via-red-100 to-red-500 bg-clip-text text-3xl font-black text-transparent md:text-5xl">
            Explotools Brasil
          </h1>

          <p class="mt-4 max-w-xl text-sm text-white/70 md:text-lg">
            Soluções de alta performance para mineração e sondagem
          </p>

          <div class="mt-6 flex gap-4">
            <UButton to="/produtos" size="lg" color="error" class="font-bold shadow-[0_0_25px_rgba(253,1,22,0.4)]">
              Ver Produtos
            </UButton>

            <UButton to="https://wa.link/c1di0k" external target="_blank" size="lg" variant="soft" color="neutral">
              Fale conosco
            </UButton>
          </div>
        </div>

        <!-- controle de som -->
        <div class="absolute bottom-4 right-4 z-30 flex items-center gap-2 rounded-full bg-black/60 px-3 py-2 backdrop-blur">
          <UIcon :name="mutado ? 'i-lucide-volume-2' : 'i-lucide-volume-x'" class="text-white" />
          <USwitch v-model="mutado" size="sm" />
        </div>
      </section>

      <!-- DIFERENCIAIS -->
      <section class="mb-20 grid gap-6 md:grid-cols-3">
        <UCard
          v-for="item in [
            { icon: 'i-lucide-hammer', title: 'Alta resistência', desc: 'Projetado para ambientes extremos' },
            { icon: 'i-lucide-shield-check', title: 'Qualidade garantida', desc: 'Materiais de alto padrão' },
            { icon: 'i-lucide-truck', title: 'Entrega e suporte', desc: 'Atendimento direto e rápido' }
          ]"
          :key="item.title"
          :ui="{ root: 'border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:border-red-500/40 hover:shadow-[0_0_30px_rgba(253,1,22,0.2)] transition', body: 'p-6' }"
        >
          <div class="mb-4 flex size-12 items-center justify-center rounded-xl bg-red-600/20">
            <UIcon :name="item.icon" class="text-red-500 size-6" />
          </div>

          <h3 class="text-lg font-black">{{ item.title }}</h3>
          <p class="text-sm text-white/60 mt-2">{{ item.desc }}</p>
        </UCard>
      </section>

      <!-- CONTEÚDO DO STUDIO -->
      <section class="prose prose-invert max-w-none
        prose-headings:text-white
        prose-p:text-white/70
        prose-strong:text-red-400
        prose-a:text-red-500
        prose-a:no-underline hover:prose-a:underline
      ">
        <ContentRenderer v-if="home" :value="home" />
      </section>

    </UContainer>
  </section>
</template>