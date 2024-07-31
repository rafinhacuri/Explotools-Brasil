<template>
  <NuxtLoadingIndicator color="#2563eb" />
  <Header />
  <main class="min-h-[calc(100vh-267px)]">
    <slot />
    <Toast position="bottom-right" class="max-w-[300px]" @contextmenu.prevent />
  </main>
  <Footer />
</template>
