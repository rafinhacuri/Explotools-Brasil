<script setup lang="ts">
  import { brand, channels } from '~/data/content'

  const text = {
    title: 'Contatos',
    description:
      'Fale com a Explotools pelos canais oficiais: WhatsApp, e-mail, Instagram, TikTok, LinkedIn e Facebook. Atendimento técnico para mineração, sondagem e perfuração.',
    eyebrow: 'Explotools Brasil',
    heading: ['Entre em', 'contato.'],
    lede: 'Fale com a gente pelos canais oficiais e conheça soluções de alta qualidade para mineração, sondagem e perfuração.',
    whatsapp: 'Falar no WhatsApp',
    email: 'Enviar e-mail',
    supportEyebrow: 'Atendimento especializado',
    supportTitle: 'Suporte para quem opera no campo.',
    supportText:
      'Suporte para ferramentas de sondagem, produtos técnicos e soluções para operações de campo.',
    where: 'Onde estamos',
    country: 'Brasil · Chile',
    copy: 'Copiar e-mail',
    copied: 'E-mail copiado',
    open: 'Abrir',
  }

  useHead({ title: text.title })
  useSeoMeta({ description: text.description })
  defineOgImage('Explotools.takumi', { title: 'Entre em contato.', description: text.lede })

  const toast = useToast()
  const { copy, copied } = useClipboard({ source: brand.email })

  async function copyEmail(): Promise<void> {
    await copy(brand.email)
    toast.success(text.copied)
  }
</script>

<template>
  <div>
    <section class="relative overflow-hidden pt-32 pb-16 sm:pt-40">
      <div aria-hidden="true" class="absolute inset-x-0 bottom-0 h-[55%]">
        <Strata :layers="6" :seed="21" :depth="220" :vein="2" />
      </div>
      <div
        aria-hidden="true"
        class="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_20%,rgb(254_0_24/0.18)_0%,transparent_70%)]" />

      <div class="relative mx-auto max-w-[90rem] px-5 sm:px-8">
        <Motion
          as="p"
          class="label text-red"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :transition="{ delay: 0.2 }">
          {{ text.eyebrow }}
        </Motion>
        <h1 class="mt-5 display text-giant">
          <span v-for="(line, index) in text.heading" :key="line" class="block overflow-hidden">
            <Motion
              as="span"
              class="block"
              :class="index === 1 ? 'text-red' : ''"
              :initial="{ y: '105%' }"
              :animate="{ y: '0%' }"
              :transition="{
                type: 'spring',
                bounce: 0.1,
                duration: 1.2,
                delay: 0.25 + index * 0.1,
              }">
              {{ line }}
            </Motion>
          </span>
        </h1>
        <Reveal :delay="0.5">
          <div class="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <p class="max-w-xl text-lede text-muted">{{ text.lede }}</p>
            <div class="flex flex-wrap gap-3">
              <Magnet :strength="0.2">
                <Btn :to="brand.whatsapp" size="lg" icon="simple-icons:whatsapp">{{
                  text.whatsapp
                }}</Btn>
              </Magnet>
              <Btn
                :to="`mailto:${brand.email}`"
                size="lg"
                variant="ghost"
                icon="ph:envelope-simple"
                >{{ text.email }}</Btn
              >
            </div>
          </div>
        </Reveal>
      </div>
    </section>

    <section class="relative bg-furo pb-24">
      <ul class="mx-auto max-w-[90rem] border-t border-line px-5 sm:px-8">
        <Reveal
          v-for="(channel, index) in channels"
          :key="channel.id"
          as="li"
          :delay="index * 0.04"
          :y="16">
          <a
            :href="channel.href"
            :target="channel.href.startsWith('http') ? '_blank' : undefined"
            rel="noopener"
            class="group relative flex items-center gap-5 overflow-hidden border-b border-line py-6 sm:gap-8 sm:py-8">
            <span
              aria-hidden="true"
              class="absolute inset-0 origin-bottom scale-y-0 bg-red transition-transform duration-500 ease-out-quint group-hover:scale-y-100 group-focus-visible:scale-y-100" />
            <span
              class="relative flex size-12 shrink-0 items-center justify-center rounded-2xl border border-line-strong transition-colors duration-300 group-hover:border-osso/40 sm:size-14">
              <Icon :name="channel.icon" class="size-5 sm:size-6" />
            </span>
            <span class="relative min-w-0 flex-1">
              <span
                class="block display text-[clamp(2.25rem,6vw,5rem)] leading-[0.9] transition-transform duration-500 ease-out-quint group-hover:translate-x-2">
                {{ channel.name }}
              </span>
              <span
                class="mt-1 block truncate font-mono text-[0.8125rem] text-muted transition-colors group-hover:text-osso/85">
                {{ channel.handle }}
              </span>
            </span>
            <Icon
              name="ph:arrow-up-right"
              class="relative size-7 shrink-0 text-faint transition-[color,transform] duration-500 ease-out-quint group-hover:rotate-45 group-hover:text-osso sm:size-9" />
          </a>
        </Reveal>
      </ul>
    </section>

    <section class="relative bg-osso py-20 text-furo sm:py-28">
      <div
        class="mx-auto grid max-w-[90rem] gap-12 px-5 sm:px-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <Reveal>
          <Eyebrow tone="ink">{{ text.supportEyebrow }}</Eyebrow>
          <h2 class="mt-5 display text-display text-balance">{{ text.supportTitle }}</h2>
          <p class="mt-5 max-w-lg text-lede text-furo/70">{{ text.supportText }}</p>
        </Reveal>
        <Reveal :delay="0.1">
          <div class="grid gap-3">
            <div class="flex items-center justify-between gap-4 rounded-2xl bg-osso-2 p-5">
              <div class="min-w-0">
                <p class="label text-furo/55">E-mail</p>
                <a
                  :href="`mailto:${brand.email}`"
                  class="mt-1 block truncate text-[1.0625rem] font-semibold hover:text-red">
                  {{ brand.email }}
                </a>
              </div>
              <button
                type="button"
                class="flex size-11 shrink-0 items-center justify-center rounded-full border border-furo/15 transition-colors hover:border-red hover:text-red"
                :aria-label="text.copy"
                @click="copyEmail">
                <Icon :name="copied ? 'ph:check' : 'ph:copy'" class="size-5" />
              </button>
            </div>
            <div class="flex items-center justify-between gap-4 rounded-2xl bg-osso-2 p-5">
              <div>
                <p class="label text-furo/55">{{ text.where }}</p>
                <p class="mt-1 text-[1.0625rem] font-semibold">{{ text.country }}</p>
              </div>
              <a
                href="https://maps.app.goo.gl/FGUcQ1ZqUXyxKMsT8"
                target="_blank"
                rel="noopener"
                class="flex h-11 items-center gap-2 rounded-full border border-furo/15 px-4 text-[0.875rem] font-semibold transition-colors hover:border-red hover:text-red">
                <Icon name="ph:map-pin" class="size-4" />
                {{ text.open }}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  </div>
</template>
