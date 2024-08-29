<script setup lang="ts">
useHead({ title: `Contatos` })

defineOgImageComponent('NuxtSeo', { theme: '#3FA1B0', colorMode: 'dark' })

const midias = ref([
  { href: 'https://wa.link/vb9urm', icon: 'ic:baseline-whatsapp', text: 'WhatsApp' },
  { href: 'mailto:ramon.curi@explotools.cl', icon: 'line-md:email', text: 'Email' },
  { href: 'https://www.instagram.com/explotools.brasil?igsh=MWc2OHBxc3ozejhsdA==', icon: 'line-md:instagram', text: 'Instagram' },
  { href: 'https://www.facebook.com/share/p1veqrfSK8BVwVUU/?mibextid=qi2Omg', icon: 'line-md:facebook', text: 'Facebook' },
  { href: 'https://www.linkedin.com/in/explotools-brasil-b6ba58273', icon: 'line-md:linkedin', text: 'LinkedIn' },
  { href: 'https://maps.app.goo.gl/FGUcQ1ZqUXyxKMsT8', icon: 'line-md:map-marker', text: 'Google Maps' },
  { href: 'https://www.tiktok.com/@explotools.brasil?_t=8pFnT9iDWli&_r=1', icon: 'line-md:tiktok', text: 'TikTok' },
])
</script>

<template>
  <div class="mx-6 flex h-screen items-center justify-center">
    <div class="w-full max-w-md rounded-lg bg-black p-6 shadow-lg">
      <h2 class="mb-6 text-center text-2xl font-bold text-white">
        Entre em Contato
      </h2>
      <div v-for="{href, icon, text} in midias" :key="text" class="rounded-lg bg-white">
        <NuxtLink
          :href="href"
          target="_blank"
          class="mb-4 flex items-center justify-start rounded-lg p-4 shadow-md transition-transform hover:scale-105 hover:bg-gray-100"
        >
          <Icon :name="icon" size="24" color="red" class="text-[#FD0116]" />
          <span class="ml-3 text-lg font-medium text-gray-800">{{ text }}</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
