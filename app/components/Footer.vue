<script setup lang="ts">
  import { brand, channels } from '~/data/content'

  const text = {
    pitch: 'Fabricante de ferramentas e consumíveis para sondagem diamantada wireline.',
    pages: 'Navegação',
    talk: 'Contato',
    credit: 'Desenvolvido por',
    rights: 'Todos os direitos reservados.',
    top: 'Voltar ao topo',
  }

  const pages = [
    { to: '/', label: 'Empresa' },
    { to: '/produtos', label: 'Produtos' },
    { to: '/selecao-matriz', label: 'Seleção de matriz' },
    { to: '/contatos', label: 'Contatos' },
  ]

  const { $lenis } = useNuxtApp()
  const year = new Date().getFullYear()

  function toTop(): void {
    if ($lenis) $lenis.scrollTo(0, { duration: 1.8 })
    else globalThis.scrollTo({ top: 0, behavior: 'smooth' })
  }
</script>

<template>
  <footer class="relative z-10 overflow-hidden border-t border-line bg-furo">
    <div
      class="mx-auto grid max-w-[90rem] gap-12 px-5 pt-16 pb-10 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
      <div class="flex flex-col gap-5">
        <Logo tagline class="text-[1.75rem]" />
        <p class="max-w-sm text-[0.9375rem] text-muted">{{ text.pitch }}</p>
        <p class="label text-faint">{{ brand.promise }}</p>
      </div>

      <nav :aria-label="text.pages">
        <p class="label text-faint">{{ text.pages }}</p>
        <ul class="mt-4 flex flex-col gap-2">
          <li v-for="page in pages" :key="page.to">
            <NuxtLink
              :to="page.to"
              class="text-[0.9375rem] text-fg/80 transition-colors hover:text-red">
              {{ page.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div>
        <p class="label text-faint">{{ text.talk }}</p>
        <ul class="mt-4 flex flex-col gap-2">
          <li v-for="channel in channels" :key="channel.id">
            <a
              :href="channel.href"
              :target="channel.href.startsWith('http') ? '_blank' : undefined"
              rel="noopener"
              class="group inline-flex items-center gap-2.5 text-[0.9375rem] text-fg/80 transition-colors hover:text-fg">
              <Icon
                :name="channel.icon"
                class="size-4 text-faint transition-colors group-hover:text-red" />
              {{ channel.name }}
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div aria-hidden="true" class="pointer-events-none px-3 select-none">
      <svg :viewBox="WORD_VIEWBOX" class="w-full text-rocha-2">
        <path fill="currentColor" :d="WORD_PATH" />
      </svg>
    </div>

    <div class="border-t border-line">
      <div
        class="mx-auto flex max-w-[90rem] flex-col gap-3 px-5 py-6 text-[0.8125rem] text-faint sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© {{ year }} {{ brand.name }}. {{ text.rights }}</p>
        <div class="flex items-center gap-6">
          <p>
            {{ text.credit }}
            <a
              href="https://curi.dev.br"
              target="_blank"
              rel="noopener"
              class="font-medium text-fg/80 underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-red">
              Rafael Curi
            </a>
          </p>
          <button
            type="button"
            class="group inline-flex items-center gap-1.5 text-fg/80 transition-colors hover:text-fg"
            @click="toTop">
            {{ text.top }}
            <Icon
              name="ph:arrow-up"
              class="size-3.5 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>
