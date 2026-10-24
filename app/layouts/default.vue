<script setup lang="ts">
  const text = { skip: 'Pular para o conteúdo' }
</script>

<template>
  <div>
    <a
      href="#main"
      class="sr-only z-70 rounded-full bg-red px-4 py-2 text-sm text-osso focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
      {{ text.skip }}
    </a>
    <Header />
    <DepthGauge />
    <main id="main" class="relative">
      <slot />
    </main>
    <Footer />
    <WhatsAppFab />
  </div>
</template>
