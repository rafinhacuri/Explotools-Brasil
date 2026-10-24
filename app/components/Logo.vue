<script setup lang="ts">
  const props = defineProps({
    word: { type: Boolean, default: true },
    tagline: { type: Boolean, default: false },
  })

  const text = { tagline: 'Ferramentas para sondagem' }
</script>

<template>
  <span class="inline-flex items-center gap-3">
    <svg :viewBox="MARK_VIEWBOX" class="h-[1.6em] w-auto shrink-0 text-red" aria-hidden="true">
      <path fill="currentColor" :d="MARK_PATH" />
    </svg>
    <span v-if="props.word" class="flex flex-col gap-[0.32em] leading-none">
      <svg :viewBox="WORD_VIEWBOX" class="h-[0.62em] w-auto text-red" aria-hidden="true">
        <path fill="currentColor" :d="WORD_PATH" />
      </svg>
      <span
        v-if="props.tagline"
        class="wide text-[0.36em] font-medium tracking-[0.22em] whitespace-nowrap text-fg/70">
        {{ text.tagline }}
      </span>
    </span>
    <span class="sr-only">Explotools Brasil</span>
  </span>
</template>
