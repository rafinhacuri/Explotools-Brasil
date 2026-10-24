<script setup lang="ts">
  import { brand, channels } from '~/data/content'

  const text = {
    primary: 'Principal',
    home: 'Explotools Brasil, página inicial',
    quote: 'Pedir orçamento',
    menu: 'Abrir menu',
    close: 'Fechar menu',
    talk: 'Fale com um especialista',
  }

  const links = [
    { to: '/', label: 'Empresa' },
    { to: '/produtos', label: 'Produtos' },
    { to: '/selecao-matriz', label: 'Seleção de matriz' },
    { to: '/contatos', label: 'Contatos' },
  ]

  const route = useRoute()
  const { $lenis } = useNuxtApp()
  const { y } = useWindowScroll()
  const open = ref(false)
  const hidden = ref(false)
  let last = 0

  const scrolled = computed(() => y.value > 12)
  const socials = channels.filter((channel) =>
    ['instagram', 'tiktok', 'linkedin', 'facebook'].includes(channel.id),
  )

  function isActive(to: string): boolean {
    return to === '/' ? route.path === '/' : route.path.startsWith(to)
  }

  watch(y, (value) => {
    const delta = value - last
    if (Math.abs(delta) > 6) hidden.value = delta > 0 && value > 480 && !open.value
    last = value
  })

  watch(open, (value) => {
    if (value) $lenis?.stop()
    else $lenis?.start()
  })

  watch(
    () => route.path,
    () => {
      open.value = false
      hidden.value = false
    },
  )
</script>

<template>
  <Motion
    as="header"
    class="fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-out-quint"
    :class="hidden ? '-translate-y-full' : 'translate-y-0'"
    :initial="{ y: -24, opacity: 0 }"
    :animate="{ y: 0, opacity: 1 }"
    :transition="{ type: 'spring', bounce: 0, duration: 1, delay: 0.2 }">
    <div
      class="border-b transition-[background-color,border-color] duration-500"
      :class="scrolled ? 'border-line glass' : 'border-transparent'">
      <nav
        class="mx-auto flex h-18 max-w-[90rem] items-center justify-between gap-6 px-5 sm:px-8"
        :aria-label="text.primary">
        <NuxtLink to="/" class="text-[1.375rem]" :aria-label="text.home">
          <Logo tagline />
        </NuxtLink>

        <div class="hidden items-center gap-3 lg:flex">
          <ul class="flex items-center rounded-full border border-line bg-furo/40 p-1">
            <li v-for="link in links" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="relative flex h-9 items-center rounded-full px-4 text-[0.8125rem] font-medium transition-colors duration-200"
                :class="isActive(link.to) ? 'text-osso' : 'text-muted hover:text-fg'"
                :aria-current="isActive(link.to) ? 'page' : undefined">
                <Motion
                  v-if="isActive(link.to)"
                  layout-id="nav-active"
                  class="absolute inset-0 rounded-full bg-red"
                  :transition="{ type: 'spring', bounce: 0.18, duration: 0.55 }" />
                <span class="relative">{{ link.label }}</span>
              </NuxtLink>
            </li>
          </ul>
          <Magnet :strength="0.18">
            <Btn :to="brand.whatsapp" variant="light" icon="simple-icons:whatsapp">{{
              text.quote
            }}</Btn>
          </Magnet>
        </div>

        <DialogRoot v-model:open="open">
          <DialogTrigger
            class="-mr-2 flex size-11 items-center justify-center lg:hidden"
            :aria-label="text.menu">
            <span class="relative block h-3 w-6">
              <span class="absolute inset-x-0 top-0 h-0.5 rounded-full bg-fg" />
              <span class="absolute right-0 bottom-0 h-0.5 w-4 rounded-full bg-red" />
            </span>
          </DialogTrigger>

          <DialogPortal>
            <DialogContent
              class="sheet fixed inset-0 z-60 flex flex-col overflow-y-auto bg-furo/97 px-5 pt-4 pb-8 backdrop-blur-xl lg:hidden"
              :aria-describedby="undefined">
              <div class="flex h-10 items-center justify-between">
                <DialogTitle as="div" class="text-[1.25rem]">
                  <Logo />
                </DialogTitle>
                <DialogClose
                  class="-mr-2 flex size-11 items-center justify-center"
                  :aria-label="text.close">
                  <Icon name="ph:x" class="size-6" />
                </DialogClose>
              </div>

              <ul class="mt-12 flex flex-col">
                <li v-for="(link, index) in links" :key="link.to" class="border-b border-line">
                  <Motion
                    :initial="{ opacity: 0, x: -24 }"
                    :animate="{ opacity: 1, x: 0 }"
                    :transition="{ type: 'spring', bounce: 0, duration: 0.6, delay: 0.05 * index }">
                    <NuxtLink
                      :to="link.to"
                      class="flex items-center justify-between py-4 display text-[2.75rem] leading-none"
                      :class="isActive(link.to) ? 'text-red' : 'text-fg'">
                      {{ link.label }}
                      <Icon name="ph:arrow-up-right" class="size-6 text-faint" />
                    </NuxtLink>
                  </Motion>
                </li>
              </ul>

              <div class="mt-auto flex flex-col gap-6 pt-10">
                <div class="flex gap-2">
                  <a
                    v-for="social in socials"
                    :key="social.id"
                    :href="social.href"
                    target="_blank"
                    rel="noopener"
                    :aria-label="social.name"
                    class="flex size-12 items-center justify-center rounded-full border border-line-strong text-fg/80">
                    <Icon :name="social.icon" class="size-5" />
                  </a>
                </div>
                <Btn :to="brand.whatsapp" size="lg" icon="simple-icons:whatsapp">{{
                  text.talk
                }}</Btn>
              </div>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>
      </nav>
    </div>
  </Motion>
</template>
