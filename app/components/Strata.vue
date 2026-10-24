<script setup lang="ts">
  import { useScroll, useTransform } from 'motion-v'

  const props = defineProps({
    layers: { type: Number, default: 6 },
    seed: { type: Number, default: 7 },
    depth: { type: Number, default: 260 },
    vein: { type: Number, default: 2 },
  })

  const root = useTemplateRef<HTMLElement>('root')
  const { scrollYProgress } = useScroll({ target: root, offset: ['start end', 'end start'] })

  const WIDTH = 1600
  const HEIGHT = 900
  const tones = ['#2e2323', '#261d1e', '#1f191a', '#191516', '#141213', '#0f0e0f', '#0a0a0b']

  function random(seed: number): () => number {
    let value = seed
    return () => {
      value = (value * 16_807) % 2_147_483_647
      return value / 2_147_483_647
    }
  }

  function ridge(index: number): string {
    const next = random(props.seed * 131 + index * 977)
    const base = 90 + (index / props.layers) * (HEIGHT * 0.62)
    const waves = [0, 1, 2].map(() => ({
      amp: 8 + next() * 34,
      freq: 0.6 + next() * 2.4,
      phase: next() * 6,
    }))
    let path = `M0 ${HEIGHT} L0 ${base}`
    for (let x = 0; x <= WIDTH; x += 40) {
      const t = x / WIDTH
      const y = waves.reduce(
        (sum, wave) => sum + Math.sin(t * Math.PI * 2 * wave.freq + wave.phase) * wave.amp,
        base,
      )
      path += ` L${x} ${y.toFixed(1)}`
    }
    return `${path} L${WIDTH} ${HEIGHT} Z`
  }

  const bands = Array.from({ length: props.layers }, (_, index) => ({
    index,
    d: ridge(index),
    fill: pick(tones, Math.round((index / Math.max(props.layers - 1, 1)) * (tones.length - 1))),
    vein: index === props.vein,
    y: useTransform(
      scrollYProgress,
      [0, 1],
      [(index + 1) * (props.depth / props.layers), -(index + 1) * (props.depth / props.layers)],
    ),
  }))
</script>

<template>
  <div ref="root" aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
    <Motion
      v-for="band in bands"
      :key="band.index"
      class="absolute inset-x-0 -top-[10%] h-[120%]"
      :style="{ y: band.y }">
      <svg :viewBox="`0 0 ${WIDTH} ${HEIGHT}`" preserveAspectRatio="none" class="size-full">
        <defs>
          <pattern
            :id="`grit-${props.seed}-${band.index}`"
            width="9"
            height="9"
            patternUnits="userSpaceOnUse">
            <circle cx="2" cy="3" r="0.6" fill="rgb(242 240 236 / 0.06)" />
            <circle cx="7" cy="7" r="0.45" fill="rgb(242 240 236 / 0.04)" />
          </pattern>
        </defs>
        <path :d="band.d" :fill="band.fill" />
        <path :d="band.d" :fill="`url(#grit-${props.seed}-${band.index})`" />
        <path
          :d="band.d"
          fill="none"
          :stroke="band.vein ? 'rgb(254 0 24 / 0.75)' : 'rgb(242 240 236 / 0.1)'"
          :stroke-width="band.vein ? 2 : 1"
          vector-effect="non-scaling-stroke" />
      </svg>
    </Motion>
  </div>
</template>
