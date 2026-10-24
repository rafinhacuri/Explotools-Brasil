<script setup lang="ts">
  const props = defineProps({
    depth: { type: Number, default: -1 },
    tone: { type: String as PropType<'red' | 'ink'>, default: 'red' },
  })

  const meters = computed(() => String(props.depth).padStart(4, '0'))
</script>

<template>
  <p
    class="flex items-center gap-3 label"
    :class="props.tone === 'red' ? 'text-red' : 'text-furo/70'">
    <span v-if="props.depth >= 0" class="tabular-nums">{{ meters }} m</span>
    <span class="h-px w-8 bg-current opacity-60" />
    <span :class="props.tone === 'red' ? 'text-fg/80' : 'text-furo'"><slot /></span>
  </p>
</template>
