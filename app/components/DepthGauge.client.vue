<script setup lang="ts">
  const props = defineProps({
    total: { type: Number, default: 1200 },
  })

  const text = { label: 'Profundidade' }
  const { y } = useWindowScroll()
  const { height } = useWindowSize()
  const page = ref(1)

  useResizeObserver(document.body, () => {
    page.value = Math.max(document.documentElement.scrollHeight - height.value, 1)
  })

  const progress = computed(() => clamp(y.value / page.value))
  const meters = computed(() => String(Math.round(progress.value * props.total)).padStart(4, '0'))
  const ticks = Array.from({ length: 25 }, (_, index) => index)
</script>

<template>
  <div
    aria-hidden="true"
    class="pointer-events-none fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 xl:flex">
    <span class="label text-[0.625rem] text-fg/50 [writing-mode:vertical-rl]">{{
      text.label
    }}</span>
    <div class="relative h-[38vh] w-4">
      <span
        v-for="tick in ticks"
        :key="tick"
        class="absolute right-0 h-px bg-fg/30"
        :class="tick % 4 === 0 ? 'w-4' : 'w-2'"
        :style="{ top: `${(tick / (ticks.length - 1)) * 100}%` }" />
      <span
        class="absolute right-0 flex -translate-y-1/2 flex-row-reverse items-center gap-2 transition-[top] duration-150 ease-out"
        :style="{ top: `${progress * 100}%` }">
        <span class="h-0.5 w-5 bg-red" />
        <span class="font-mono text-[0.6875rem] whitespace-nowrap text-fg tabular-nums"
          >{{ meters }} m</span
        >
      </span>
    </div>
  </div>
</template>
