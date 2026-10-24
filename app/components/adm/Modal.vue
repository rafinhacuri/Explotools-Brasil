<script setup lang="ts">
  const props = defineProps({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    wide: { type: Boolean, default: false },
  })

  const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay class="scrim fixed inset-0 z-80 bg-furo/80 backdrop-blur-sm" />
      <DialogContent
        class="sheet fixed top-1/2 left-1/2 z-90 max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-line-strong bg-rocha p-6 shadow-float outline-none sm:p-8"
        :class="props.wide ? 'max-w-2xl' : 'max-w-md'">
        <div class="flex items-start justify-between gap-4">
          <div>
            <DialogTitle class="display text-[2rem] leading-none">{{ props.title }}</DialogTitle>
            <DialogDescription v-if="props.description" class="mt-2 text-[0.875rem] text-muted">
              {{ props.description }}
            </DialogDescription>
          </div>
          <DialogClose
            class="-mt-1 -mr-2 flex size-10 shrink-0 items-center justify-center rounded-full text-fg/60 hover:bg-fg/5 hover:text-fg"
            aria-label="Fechar">
            <Icon name="ph:x" class="size-5" />
          </DialogClose>
        </div>
        <div class="mt-6">
          <slot />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
