<script setup lang="ts">
  import { brand } from '~/data/content'

  const text = { label: 'Fale com um especialista' }
  const { y } = useWindowScroll()
  const visible = computed(() => y.value > 320)
</script>

<template>
  <Transition
    enter-active-class="transition duration-500 ease-spring"
    enter-from-class="translate-y-6 scale-75 opacity-0"
    leave-active-class="transition duration-200 ease-out"
    leave-to-class="translate-y-4 opacity-0">
    <a
      v-if="visible"
      :href="brand.whatsapp"
      target="_blank"
      rel="noopener"
      :aria-label="text.label"
      class="group fixed right-4 bottom-4 z-45 flex h-14 items-center gap-0 overflow-hidden rounded-full bg-red pr-4.5 pl-4.5 text-osso shadow-red transition-[gap,padding] duration-500 ease-spring hover:gap-2.5 sm:right-6 sm:bottom-6">
      <span
        class="absolute inset-0 animate-ping rounded-full bg-red/40 [animation-duration:2.4s]" />
      <Icon name="simple-icons:whatsapp" class="relative size-5 shrink-0" />
      <span
        class="relative max-w-0 overflow-hidden text-[0.875rem] font-semibold whitespace-nowrap transition-[max-width] duration-500 ease-spring group-hover:max-w-56">
        {{ text.label }}
      </span>
    </a>
  </Transition>
</template>
