<script setup lang="ts">
  const props = defineProps({
    title: { type: String, required: true },
    description: { type: String, required: true },
    action: { type: String, default: 'Excluir' },
    loading: { type: Boolean, default: false },
  })

  const emit = defineEmits<{ confirm: [] }>()
  const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <AlertDialogRoot v-model:open="open">
    <AlertDialogPortal>
      <AlertDialogOverlay class="scrim fixed inset-0 z-80 bg-furo/80 backdrop-blur-sm" />
      <AlertDialogContent
        class="sheet fixed top-1/2 left-1/2 z-90 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-line-strong bg-rocha p-7 shadow-float outline-none">
        <span
          class="flex size-12 items-center justify-center rounded-2xl bg-red/12 text-red ring-1 ring-red/30">
          <Icon name="ph:trash" class="size-6" />
        </span>
        <AlertDialogTitle class="mt-5 display text-[2rem] leading-none">{{
          props.title
        }}</AlertDialogTitle>
        <AlertDialogDescription class="mt-3 text-[0.9375rem] text-muted">{{
          props.description
        }}</AlertDialogDescription>
        <div class="mt-8 flex justify-end gap-2">
          <AlertDialogCancel
            class="h-11 rounded-full border border-line-strong px-5 text-[0.875rem] font-semibold hover:border-fg/50">
            Cancelar
          </AlertDialogCancel>
          <Btn :loading="props.loading" @click="emit('confirm')">{{ props.action }}</Btn>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
