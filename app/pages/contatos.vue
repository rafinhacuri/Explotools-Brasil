<script setup lang="ts">
  import { brand, channels } from '~/data/content'

  const text = {
    title: 'Contatos',
    description:
      'Fale com a Explotools pelos canais oficiais: WhatsApp, e-mail, Instagram, TikTok, LinkedIn e Facebook. Atendimento técnico para mineração, sondagem e perfuração.',
    eyebrow: 'Explotools Brasil',
    heading: ['Entre em', 'contato.'],
    lede: 'Fale com a gente pelos canais oficiais. Mande sua lista de necessidades pelo WhatsApp e respondemos hoje mesmo, com atendimento técnico para quem opera no campo.',
    whatsapp: 'Falar no WhatsApp',
    whatsappHint: 'Resposta no mesmo dia',
    email: 'E-mail',
    copy: 'Copiar e-mail',
    copied: 'E-mail copiado',
    where: 'Onde estamos',
    country: 'Brasil · Chile',
    open: 'Abrir no mapa',
  }

  useHead({ title: text.title })
  useSeoMeta({ description: text.description })
  defineOgImage('Explotools.takumi', { title: 'Entre em contato.', description: text.lede })

  const toast = useToast()
  const { copy, copied } = useClipboard({ source: brand.email })
  const socials = new Set(['instagram', 'tiktok', 'linkedin', 'facebook'])
  const grid = channels.filter((channel) => socials.has(channel.id))

  async function copyEmail(): Promise<void> {
    await copy(brand.email)
    toast.success(text.copied)
  }
</script>

