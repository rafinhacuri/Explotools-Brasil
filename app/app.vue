<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator color="repeating-linear-gradient(to right,#1d4ed8 0%,#60a5fa 100%)" />
  <NuxtLayout>
    <NuxtPage />
    <Toast position="bottom-right" />
  </NuxtLayout>
</template>

<!-- eslint-disable-next-line vue/no-restricted-block -->
<style scoped>
* {
    transition-property: background-color, border-color;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 500ms;
}

*::-webkit-scrollbar {
    background-color: #fff;
    width: 16px;
}

*::-webkit-scrollbar-track {
    background-color: #fff;
}

*::-webkit-scrollbar-thumb {
    background-color: #babac0;
    border-radius: 16px;
    border: 4px solid #fff;
}

*::-webkit-scrollbar-button {
    display: none;
}

.slide-left-enter-active, .slide-left-leave-active, .slide-right-enter-active, .slide-right-leave-active {
    transition: all 0.2s;
  }

  .slide-left-enter-from {
    opacity: 0;
    transform: translate(50px, 0);
  }

  .slide-left-leave-to {
    opacity: 0;
    transform: translate(-50px, 0);
  }

  .slide-right-enter-from {
    opacity: 0;
    transform: translate(-50px, 0);
  }

  .slide-right-leave-to {
    opacity: 0;
    transform: translate(50px, 0);
  }

 body {
    background-color: #FFF;
  }
</style>
