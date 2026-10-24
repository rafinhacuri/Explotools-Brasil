<script setup lang="ts">
  import type { HelixScene } from '~/lib/three/helix'

  const props = defineProps({
    progress: { type: Number, required: true },
    sources: { type: Array as PropType<string[]>, required: true },
  })

  const emit = defineEmits<{ open: [index: number]; hover: [index: number] }>()

  const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
  const ready = ref(false)
  const visible = useElementVisibility(canvas)
  const visibility = useDocumentVisibility()
  const reducedMotion = usePreferredReducedMotion()
  const { pixelRatio } = useDevicePixelRatio()
  const size = useElementSize(canvas)
  const hovered = ref(-1)

  let scene: HelixScene | null = null
  let pointer: { x: number; y: number } | null = null

  function toDevice(clientX: number, clientY: number): { x: number; y: number } | null {
    const rect = canvas.value?.getBoundingClientRect()
    if (!rect || rect.width === 0) return null
    const x = ((clientX - rect.left) / rect.width) * 2 - 1
    const y = -(((clientY - rect.top) / rect.height) * 2 - 1)
    return Math.abs(x) <= 1 && Math.abs(y) <= 1 ? { x, y } : null
  }

  const { pause, resume } = useRafFn(
    ({ delta }) => {
      if (!scene) return
      scene.frame(delta / 1000, {
        progress: props.progress,
        pointer,
        calm: reducedMotion.value === 'reduce',
      })
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
      if (event.pointerType === 'touch' || !scene) return
      pointer = toDevice(event.clientX, event.clientY)
      const next = pointer ? scene.pick(pointer.x, pointer.y) : -1
      if (next !== hovered.value) {
        hovered.value = next
        emit('hover', next)
      }
    },
    { passive: true },
  )

  function click(event: MouseEvent): void {
    const point = toDevice(event.clientX, event.clientY)
    const index = point && scene ? scene.pick(point.x, point.y) : -1
    if (index >= 0) emit('open', index)
  }

  onMounted(async () => {
    if (!document.createElement('canvas').getContext('webgl2')) return
    const element = await until(canvas).toBeTruthy()
    try {
      const { HelixScene } = await import('~/lib/three/helix')
      scene = new HelixScene(element, props.sources)
    } catch (error) {
      console.error('Helix scene unavailable, continuing without it.', error)
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
  <canvas
    ref="canvas"
    aria-hidden="true"
    class="canvas-fade size-full"
    :class="hovered >= 0 ? 'cursor-pointer' : ''"
    :data-ready="ready"
    @click="click" />
</template>
