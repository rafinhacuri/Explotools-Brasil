<script setup lang="ts">
useHead({ title: 'Contatos' })

const midias = ref([
  { href: 'https://wa.link/c1di0k', icon: 'i-simple-icons-whatsapp', text: 'WhatsApp', description: 'Atendimento rápido e direto', color: 'from-emerald-500 to-green-600' },
  { href: 'mailto:ramoncuri@explotools.com.br', icon: 'i-lucide-mail', text: 'Email', description: 'ramoncuri@explotools.com.br', color: 'from-red-600 to-red-500' },
  { href: 'https://www.instagram.com/explotools.brasil?igsh=MWc2OHBxc3ozejhsdA==', icon: 'i-simple-icons-instagram', text: 'Instagram', description: 'Produtos, novidades e bastidores', color: 'from-pink-600 to-red-500' },
  { href: 'https://www.facebook.com/share/p1veqrfSK8BVwVUU/?mibextid=qi2Omg', icon: 'i-simple-icons-facebook', text: 'Facebook', description: 'Acompanhe nossas atualizações', color: 'from-blue-600 to-blue-500' },
  { href: 'https://www.linkedin.com/in/explotools-brasil-b6ba58273', icon: 'i-simple-icons-linkedin', text: 'LinkedIn', description: 'Conexões profissionais', color: 'from-sky-600 to-blue-600' },
  { href: 'https://maps.app.goo.gl/FGUcQ1ZqUXyxKMsT8', icon: 'i-lucide-map-pin', text: 'Google Maps', description: 'Veja nossa localização', color: 'from-red-600 to-orange-500' },
  { href: 'https://www.tiktok.com/@explotools.brasil?_t=8pFnT9iDWli&_r=1', icon: 'i-simple-icons-tiktok', text: 'TikTok', description: 'Conteúdos rápidos e novidades', color: 'from-zinc-700 to-black' },
])
</script>

<template>
  <section class="relative min-h-screen overflow-hidden bg-black px-4 py-16 text-white">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(253,1,22,0.28),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(253,1,22,0.18),transparent_35%)]" />
    <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-size-[48px_48px]" />
    <div class="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#FD0116]/20 blur-[120px]" />

    <UContainer class="relative">
      <div class="mx-auto max-w-3xl text-center">
        <UBadge color="error" variant="soft" size="lg" class="mb-6 rounded-full px-5 py-2 uppercase tracking-[0.25em]">
          Explotools Brasil
        </UBadge>

        <h1 class="bg-linear-to-r from-white via-red-100 to-red-500 bg-clip-text text-4xl font-black tracking-tight text-transparent md:text-6xl">
          Entre em Contato
        </h1>

        <p class="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/65 md:text-lg">
          Fale conosco pelos nossos canais oficiais e conheça soluções de alta qualidade para mineração, sondagem e perfuração.
        </p>
      </div>

      <div class="mt-14 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <UCard
          :ui="{
            root: 'overflow-hidden border border-red-500/20 bg-zinc-950/80 shadow-[0_0_45px_rgba(253,1,22,0.16)] backdrop-blur-xl',
            body: 'p-6 md:p-8'
          }"
        >
          <div class="mb-8 flex items-center gap-4">
            <div class="flex size-14 items-center justify-center rounded-2xl bg-[#FD0116] shadow-[0_0_30px_rgba(253,1,22,0.55)]">
              <UIcon name="i-lucide-radio-tower" class="size-7 text-white" />
            </div>

            <div>
              <h2 class="text-2xl font-black">
                Canais oficiais
              </h2>
              <p class="text-sm text-white/50">
                Escolha a melhor forma de falar com a Explotools.
              </p>
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <NuxtLink
              v-for="{ href, icon, text, description, color } in midias"
              :key="text"
              :href="href"
              target="_blank"
              external
              class="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/4 p-5 transition duration-300 hover:-translate-y-1 hover:border-red-500/50 hover:bg-red-950/30 hover:shadow-[0_0_30px_rgba(253,1,22,0.25)]"
            >
              <div :class="`absolute -right-10 -top-10 size-28 rounded-full bg-linear-to-br ${color} opacity-20 blur-2xl transition duration-300 group-hover:opacity-45`" />

              <div class="relative flex items-start gap-4">
                <div :class="`flex size-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ${color} shadow-lg transition duration-300 group-hover:scale-110`">
                  <UIcon :name="icon" class="size-6 text-white" />
                </div>

                <div>
                  <p class="font-black text-white">
                    {{ text }}
                  </p>
                </div>
              </div>
            </NuxtLink>
          </div>
        </UCard>

        <div class="space-y-6">
          <UCard
            :ui="{
              root: 'border border-red-500/20 bg-gradient-to-br from-red-950/40 to-zinc-950/90 shadow-[0_0_45px_rgba(253,1,22,0.14)] backdrop-blur-xl',
              body: 'p-6 md:p-8'
            }"
          >
            <div class="flex items-center gap-4">
              <div class="flex size-14 items-center justify-center rounded-2xl bg-white/10">
                <UIcon name="i-lucide-shield-check" class="size-7 text-red-500" />
              </div>

              <div>
                <h3 class="text-xl font-black">
                  Atendimento especializado
                </h3>
                <p class="mt-1 text-sm leading-6 text-white/55">
                  Suporte para ferramentas de sondagem, produtos técnicos e soluções para operações de campo.
                </p>
              </div>
            </div>
          </UCard>

          <UCard
            :ui="{
              root: 'border border-white/10 bg-white/[0.04] backdrop-blur-xl',
              body: 'p-6 md:p-8'
            }"
          >
            <div class="space-y-5">
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-mail" class="size-5 text-red-500" />
                <span class="text-sm text-white/65">ramoncuri@explotools.com.br</span>
              </div>

              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-map-pin" class="size-5 text-red-500" />
                <span class="text-sm text-white/65">Brasil</span>
              </div>

              <USeparator class="opacity-20" />

              <UButton
                to="https://wa.link/c1di0k"
                external
                target="_blank"
                icon="i-simple-icons-whatsapp"
                color="error"
                size="xl"
                block
                class="rounded-2xl font-bold shadow-[0_0_25px_rgba(253,1,22,0.35)] transition hover:scale-[1.02]"
              >
                Falar no WhatsApp
              </UButton>
            </div>
          </UCard>
        </div>
      </div>
    </UContainer>
  </section>
</template>