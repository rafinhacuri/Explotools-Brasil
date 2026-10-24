<script setup lang="ts">
  import { channels } from '~/data/content'

  definePageMeta({ layout: 'bare' })

  const text = {
    title: 'Obrigado',
    important: 'Importante',
    heading: ['Falta só', 'um passo.'],
    lede: 'Agora falta apenas um passo para concluir sua inscrição e ter acesso a todas as novidades, ofertas e informações que vamos compartilhar.',
    step: 'Inscrição',
    follow: 'Siga nossas redes sociais',
    followText:
      'Toque nos ícones abaixo, siga a Explotools e fique por dentro de materiais, avisos e conteúdos exclusivos.',
    thanks:
      'Agradecemos por se cadastrar! Estamos ansiosos para compartilhar com você as melhores dicas e novidades do setor de sondagem.',
    site: 'Conhecer o site',
  }

  useHead({ title: text.title })
  useSeoMeta({ robots: 'noindex' })

  const socials = channels.filter((channel) =>
    ['instagram', 'tiktok', 'facebook', 'linkedin', 'maps'].includes(channel.id),
  )
</script>

<template>
  <div class="relative min-h-dvh overflow-hidden">
    <div
      aria-hidden="true"
      class="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgb(254_0_24/0.22)_0%,transparent_70%)]" />
    <div aria-hidden="true" class="absolute inset-x-0 bottom-0 h-[40%] opacity-80">
      <Strata :layers="5" :seed="9" :depth="120" :vein="3" />
    </div>

    <div
      class="relative mx-auto flex min-h-dvh max-w-3xl flex-col items-center px-5 pt-10 pb-20 text-center sm:px-8">
      <NuxtLink to="/" class="text-[1.375rem]" :aria-label="text.site">
        <Logo tagline />
      </NuxtLink>

      <Motion
        class="mt-14 flex size-24 items-center justify-center rounded-full bg-red shadow-red"
        :initial="{ scale: 0, rotate: -40 }"
        :animate="{ scale: 1, rotate: 0 }"
        :transition="{ type: 'spring', bounce: 0.45, duration: 0.9, delay: 0.2 }">
        <svg viewBox="0 0 24 24" class="size-12 text-osso" aria-hidden="true">
          <Motion
            as="path"
            d="M5 12.5l4.5 4.5L19 7.5"
            fill="none"
            stroke="currentColor"
            stroke-width="2.6"
            stroke-linecap="round"
            stroke-linejoin="round"
            :initial="{ pathLength: 0 }"
            :animate="{ pathLength: 1 }"
            :transition="{ duration: 0.6, delay: 0.6, ease: 'easeOut' }" />
        </svg>
      </Motion>

      <p class="mt-8 label text-red">{{ text.important }}</p>
      <h1 class="mt-3 display text-[clamp(3.5rem,11vw,8rem)] leading-[0.84]">
        <span v-for="(line, index) in text.heading" :key="line" class="block overflow-hidden">
          <Motion
            as="span"
            class="block"
            :class="index === 1 ? 'text-red' : ''"
            :initial="{ y: '105%' }"
            :animate="{ y: '0%' }"
            :transition="{ type: 'spring', bounce: 0.1, duration: 1.1, delay: 0.4 + index * 0.1 }">
            {{ line }}
          </Motion>
        </span>
      </h1>
      <Reveal :delay="0.6">
        <p class="mt-6 text-lede text-muted">{{ text.lede }}</p>
      </Reveal>

      <Reveal :delay="0.7" class="mt-10 w-full max-w-md">
        <div class="flex items-center justify-between label text-fg/70">
          <span>{{ text.step }}</span>
          <span class="tabular-nums"><Counter :to="90" suffix="%" :duration="1.4" /></span>
        </div>
        <div class="mt-3 h-2.5 overflow-hidden rounded-full bg-fg/10">
          <Motion
            class="h-full rounded-full bg-[linear-gradient(90deg,#b80012,#fe0018)]"
            :initial="{ width: '0%' }"
            :animate="{ width: '90%' }"
            :transition="{ duration: 1.4, delay: 0.9, ease: [0.22, 1, 0.36, 1] }" />
        </div>
      </Reveal>

      <Reveal :delay="0.8" class="mt-16">
        <h2 class="display text-headline">{{ text.follow }}</h2>
        <p class="mx-auto mt-4 max-w-xl text-[0.9375rem] text-muted sm:text-base">
          {{ text.followText }}
        </p>
      </Reveal>

      <ul class="mt-8 grid w-full grid-cols-2 gap-3 sm:grid-cols-5">
        <Motion
          v-for="(social, index) in socials"
          :key="social.id"
          as="li"
          :initial="{ opacity: 0, y: 24, scale: 0.9 }"
          :animate="{ opacity: 1, y: 0, scale: 1 }"
          :transition="{ type: 'spring', bounce: 0.3, duration: 0.8, delay: 1.1 + index * 0.07 }">
          <a
            :href="social.href"
            target="_blank"
            rel="noopener"
            class="group flex h-full flex-col items-center gap-3 rounded-2xl border border-line-strong bg-rocha/80 px-3 py-5 backdrop-blur transition-[border-color,background-color,transform] duration-300 hover:-translate-y-1 hover:border-red hover:bg-red">
            <Icon
              :name="social.icon"
              class="size-7 text-red transition-colors group-hover:text-osso" />
            <span class="text-[0.875rem] font-semibold">{{ social.name }}</span>
          </a>
        </Motion>
      </ul>

      <Reveal :delay="0.3" class="mt-14">
        <p class="max-w-xl text-[0.9375rem] text-fg/80">{{ text.thanks }}</p>
        <Btn to="/" variant="ghost" class="mt-8" trailing="ph:arrow-right">{{ text.site }}</Btn>
      </Reveal>
    </div>
  </div>
</template>
