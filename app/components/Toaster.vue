<script setup lang="ts">
  const { toasts, dismiss } = useToast()

  const icons = {
    success: 'ph:check-circle-fill',
    error: 'ph:warning-circle-fill',
    info: 'ph:info-fill',
  }
</script>

<template>
  <ToastProvider swipe-direction="right" :duration="4200">
    <ToastRoot
      v-for="toast in toasts"
      :key="toast.id"
      class="toast flex items-center gap-3 rounded-2xl border border-line-strong bg-rocha-2/95 px-4 py-3.5 text-[0.9375rem] shadow-float backdrop-blur-xl"
      @update:open="(open: boolean) => !open && dismiss(toast.id)">
      <Icon
        :name="icons[toast.tone]"
        class="size-5 shrink-0"
        :class="
          toast.tone === 'success'
            ? 'text-emerald-400'
            : toast.tone === 'error'
              ? 'text-red'
              : 'text-fg/70'
        " />
      <ToastTitle class="flex-1 text-fg">{{ toast.title }}</ToastTitle>
      <ToastClose
        class="-mr-1 flex size-8 items-center justify-center rounded-full text-fg/50 transition-colors hover:text-fg"
        aria-label="Fechar">
        <Icon name="ph:x" class="size-4" />
      </ToastClose>
    </ToastRoot>
    <ToastViewport
      class="fixed right-4 bottom-4 z-100 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2 outline-none sm:right-6 sm:bottom-6" />
  </ToastProvider>
</template>
