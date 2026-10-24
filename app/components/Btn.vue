<script setup lang="ts">
  import type { RouteLocationRaw } from 'vue-router'

  const props = defineProps({
    to: { type: [String, Object] as PropType<RouteLocationRaw>, default: undefined },
    variant: { type: String as PropType<'red' | 'ghost' | 'light' | 'dark'>, default: 'red' },
    size: { type: String as PropType<'md' | 'lg'>, default: 'md' },
    icon: { type: String, default: '' },
    trailing: { type: String, default: '' },
    loading: { type: Boolean, default: false },
    type: { type: String as PropType<'button' | 'submit'>, default: 'button' },
    external: { type: Boolean, default: false },
  })

  const tones = {
    red: 'bg-red text-osso shadow-red hover:bg-[#ff1a30]',
    ghost: 'border border-line-strong text-fg hover:border-fg/60 hover:bg-fg/5',
    light: 'bg-osso text-furo hover:bg-white',
    dark: 'bg-furo text-osso hover:bg-rocha-2',
  }

  const sizes = { md: 'h-11 px-5 text-[0.875rem]', lg: 'h-14 px-7 text-[0.9375rem]' }

  const classes = computed(() => [
    'group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full font-semibold whitespace-nowrap transition-[background-color,border-color,transform,box-shadow] duration-200 select-none active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50',
    tones[props.variant],
    sizes[props.size],
  ])

  const isExternal = computed(
    () =>
      props.external ||
      (typeof props.to === 'string' && /^(?:https?:|mailto:|tel:)/u.test(props.to)),
  )
</script>

<template>
  <NuxtLink
    v-if="props.to"
    :to="props.to"
    :external="isExternal"
    :target="
      isExternal && typeof props.to === 'string' && props.to.startsWith('http')
        ? '_blank'
        : undefined
    "
    :rel="isExternal ? 'noopener' : undefined"
    :class="classes">
    <Icon v-if="props.icon" :name="props.icon" class="size-[1.15em] shrink-0" />
    <span><slot /></span>
    <Icon
      v-if="props.trailing"
      :name="props.trailing"
      class="size-[1.1em] shrink-0 transition-transform duration-300 ease-out-quint group-hover:translate-x-0.5" />
  </NuxtLink>
  <button
    v-else
    :type="props.type"
    :class="classes"
    :disabled="props.loading"
    :aria-busy="props.loading">
    <Icon v-if="props.loading" name="ph:circle-notch-bold" class="size-[1.15em] animate-spin" />
    <Icon v-else-if="props.icon" :name="props.icon" class="size-[1.15em] shrink-0" />
    <span><slot /></span>
    <Icon
      v-if="props.trailing && !props.loading"
      :name="props.trailing"
      class="size-[1.1em] shrink-0 transition-transform duration-300 ease-out-quint group-hover:translate-x-0.5" />
  </button>
</template>
