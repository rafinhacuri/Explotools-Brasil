<script setup lang="ts">
  import { countries } from '~/data/content'
  import type { GlobeScene } from '~/lib/three/globe'

  const props = defineProps({
    focus: { type: Number, default: -1 },
  })

  const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
  const ready = ref(false)
  const visible = useElementVisibility(canvas)
  const visibility = useDocumentVisibility()
  const reducedMotion = usePreferredReducedMotion()
  const { pixelRatio } = useDevicePixelRatio()
  const size = useElementSize(canvas)

  let scene: GlobeScene | null = null
  let drag = 0
  let start: number | null = null
  let base = 0

  const { pause, resume } = useRafFn(
    ({ delta }) => {
      if (!scene) return
      scene.frame(delta / 1000, {
        focus: props.focus,
        drag,
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

  function down(event: PointerEvent): void {
    start = event.clientX
    base = drag
    canvas.value?.setPointerCapture(event.pointerId)
  }

  function move(event: PointerEvent): void {
    if (start === null) return
    drag = base + ((event.clientX - start) / Math.max(size.width.value, 1)) * Math.PI
  }

  function up(): void {
    start = null
  }

  onMounted(async () => {
    if (!document.createElement('canvas').getContext('webgl2')) return
    const element = await until(canvas).toBeTruthy()
    try {
      const { GlobeScene } = await import('~/lib/three/globe')
      scene = new GlobeScene(element, countries)
    } catch (error) {
      console.error('Globe scene unavailable, continuing without it.', error)
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
    class="canvas-fade size-full cursor-grab touch-pan-y active:cursor-grabbing"
    :data-ready="ready"
    @pointerdown="down"
    @pointermove="move"
    @pointerup="up"
    @pointercancel="up" />
</template>
