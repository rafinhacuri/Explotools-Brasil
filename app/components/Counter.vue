<script setup lang="ts">
  import { animate, useInView } from 'motion-v'

  const props = defineProps({
    to: { type: Number, required: true },
    prefix: { type: String, default: '' },
    suffix: { type: String, default: '' },
    duration: { type: Number, default: 1.6 },
  })

  const el = useTemplateRef<HTMLElement>('el')
  const inView = useInView(el, { once: true, amount: 0.6 })
  const value = ref(0)

  watch(inView, (seen) => {
    if (!seen) return
    animate(0, props.to, {
      duration: props.duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest: number) => {
        value.value = Math.round(latest)
      },
    })
  })
</script>

<template>
  <span ref="el" class="tabular-nums">
    <span class="sr-only">{{ props.prefix }}{{ props.to }}{{ props.suffix }}</span>
    <span aria-hidden="true">{{ props.prefix }}{{ value }}{{ props.suffix }}</span>
  </span>
</template>
