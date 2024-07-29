<script setup lang="ts">
const menu = ref<{ nome: string, to: string }[]>([
  { nome: 'Empresa', to: '/' },
  { nome: 'Produtos', to: '/produtos' },
  { nome: 'Catalogos', to: '/catalogos' },
  { nome: 'Contatos', to: '/contatos' },
])
</script>

<template>
  <nav class="flex flex-col items-center justify-between bg-black md:flex">
    <div class="flex w-full justify-center">
      <img src="/explotools.png" alt="logo Explotools brasil" class="h-[150px] w-[450px]">
    </div>
    <div class="w-full">
      <ul class="flex w-full justify-center space-x-6 bg-[#FD0116]">
        <template v-for="{nome, to} in menu" :key="to">
          <li class="rounded-lg p-1 uppercase text-white hover:font-bold hover:text-black">
            <NuxtLink :to="to" active-class="rounded-lg p-1 text-black font-bold">
              {{ nome }}
            </NuxtLink>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>
