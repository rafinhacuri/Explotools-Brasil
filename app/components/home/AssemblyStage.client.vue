<script setup lang="ts">
  import type { AssemblyScene } from '~/lib/three/assembly'

  const props = defineProps({
    explode: { type: Number, required: true },
    active: { type: Number, required: true },
  })

  const emit = defineEmits<{
    hover: [index: number]
    anchor: [point: { x: number; y: number } | null]
  }>()

  const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
  const ready = ref(false)
  const visible = useElementVisibility(canvas)
  const visibility = useDocumentVisibility()
  const reducedMotion = usePreferredReducedMotion()
  const { pixelRatio } = useDevicePixelRatio()
  const size = useElementSize(canvas)

  let scene: AssemblyScene | null = null
  let pointer: { x: number; y: number } | null = null
  let hovered = -1

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
        explode: props.explode,
        active: props.active,
        pointer,
        calm: reducedMotion.value === 'reduce',
      })
      const anchor = scene.anchor(hovered >= 0 ? hovered : props.active)
      emit(
        'anchor',
        anchor
          ? {
              x: ((anchor.x + 1) / 2) * size.width.value,
              y: ((1 - anchor.y) / 2) * size.height.value,
            }
          : null,
      )
      ready.value = true
    },
    { immediate: false },
  )

  const running = computed(() => visible.value && visibility.value === 'visible')

  watch(running, (on) => {
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
      if (next !== hovered) {
        hovered = next
        emit('hover', next)
      }
    },
    { passive: true },
  )

  onMounted(async () => {
    if (!document.createElement('canvas').getContext('webgl2')) return
    const element = await until(canvas).toBeTruthy()
    try {
      const { AssemblyScene } = await import('~/lib/three/assembly')
      scene = new AssemblyScene(element)
    } catch (error) {
      console.error('Assembly scene unavailable, continuing without it.', error)
      return
    }
    scene.resize(size.width.value, size.height.value, pixelRatio.value)
    if (running.value) resume()
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
