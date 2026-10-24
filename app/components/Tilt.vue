<script setup lang="ts">
  import { useSpring } from 'motion-v'

  const props = defineProps({
    max: { type: Number, default: 8 },
  })

  const el = useTemplateRef<HTMLElement>('el')
  const spring = { stiffness: 220, damping: 20, mass: 0.5 }
  const rotateX = useSpring(0, spring)
  const rotateY = useSpring(0, spring)
  const glareX = ref(50)
  const glareY = ref(50)
  const hot = ref(false)

  function move(event: PointerEvent): void {
    if (event.pointerType !== 'mouse' || !el.value) return
    const rect = el.value.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    rotateY.set((x - 0.5) * props.max * 2)
    rotateX.set((0.5 - y) * props.max * 2)
    glareX.value = x * 100
    glareY.value = y * 100
    hot.value = true
  }

  function leave(): void {
    rotateX.set(0)
    rotateY.set(0)
    hot.value = false
  }
</script>

<template>
  <div ref="el" class="perspective-[1000px]" @pointermove="move" @pointerleave="leave">
    <Motion class="relative size-full transform-3d" :style="{ rotateX, rotateY }">
      <slot />
      <span
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        :class="hot ? 'opacity-100' : 'opacity-0'"
        :style="{
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgb(255 255 255 / 0.16), transparent 55%)`,
        }" />
    </Motion>
  </div>
</template>
