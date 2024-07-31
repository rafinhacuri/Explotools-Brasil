<script setup lang="ts">
const midias = ref([
  { href: 'https://www.instagram.com/explotools.brasil?igsh=MWc2OHBxc3ozejhsdA==', icon: 'line-md:instagram', text: 'Instagram' },
  { href: 'https://www.facebook.com/share/p1veqrfSK8BVwVUU/?mibextid=qi2Omg', icon: 'line-md:facebook', text: 'Facebook' },
  { href: 'https://www.linkedin.com/in/explotools-brasil-b6ba58273', icon: 'line-md:linkedin', text: 'LinkedIn' },
  { href: 'https://www.flickr.com/photos/cbpf_mctic/albums', icon: 'line-md:map-marker', text: 'Google Maps' },
])
</script>

<template>
  <div class="bg-gradient-to-r from-teal-400 to-violet-300">
    <div class="mx-6 flex h-screen items-center justify-center">
      <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 class="mb-6 text-center text-2xl font-bold text-gray-800">
          Entre em Contato
        </h2>
        <div v-for="{href, icon, text} in midias" :key="text">
          <NuxtLink
            :href="href"
            target="_blank"
            class="mb-4 flex items-center justify-start rounded-lg p-4 shadow-md transition-transform hover:scale-105 hover:bg-gray-100"
          >
            <Icon :name="icon" size="24" class="text-teal-500" />
            <span class="ml-3 text-lg font-medium text-gray-800">{{ text }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
