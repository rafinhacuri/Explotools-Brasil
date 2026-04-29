<script setup lang="ts">
const socials = [
  { label: 'Instagram', icon: 'i-simple-icons-instagram', to: 'https://www.instagram.com/explotools.brasil?igsh=mwc2ohbxc3ozejhsda==' },
  { label: 'Facebook', icon: 'i-simple-icons-facebook', to: 'https://www.facebook.com/share/p1veqrfsk8bvwvuu/?mibextid=qi2omg' },
  { label: 'Google Maps', icon: 'i-lucide-map-pin', to: 'https://maps.app.goo.gl/fgucq1zquxyxkmst8' },
  { label: 'LinkedIn', icon: 'i-simple-icons-linkedin', to: 'https://www.linkedin.com/in/explotools-brasil-b6ba58273' },
]
</script>

<template>
  <footer class="relative overflow-hidden border-t border-red-500/20 bg-black">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(253,1,22,0.24),transparent_35%)]" />
    <div class="absolute left-0 top-0 h-px w-full bg-linear-to-r from-transparent via-[#FD0116] to-transparent" />

    <UFooter
      :ui="{
        root: 'relative',
        container: 'py-10 lg:flex lg:items-center lg:justify-between lg:gap-8',
        left: 'flex flex-col items-center gap-4 lg:items-start',
        center: 'mt-8 lg:mt-0',
        right: 'mt-8 flex justify-center gap-3 lg:mt-0 lg:justify-end'
      }"
    >
      <template #left>
        <p class="max-w-md text-center text-sm leading-6 text-white/60 lg:text-left">
          © {{ new Date().getFullYear() }} Explotools Brasil — Ferramentas de sondagem de alta qualidade. Todos os direitos reservados.
        </p>
      </template>



      <template #right>
        <UTooltip v-for="social in socials" :key="social.label" :text="social.label">
          <UButton
            :to="social.to"
            :icon="social.icon"
            external
            target="_blank"
            color="error"
            variant="soft"
            size="xl"
            :aria-label="social.label"
            class="rounded-full border border-red-500/20 bg-red-950/30 text-white shadow-[0_0_18px_rgba(253,1,22,0.18)] transition duration-300 hover:-translate-y-1 hover:bg-[#FD0116] hover:shadow-[0_0_26px_rgba(253,1,22,0.55)]"
          />
        </UTooltip>
      </template>
    </UFooter>
  </footer>
</template>