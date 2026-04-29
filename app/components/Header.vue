<script setup lang="ts">
const menu = ref<{ nome: string, to: string, icon: string }[]>([
  { nome: 'Empresa', to: '/', icon: 'i-lucide-building-2' },
  { nome: 'Produtos', to: '/produtos', icon: 'i-lucide-package' },
  { nome: 'Contatos', to: '/contatos', icon: 'i-lucide-phone' },
])

const open = ref(false)
</script>

<template>
  <nav class="sticky top-0 z-50 border-b border-red-500/20 bg-black/85 shadow-[0_0_40px_rgba(253,1,22,0.18)] backdrop-blur-xl">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(253,1,22,0.28),transparent_35%)]" />

    <UContainer class="relative">
      <div class="flex min-h-24 items-center justify-between gap-6">
        <NuxtLink to="/" class="group flex items-center gap-4">
          <div class="relative">
            <div class="absolute inset-0 rounded-full bg-red-600/40 blur-xl transition duration-500 group-hover:bg-red-500/70" />
            <NuxtImg src="/explotools.png" alt="logo Explotools brasil" class="relative h-20 w-56 object-contain transition duration-500 group-hover:scale-105 md:h-24 md:w-72" />
          </div>
        </NuxtLink>

        <ul class="hidden items-center gap-2 rounded-full border border-red-500/20 bg-white/5 p-2 shadow-inner shadow-red-950/40 md:flex">
          <li v-for="{ nome, to, icon } in menu" :key="to">
            <NuxtLink :to="to" class="group relative flex items-center gap-2 overflow-hidden rounded-full px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/80 transition duration-300 hover:text-white" active-class="!bg-[#FD0116] !text-white shadow-[0_0_24px_rgba(253,1,22,0.55)]">
              <span class="absolute inset-0 translate-y-full bg-linear-to-r from-red-700 via-[#FD0116] to-red-500 transition duration-300 group-hover:translate-y-0" />
              <UIcon :name="icon" class="relative size-4" />
              <span class="relative">{{ nome }}</span>
            </NuxtLink>
          </li>
        </ul>

        <UButton icon="i-lucide-menu" color="error" variant="soft" size="xl" class="md:hidden" @click="open = !open" />
      </div>

      <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="-translate-y-4 opacity-0" enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="translate-y-0 opacity-100" leave-to-class="-translate-y-4 opacity-0">
        <div v-if="open" class="pb-5 md:hidden">
          <div class="rounded-3xl border border-red-500/25 bg-zinc-950/95 p-3 shadow-[0_0_35px_rgba(253,1,22,0.25)]">
            <NuxtLink v-for="{ nome, to, icon } in menu" :key="to" :to="to" class="flex items-center gap-3 rounded-2xl px-4 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white/80 transition hover:bg-red-600/20 hover:text-white" active-class="bg-[#FD0116] !text-white shadow-[0_0_18px_rgba(253,1,22,0.45)]" @click="open = false">
              <UIcon :name="icon" class="size-5" />
              {{ nome }}
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </UContainer>
  </nav>
</template>