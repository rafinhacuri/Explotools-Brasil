<script setup lang="ts">
  import { useMotionTemplate, useScroll, useTransform } from 'motion-v'

  const text = {
    eyebrow: 'Dentro da fábrica',
    title: ['Nós', 'fabricamos.'],
    body: 'Investimos em alta tecnologia e maquinário computadorizado para que cada peça atenda aos mais altos padrões de qualidade. Como fabricantes, temos controle total do processo — do desenho técnico à expedição.',
    tag: 'Usinagem CNC',
    sound: 'Ativar som',
    mute: 'Desativar som',
  }

  const section = useTemplateRef<HTMLElement>('section')
  const video = useTemplateRef<HTMLVideoElement>('video')
  const muted = ref(true)
  const visible = useElementVisibility(section)

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const inset = useTransform(scrollYProgress, (value) => 22 * (1 - band(value, 0, 0.45)))
  const radius = useTransform(scrollYProgress, (value) => 40 * (1 - band(value, 0, 0.45)))
  const clip = useMotionTemplate`inset(${inset}% ${inset}% ${inset}% ${inset}% round ${radius}px)`
  const scale = useTransform(scrollYProgress, (value) => 1.25 - 0.25 * band(value, 0, 0.45))
  const titleY = useTransform(scrollYProgress, (value) => `${40 * (1 - band(value, 0.2, 0.6))}%`)
  const titleOpacity = useTransform(scrollYProgress, (value) => band(value, 0.25, 0.5))

  watch(visible, async (on) => {
    if (!video.value) return
    if (!on) {
      video.value.pause()
      return
    }
    video.value.preload = 'auto'
    try {
      await video.value.play()
    } catch {
      // Autoplay bloqueado pelo navegador: o vídeo fica parado no primeiro quadro.
    }
  })
</script>

<template>
  <section ref="section" class="relative h-[260vh] bg-furo">
    <div class="sticky top-0 h-dvh overflow-hidden">
      <Motion class="absolute inset-0 will-change-[clip-path]" :style="{ clipPath: clip }">
        <Motion as="div" class="size-full" :style="{ scale }">
          <video
            ref="video"
            class="size-full object-cover"
            src="/video.mp4"
            preload="none"
            loop
            playsinline
            :muted="muted"
            aria-label="Usinagem de peças Explotools em torno CNC" />
        </Motion>
        <div class="absolute inset-0 bg-linear-to-t from-furo via-furo/30 to-furo/50" />
      </Motion>

      <div
        class="relative mx-auto flex h-full max-w-[90rem] flex-col justify-end px-5 pb-14 sm:px-8 sm:pb-20">
        <Motion :style="{ opacity: titleOpacity, y: titleY }">
          <Eyebrow :depth="340">{{ text.eyebrow }}</Eyebrow>
          <h2 class="mt-5 display text-giant">
            <span class="block">{{ text.title[0] }}</span>
            <span class="block text-red">{{ text.title[1] }}</span>
          </h2>
          <div class="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <p class="max-w-xl text-lede text-fg/85">{{ text.body }}</p>
            <div class="flex items-center gap-3">
              <span class="rounded-full border border-line-strong px-3 py-1.5 label text-fg/80">{{
                text.tag
              }}</span>
              <button
                type="button"
                class="flex size-11 items-center justify-center rounded-full border border-line-strong bg-furo/40 backdrop-blur transition-colors hover:border-fg/60"
                :aria-label="muted ? text.sound : text.mute"
                :aria-pressed="!muted"
                @click="muted = !muted">
                <Icon :name="muted ? 'ph:speaker-slash' : 'ph:speaker-high'" class="size-5" />
              </button>
            </div>
          </div>
        </Motion>
      </div>
    </div>
  </section>
</template>
