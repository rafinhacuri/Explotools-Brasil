<template>
  <NuxtLoadingIndicator color="#2563eb" />
  <Header />
  <main class="min-h-[calc(100vh-131px)]">
    <slot />
    <Toast position="bottom-right" class="max-w-[300px]" @contextmenu.prevent />
  </main>
</template>
