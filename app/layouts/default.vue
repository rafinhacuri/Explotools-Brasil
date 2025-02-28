<script setup lang="ts">
</script>

<template>
  <Header />
  <main class="min-h-[calc(100vh-267px)]">
    <slot />
    <Button id="scrollTopButton" class="fixed bottom-5 right-5 z-50 size-14 animate-bounce rounded-full bg-[#5BF070] text-white transition-opacity ease-in-out" @click="navigateTo('https://wa.link/c1di0k', { open: { target: '_blank' } })">
      <template #icon>
        <Icon name="ic:baseline-whatsapp" color="white" size="40" />
      </template>
    </Button>
  </main>
  <Footer />
</template>
