<template>
  <NuxtLoadingIndicator color="#2563eb" />
  <Header />
  <main class="min-h-[calc(100vh-267px)]">
    <slot />
    <Button id="scrollTopButton" class="fixed bottom-5 right-5 z-50 size-14 animate-bounce rounded-full bg-[#5BF070] transition-opacity ease-in-out" @click="navigateTo('https://wa.link/vb9urm', { open: { target: '_blank' } })">
      <template #icon>
        <Icon name="ic:baseline-whatsapp" color="white" size="40" />
      </template>
    </Button>
    <Toast position="bottom-right" class="max-w-[300px]" @contextmenu.prevent />
  </main>
  <Footer />
</template>
