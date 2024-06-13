<template>
  <NuxtLoadingIndicator color="#2563eb" />
  <main class="min-h-[calc(100vh-131px)]">
    <slot />
    <Toast position="bottom-right" @contextmenu.prevent />
  </main>
</template>
