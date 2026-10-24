<script setup lang="ts">
  import { leadPhotos } from '~/data/content'

  definePageMeta({ layout: 'bare' })

  const text = {
    title: 'Cadastre-se',
    description:
      'Cadastre-se e tenha acesso antecipado a catálogos, ofertas exclusivas e pré-vendas da Explotools.',
    eyebrow: 'Cadastro Explotools',
    heading: ['Qualidade internacional,', 'preços nacionais.'],
    sub: 'Revolucione sua sondagem.',
    problem:
      'Um dos maiores desafios das empresas de sondagem rotativa diamantada no Brasil é o acesso a materiais de qualidade com preço justo: ou o importado de alta qualidade com valor elevado, ou o nacional acessível de qualidade inferior.',
    proposal:
      'Nossa proposta é oferecer produtos de qualidade importada a preços acessíveis — redução de custo significativa sem comprometer qualidade e produtividade.',
    maker:
      'Como fabricantes, temos controle total do processo, garantindo eficiência e competitividade. Resultados visíveis em apenas 30 dias de uso.',
    formTitle: 'Inscreva-se para mais informações',
    formSubmit: 'Quero acesso em primeira mão',
    whyEyebrow: 'Por que se cadastrar?',
    whyTitle: 'Benefícios exclusivos para quem se cadastra.',
    edgeTitle: 'Vantagens únicas.',
    trustTitle: 'A escolha certa para quem valoriza qualidade, inovação e resultado.',
    ctaOne: 'Não perca essa chance — cadastre-se agora',
    ctaTwo: 'Quero aumentar minha produtividade',
    back: 'Ir para o site',
  }

  useHead({ title: text.title })
  useSeoMeta({ description: text.description, robots: 'noindex' })
  defineOgImage('Explotools.takumi', {
    title: 'Qualidade internacional, preços nacionais.',
    description: text.sub,
  })

  const benefits = [
    {
      icon: 'ph:tag',
      title: 'Ofertas exclusivas',
      body: 'Promoções especiais que só encontrará conosco, para maximizar sua produtividade com economia.',
    },
    {
      icon: 'ph:book-open-text',
      title: 'Acesso antecipado aos catálogos',
      body: 'Seja o primeiro a explorar nossos produtos e planeje suas operações de sondagem com mais eficiência.',
    },
    {
      icon: 'ph:rocket-launch',
      title: 'Participação em pré-vendas',
      body: 'Prioridade e preços especiais nos lançamentos, com acesso privilegiado.',
    },
  ]

  const edges = [
    {
      title: 'Os melhores produtos primeiro',
      body: 'Acesso aos produtos de última geração antes de todos, aumentando sua produtividade.',
    },
    {
      title: 'Preços e condições especiais',
      body: 'Tarifas exclusivas que otimizam seus custos de sondagem.',
    },
    {
      title: 'Inovações em primeira mão',
      body: 'Seja pioneiro nas nossas inovações mais recentes e em tecnologias de ponta.',
    },
  ]

  const trust = [
    'Como fabricantes, investimos em alta tecnologia e maquinário computadorizado para atender aos mais altos padrões de qualidade.',
    'Presença em mais de 12 países, atendendo com excelência clientes em toda a América Latina.',
    'Fundada por um especialista com mais de 20 anos de experiência no mercado de sondagem.',
    'Produtos submetidos a rigorosos padrões de qualidade, com desempenho superior e durabilidade.',
    'Equipe dedicada de pesquisa e desenvolvimento, sempre na vanguarda da inovação.',
  ]

  const formCard = useTemplateRef<HTMLElement>('formCard')
  const formVisible = useElementVisibility(formCard)
  const { $lenis } = useNuxtApp()

  function toForm(): void {
    if (!formCard.value) return
    if ($lenis) $lenis.scrollTo(formCard.value, { offset: -24, duration: 1.4 })
    else formCard.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  async function done(): Promise<void> {
    await navigateTo('/obrigado')
  }

  const columns = [leadPhotos, leadPhotos.toReversed()]
</script>

<template>
  <div class="relative overflow-x-clip">
    <header class="absolute inset-x-0 top-0 z-20">
      <div class="mx-auto flex h-20 max-w-[90rem] items-center justify-between px-5 sm:px-8">
        <NuxtLink to="/" class="text-[1.375rem]" :aria-label="text.back">
          <Logo tagline />
        </NuxtLink>
      </div>
    </header>

    <section class="relative min-h-dvh overflow-hidden pt-28 pb-16 lg:pt-32">
      <div
        aria-hidden="true"
        class="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_10%,rgb(254_0_24/0.2)_0%,transparent_70%)]" />
      <div aria-hidden="true" class="absolute inset-x-0 bottom-0 h-1/2 opacity-70">
        <Strata :layers="5" :seed="5" :depth="140" :vein="2" />
      </div>

      <div
        class="relative mx-auto grid max-w-[90rem] gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <Motion
            as="p"
            class="label text-red"
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :transition="{ delay: 0.15 }">
            {{ text.eyebrow }}
          </Motion>
          <h1 class="mt-5 display text-[clamp(3rem,7.4vw,7rem)] leading-[0.86]">
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
          <Motion
            as="p"
            class="mt-4 wide text-[clamp(0.85rem,1.3vw,1rem)] text-fg/80"
            :initial="{ opacity: 0, letterSpacing: '0.5em' }"
            :animate="{ opacity: 1, letterSpacing: '0.16em' }"
            :transition="{ duration: 1.2, delay: 0.5 }">
            {{ text.sub }}
          </Motion>

          <div class="mt-8 flex max-w-xl flex-col gap-4 text-[0.9375rem] text-muted sm:text-base">
            <Reveal :delay="0.6"
              ><p>{{ text.problem }}</p></Reveal
            >
            <Reveal :delay="0.7"
              ><p class="text-fg/90">{{ text.proposal }}</p></Reveal
            >
            <Reveal :delay="0.8"
              ><p>{{ text.maker }}</p></Reveal
            >
          </div>

          <div
            aria-hidden="true"
            class="mt-10 hidden h-64 gap-3 overflow-hidden mask-[linear-gradient(transparent,#000_20%,#000_80%,transparent)] lg:flex">
            <div v-for="(column, c) in columns" :key="c" class="flex-1 overflow-hidden">
              <div
                class="flex flex-col gap-3 [--marquee-duration:30s]"
                :class="
                  c === 0
                    ? 'animate-[rise_30s_linear_infinite]'
                    : 'animate-[fall_30s_linear_infinite]'
                ">
                <NuxtImg
                  v-for="(src, i) in [...column, ...column]"
                  :key="i"
                  :src="src"
                  width="320"
                  alt=""
                  class="aspect-square w-full rounded-xl object-cover" />
              </div>
            </div>
            <div class="flex-1 overflow-hidden">
              <div class="flex animate-[rise_38s_linear_infinite] flex-col gap-3">
                <NuxtImg
                  v-for="(src, i) in [
                    ...leadPhotos.slice(3),
                    ...leadPhotos.slice(0, 3),
                    ...leadPhotos.slice(3),
                    ...leadPhotos.slice(0, 3),
                  ]"
                  :key="i"
                  :src="src"
                  width="320"
                  alt=""
                  class="aspect-square w-full rounded-xl object-cover" />
              </div>
            </div>
          </div>
        </div>

        <Motion
          :initial="{ opacity: 0, y: 30, scale: 0.98 }"
          :animate="{ opacity: 1, y: 0, scale: 1 }"
          :transition="{ type: 'spring', bounce: 0.1, duration: 1, delay: 0.4 }"
          class="lg:sticky lg:top-8">
          <div
            ref="formCard"
            class="rounded-[2rem] border border-line-strong bg-rocha/90 p-6 shadow-float backdrop-blur-xl sm:p-9">
            <div class="flex items-center gap-3">
              <span class="flex size-10 items-center justify-center rounded-xl bg-red text-osso">
                <Icon name="ph:envelope-simple-open" class="size-5" />
              </span>
              <h2 class="text-title font-semibold">{{ text.formTitle }}</h2>
            </div>
            <LeadForm class="mt-7" :submit="text.formSubmit" @done="done" />
          </div>
        </Motion>
      </div>
    </section>

    <section class="relative bg-osso py-20 text-furo sm:py-28">
      <div class="mx-auto max-w-[90rem] px-5 sm:px-8">
        <Reveal>
          <Eyebrow tone="ink">{{ text.whyEyebrow }}</Eyebrow>
          <h2 class="mt-5 max-w-4xl display text-display text-balance">{{ text.whyTitle }}</h2>
        </Reveal>
        <div class="mt-12 grid gap-4 md:grid-cols-3">
          <Reveal v-for="(item, index) in benefits" :key="item.title" :delay="index * 0.08">
            <article
              class="flex h-full flex-col gap-6 rounded-3xl bg-white p-7 shadow-[0_1px_0_rgb(10_10_11/0.06)]">
              <Icon :name="item.icon" class="size-9 text-red" />
              <h3 class="display text-[2rem] leading-none">{{ item.title }}</h3>
              <p class="text-[0.9375rem] text-furo/65">{{ item.body }}</p>
            </article>
          </Reveal>
        </div>

        <Reveal class="mt-20">
          <h2 class="display text-headline">{{ text.edgeTitle }}</h2>
        </Reveal>
        <ul class="mt-8 border-t border-furo/10">
          <Reveal v-for="(item, index) in edges" :key="item.title" as="li" :delay="index * 0.06">
            <div class="grid gap-2 border-b border-furo/10 py-6 md:grid-cols-[1fr_1.2fr] md:gap-10">
              <p class="text-title font-semibold">{{ item.title }}</p>
              <p class="text-lede text-furo/65">{{ item.body }}</p>
            </div>
          </Reveal>
        </ul>

        <div class="mt-12 flex justify-center">
          <Btn size="lg" trailing="ph:arrow-up" @click="toForm">{{ text.ctaOne }}</Btn>
        </div>
      </div>
    </section>

    <section class="relative bg-furo py-20 sm:py-28">
      <div class="mx-auto max-w-[90rem] px-5 sm:px-8">
        <Reveal>
          <svg :viewBox="MARK_VIEWBOX" class="h-14 w-auto text-red" aria-hidden="true">
            <path fill="currentColor" :d="MARK_PATH" />
          </svg>
          <h2 class="mt-6 max-w-4xl display text-display text-balance">{{ text.trustTitle }}</h2>
        </Reveal>
        <ul
          class="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          <Reveal
            v-for="(item, index) in trust"
            :key="item"
            as="li"
            :delay="index * 0.05"
            class="flex gap-4 bg-furo p-7">
            <Icon name="ph:check-circle-fill" class="mt-0.5 size-5 shrink-0 text-red" />
            <p class="text-[0.9375rem] text-fg/85">{{ item }}</p>
          </Reveal>
          <li class="flex items-center justify-center bg-red p-7">
            <button
              type="button"
              class="display text-[2rem] leading-none text-osso"
              @click="toForm">
              {{ text.ctaTwo }} →
            </button>
          </li>
        </ul>
      </div>
    </section>

    <Transition
      enter-active-class="transition duration-500 ease-spring"
      enter-from-class="translate-y-full"
      leave-active-class="transition duration-300"
      leave-to-class="translate-y-full">
      <div v-if="!formVisible" class="fixed inset-x-0 bottom-0 z-40 p-3 lg:hidden">
        <Btn size="lg" class="w-full" trailing="ph:arrow-up" @click="toForm">{{ text.ctaTwo }}</Btn>
      </div>
    </Transition>
  </div>
</template>
