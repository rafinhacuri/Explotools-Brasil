<script setup lang="ts">
  const props = defineProps({
    label: { type: String, required: true },
    name: { type: String, required: true },
    error: { type: String, default: '' },
    type: { type: String, default: 'text' },
    placeholder: { type: String, default: '' },
    autocomplete: { type: String, default: 'off' },
    inputmode: {
      type: String as PropType<'text' | 'email' | 'tel' | 'numeric' | 'search'>,
      default: 'text',
    },
    tone: { type: String as PropType<'dark' | 'light'>, default: 'dark' },
  })

  const model = defineModel<string>({ default: '' })
  const id = useId()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label
      :for="id"
      class="text-[0.8125rem] font-medium"
      :class="props.tone === 'dark' ? 'text-fg/80' : 'text-furo/75'">
      {{ props.label }}
    </label>
    <div class="relative">
      <input
        :id="id"
        v-model="model"
        :name="props.name"
        :type="props.type"
        :placeholder="props.placeholder"
        :autocomplete="props.autocomplete"
        :inputmode="props.inputmode"
        :aria-invalid="Boolean(props.error)"
        :aria-describedby="props.error ? `${id}-error` : undefined"
        class="h-12 w-full rounded-xl border px-4 text-[0.9375rem] transition-[border-color,box-shadow,background-color] duration-200 outline-none placeholder:text-faint focus:ring-4"
        :class="[
          props.tone === 'dark'
            ? 'border-line-strong bg-furo/60 text-fg focus:border-red focus:ring-red/20'
            : 'border-furo/15 bg-white text-furo placeholder:text-furo/35 focus:border-red focus:ring-red/15',
          props.error ? 'border-red' : '',
        ]" />
      <slot name="trailing" />
    </div>
    <Transition
      enter-active-class="transition duration-200 ease-out-quint"
      enter-from-class="-translate-y-1 opacity-0"
      leave-active-class="transition duration-100"
      leave-to-class="opacity-0">
      <p
        v-if="props.error"
        :id="`${id}-error`"
        class="flex items-center gap-1.5 text-[0.8125rem] text-red">
        <Icon name="ph:warning-circle" class="size-4" />
        {{ props.error }}
      </p>
    </Transition>
  </div>
</template>