<template>
  <section class="relative flex min-h-dvh flex-col overflow-hidden pt-24 pb-10 lg:pt-28">
    <div aria-hidden="true" class="absolute inset-x-0 bottom-0 h-[45%] opacity-80">
      <Strata :layers="6" :seed="21" :depth="140" :vein="-1" />
    </div>
    <div
      aria-hidden="true"
      class="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_15%_20%,rgb(254_0_24/0.16)_0%,transparent_70%)]" />

    <div
      class="relative mx-auto grid w-full max-w-[90rem] flex-1 gap-8 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
      <div class="flex flex-col">
        <Motion
          as="p"
          class="label text-red"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :transition="{ delay: 0.15 }">
          {{ text.eyebrow }}
        </Motion>
        <h1 class="mt-4 display text-[clamp(3.25rem,min(8vw,13dvh),7.5rem)] leading-[0.84]">
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
                duration: 1.1,
                delay: 0.2 + index * 0.1,
              }">
              {{ line }}
            </Motion>
          </span>
        </h1>
        <Reveal :delay="0.35">
          <p class="mt-5 max-w-lg text-[0.9375rem] text-muted sm:text-base">{{ text.lede }}</p>
        </Reveal>

        <Reveal :delay="0.45" class="mt-7 hidden lg:block">
          <Magnet :strength="0.15">
            <a
              :href="brand.whatsapp"
              target="_blank"
              rel="noopener"
              class="group flex items-center gap-4 rounded-3xl bg-red p-5 pr-7 text-osso shadow-red transition-transform duration-200 active:scale-[0.98]">
              <span class="flex size-14 items-center justify-center rounded-2xl bg-furo/20">
                <Icon name="simple-icons:whatsapp" class="size-7" />
              </span>
              <span class="flex-1">
                <span class="block display text-[2rem] leading-none">{{ text.whatsapp }}</span>
                <span class="mt-1 block label text-osso/80">{{ text.whatsappHint }}</span>
              </span>
              <Icon
                name="ph:arrow-up-right"
                class="size-7 transition-transform duration-300 group-hover:rotate-45" />
            </a>
          </Magnet>
        </Reveal>
      </div>

      <div class="flex flex-col gap-3">
        <Motion
          as="a"
          :href="brand.whatsapp"
          target="_blank"
          rel="noopener"
          class="group flex items-center gap-4 rounded-3xl bg-red p-4 text-osso shadow-red lg:hidden"
          :initial="{ opacity: 0, y: 16 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ type: 'spring', bounce: 0, duration: 0.7, delay: 0.3 }">
          <span class="flex size-12 items-center justify-center rounded-2xl bg-furo/20">
            <Icon name="simple-icons:whatsapp" class="size-6" />
          </span>
          <span class="flex-1">
            <span class="block display text-[1.75rem] leading-none">{{ text.whatsapp }}</span>
            <span class="mt-1 block label text-osso/80">{{ text.whatsappHint }}</span>
          </span>
          <Icon name="ph:arrow-up-right" class="size-6" />
        </Motion>

        <ul class="grid grid-cols-2 gap-3">
          <Motion
            v-for="(channel, index) in grid"
            :key="channel.id"
            as="li"
            :initial="{ opacity: 0, y: 20, scale: 0.97 }"
            :animate="{ opacity: 1, y: 0, scale: 1 }"
            :transition="{
              type: 'spring',
              bounce: 0.15,
              duration: 0.7,
              delay: 0.3 + index * 0.05,
            }">
            <a
              :href="channel.href"
              :target="channel.href.startsWith('http') ? '_blank' : undefined"
              rel="noopener"
              class="group relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-line bg-rocha/90 p-4 backdrop-blur transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-red sm:p-5">
              <span
                aria-hidden="true"
                class="absolute inset-0 origin-bottom scale-y-0 bg-red transition-transform duration-500 ease-out-quint group-hover:scale-y-100 group-focus-visible:scale-y-100" />
              <span class="relative flex items-center justify-between">
                <span
                  class="flex size-11 items-center justify-center rounded-2xl border border-line-strong transition-colors duration-300 group-hover:border-osso/40">
                  <Icon :name="channel.icon" class="size-5" />
                </span>
                <Icon
                  name="ph:arrow-up-right"
                  class="size-5 text-faint transition-[color,transform] duration-500 ease-out-quint group-hover:rotate-45 group-hover:text-osso" />
              </span>
              <span class="relative min-w-0">
                <span class="block display text-[clamp(1.5rem,2.4vw,2.125rem)] leading-none">
                  {{ channel.name }}
                </span>
                <span
                  class="mt-1.5 block truncate font-mono text-[0.75rem] text-muted transition-colors group-hover:text-osso/85">
                  {{ channel.handle }}
                </span>
              </span>
            </a>
          </Motion>
        </ul>

        <Motion
          class="grid gap-3 sm:grid-cols-2"
          :initial="{ opacity: 0, y: 16 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ type: 'spring', bounce: 0, duration: 0.7, delay: 0.65 }">
          <div
            class="flex items-center justify-between gap-3 rounded-3xl border border-line bg-rocha/90 p-4 backdrop-blur sm:p-5">
            <div class="min-w-0">
              <p class="label text-faint">{{ text.email }}</p>
              <a
                :href="`mailto:${brand.email}`"
                class="mt-1 block truncate text-[0.9375rem] font-semibold transition-colors hover:text-red">
                {{ brand.email }}
              </a>
            </div>
            <button
              type="button"
              class="flex size-10 shrink-0 items-center justify-center rounded-full border border-line-strong transition-colors hover:border-red hover:text-red"
              :aria-label="text.copy"
              @click="copyEmail">
              <Icon :name="copied ? 'ph:check' : 'ph:copy'" class="size-4" />
            </button>
          </div>
          <div
            class="flex items-center justify-between gap-3 rounded-3xl border border-line bg-rocha/90 p-4 backdrop-blur sm:p-5">
            <div>
              <p class="label text-faint">{{ text.where }}</p>
              <p class="mt-1 text-[0.9375rem] font-semibold">{{ text.country }}</p>
            </div>
            <a
              href="https://maps.app.goo.gl/FGUcQ1ZqUXyxKMsT8"
              target="_blank"
              rel="noopener"
              :aria-label="text.open"
              class="flex size-10 shrink-0 items-center justify-center rounded-full border border-line-strong transition-colors hover:border-red hover:text-red">
              <Icon name="ph:map-pin" class="size-4" />
            </a>
          </div>
        </Motion>
      </div>
    </div>
  </section>
</template>
