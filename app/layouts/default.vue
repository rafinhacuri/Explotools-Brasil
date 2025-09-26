<script setup lang="ts">
</script>

<template>
  <Header />
  <main class="min-h-[calc(100vh-267px)]">
    <slot />
    <UButton class="fixed right-5 bottom-5 z-50 size-14 animate-bounce rounded-full bg-[#5BF070] text-white transition-opacity ease-in-out" :ui="{}" @click="navigateTo('https://wa.link/c1di0k', { open: { target: '_blank' } })">
      <template #leading>
        <UIcon name="ic-baseline-whatsapp" class="size-96" />
      </template>
    </UButton>
  </main>
  <Footer />
</template>
