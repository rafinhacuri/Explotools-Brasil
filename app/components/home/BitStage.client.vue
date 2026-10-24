<script setup lang="ts">
  import type { HeroScene } from '~/lib/three/hero'

  const props = defineProps({
    progress: { type: Number, required: true },
  })

  const emit = defineEmits<{ rpm: [value: number]; hover: [value: boolean] }>()

  const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
  const ready = ref(false)
  const visible = useElementVisibility(canvas)
  const visibility = useDocumentVisibility()
  const reducedMotion = usePreferredReducedMotion()
  const { pixelRatio } = useDevicePixelRatio()
  const size = useElementSize(canvas)

  let scene: HeroScene | null = null
  let pointer: { x: number; y: number } | null = null
  let hovering = false
  let tapUntil = 0

  function toDevice(clientX: number, clientY: number): { x: number; y: number } | null {
    const rect = canvas.value?.getBoundingClientRect()
    if (!rect || rect.width === 0) return null
    return {
      x: ((clientX - rect.left) / rect.width) * 2 - 1,
      y: -(((clientY - rect.top) / rect.height) * 2 - 1),
    }
  }

  const { pause, resume } = useRafFn(
    ({ delta }) => {
      if (!scene) return
      const boost = hovering || performance.now() < tapUntil
      scene.frame(delta / 1000, {
        progress: props.progress,
        pointer,
        calm: reducedMotion.value === 'reduce',
        boost,
      })
      emit('rpm', scene.currentRpm)
      ready.value = true
    },
    { immediate: false },
  )

  const active = computed(() => visible.value && visibility.value === 'visible')

  watch(active, (on) => {
    if (on && scene) resume()
    else pause()
  })

  watch([size.width, size.height, pixelRatio], () => {
    scene?.resize(size.width.value, size.height.value, pixelRatio.value)
  })

  useEventListener(
    globalThis,
    'pointermove',
    (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      pointer = toDevice(event.clientX, event.clientY)
      const next = Boolean(pointer && scene?.hits(pointer.x, pointer.y))
      if (next !== hovering) {
        hovering = next
        emit('hover', next)
      }
    },
    { passive: true },
  )

  useEventListener(
    globalThis,
    'pointerdown',
    (event: PointerEvent) => {
      const point = toDevice(event.clientX, event.clientY)
      if (point && scene?.hits(point.x, point.y)) tapUntil = performance.now() + 2600
    },
    { passive: true },
  )

  onMounted(async () => {
    if (!document.createElement('canvas').getContext('webgl2')) return
    const element = await until(canvas).toBeTruthy()
    try {
      await document.fonts.ready
      const { HeroScene } = await import('~/lib/three/hero')
      scene = new HeroScene(element)
    } catch (error) {
      console.error('Hero scene unavailable, continuing without it.', error)
      return
    }
    scene.resize(size.width.value, size.height.value, pixelRatio.value)
    if (active.value) resume()
  })

  onBeforeUnmount(() => {
    pause()
    scene?.dispose()
    scene = null
  })
</script>

<template>
  <canvas ref="canvas" aria-hidden="true" class="canvas-fade size-full" :data-ready="ready" />
</template>
