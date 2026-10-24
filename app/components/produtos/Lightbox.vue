<script setup lang="ts">
  import type { Photo } from '~/data/content'
  import { brand, categories } from '~/data/content'

  const props = defineProps({
    photos: { type: Array as PropType<Photo[]>, required: true },
  })

  const index = defineModel<number | null>('index', { default: null })

  const text = {
    close: 'Fechar',
    previous: 'Foto anterior',
    next: 'Próxima foto',
    quote: 'Pedir orçamento',
  }

  const open = computed({
    get: () => index.value !== null,
    set: (value: boolean) => {
      if (!value) index.value = null
    },
  })

  const current = computed(() => (index.value === null ? null : props.photos[index.value]))
  const category = computed(() => categories.find((item) => item.id === current.value?.category))
  const direction = ref(1)

  function go(step: number): void {
    if (index.value === null) return
    direction.value = step
    index.value = (index.value + step + props.photos.length) % props.photos.length
  }

  function key(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') go(1)
    if (event.key === 'ArrowLeft') go(-1)
  }
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay class="scrim fixed inset-0 z-80 bg-furo/90 backdrop-blur-md" />
      <DialogContent
        class="sheet fixed inset-0 z-90 flex flex-col p-4 outline-none sm:p-8"
        :aria-describedby="undefined"
        @keydown="key">
        <div class="flex items-center justify-between gap-4">
          <DialogTitle class="flex flex-col">
            <span class="label text-red">{{ category?.name }}</span>
            <span class="mt-1 display text-[1.75rem] leading-none">{{ current?.title }}</span>
          </DialogTitle>
          <div class="flex items-center gap-2">
            <span class="hidden font-mono text-[0.8125rem] text-faint tabular-nums sm:inline">
              {{ (index ?? 0) + 1 }} / {{ props.photos.length }}
            </span>
            <DialogClose
              class="flex size-11 items-center justify-center rounded-full border border-line-strong transition-colors hover:border-fg/60"
              :aria-label="text.close">
              <Icon name="ph:x" class="size-5" />
            </DialogClose>
          </div>
        </div>

        <div class="relative mt-4 flex min-h-0 flex-1 items-center justify-center">
          <button
            type="button"
            class="absolute left-0 z-10 flex size-12 items-center justify-center rounded-full border border-line-strong bg-furo/60 backdrop-blur transition-colors hover:border-red hover:text-red"
            :aria-label="text.previous"
            @click="go(-1)">
            <Icon name="ph:arrow-left" class="size-5" />
          </button>
          <Transition
            mode="out-in"
            enter-active-class="transition duration-300 ease-out-quint"
            :enter-from-class="
              direction > 0 ? 'translate-x-8 opacity-0' : '-translate-x-8 opacity-0'
            "
            leave-active-class="transition duration-150"
            leave-to-class="opacity-0">
            <img
              v-if="current"
              :key="current.id"
              :src="current.src"
              :alt="current.title"
              class="max-h-full max-w-full rounded-2xl object-contain shadow-float" />
          </Transition>
          <button
            type="button"
            class="absolute right-0 z-10 flex size-12 items-center justify-center rounded-full border border-line-strong bg-furo/60 backdrop-blur transition-colors hover:border-red hover:text-red"
            :aria-label="text.next"
            @click="go(1)">
            <Icon name="ph:arrow-right" class="size-5" />
          </button>
        </div>

        <div class="mt-4 flex justify-center">
          <Btn :to="brand.whatsapp" icon="simple-icons:whatsapp">{{ text.quote }}</Btn>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
