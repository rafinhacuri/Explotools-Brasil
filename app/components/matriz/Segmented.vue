<script setup lang="ts">
  const props = defineProps({
    label: { type: String, required: true },
    options: { type: Array as PropType<readonly string[]>, required: true },
    hint: { type: String, default: '' },
  })

  const model = defineModel<string>({ required: true })
  const id = useId()
</script>

<template>
  <div>
    <div class="flex items-center gap-2">
      <span :id="id" class="text-[0.875rem] font-semibold">{{ props.label }}</span>
      <TooltipRoot v-if="props.hint">
        <TooltipTrigger
          class="flex size-6 items-center justify-center rounded-full text-faint hover:text-fg"
          :aria-label="`Sobre ${props.label}`">
          <Icon name="ph:info" class="size-4" />
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent
            side="top"
            :side-offset="6"
            class="pop z-100 max-w-72 rounded-xl border border-line-strong bg-rocha-2 px-3 py-2 text-[0.8125rem] text-fg/90 shadow-float">
            {{ props.hint }}
            <TooltipArrow class="fill-rocha-2" />
          </TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    </div>
    <RadioGroupRoot
      v-model="model"
      :aria-labelledby="id"
      class="mt-2.5 flex flex-wrap gap-1 rounded-2xl border border-line bg-furo/60 p-1">
      <RadioGroupItem
        v-for="option in props.options"
        :key="option"
        :value="option"
        class="relative h-10 flex-1 rounded-xl px-3 text-[0.8125rem] font-medium whitespace-nowrap transition-colors data-[state=checked]:text-osso data-[state=unchecked]:text-muted data-[state=unchecked]:hover:text-fg">
        <Motion
          v-if="model === option"
          :layout-id="`seg-${id}`"
          class="absolute inset-0 rounded-xl bg-red"
          :transition="{ type: 'spring', bounce: 0.18, duration: 0.45 }" />
        <span class="relative">{{ option }}</span>
      </RadioGroupItem>
    </RadioGroupRoot>
  </div>
</template>
