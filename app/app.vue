<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator color="repeating-linear-gradient(to right,#1d4ed8 0%,#60a5fa 100%)" />
  <NuxtLayout>
    <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
    <Toast position="bottom-right" />
  </NuxtLayout>
</template>

<!-- eslint-disable-next-line vue/no-restricted-block -->
<style scoped>
html, body {
    height: 100%;
    margin: 0;
    padding: 0;
}

body {
    background-color: #FFF;
  }

  body::-webkit-scrollbar {
    background-color: #020617;
}

body::-webkit-scrollbar-thumb {
    background-color: #1e293b;
    border: 4px solid #020617;
}

body::-webkit-scrollbar-track {
    background-color: #020617;
}

div::-webkit-scrollbar {
    background-color: #020617;
}

div::-webkit-scrollbar-thumb {
    background-color: #1e293b;
    border: 4px solid #020617;
}

div::-webkit-scrollbar-track {
    background-color: #020617;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
    filter: blur(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
  to {
    opacity: 0;
    transform: translateY(10px);
    filter: blur(2px);
  }
}

.page-enter-active {
  animation: fadeIn 0.4s ease-out;
}

.page-leave-active {
  animation: fadeOut 0.4s ease-in;
}
</style>
