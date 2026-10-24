<script setup lang="ts">
  import { useSpring } from 'motion-v'

  const props = defineProps({
    strength: { type: Number, default: 0.28 },
  })

  const el = useTemplateRef<HTMLElement>('el')
  const spring = { stiffness: 260, damping: 18, mass: 0.6 }
  const x = useSpring(0, spring)
  const y = useSpring(0, spring)

  function move(event: PointerEvent): void {
    if (event.pointerType !== 'mouse' || !el.value) return
    const rect = el.value.getBoundingClientRect()
    x.set((event.clientX - rect.left - rect.width / 2) * props.strength)
    y.set((event.clientY - rect.top - rect.height / 2) * props.strength)
  }

  function leave(): void {
    x.set(0)
    y.set(0)
  }
</script>

<template>
  <span ref="el" class="inline-flex" @pointermove="move" @pointerleave="leave">
    <Motion as="span" class="inline-flex" :style="{ x, y }">
      <slot />
    </Motion>
  </span>
</template>
