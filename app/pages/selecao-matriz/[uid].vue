<script setup lang="ts">
useHead({ title: 'Recomendação' })
definePageMeta({ layout: false, colorMode: 'dark' })
const { uid } = useRoute().params

const id = Array.isArray(uid) ? uid[0] : uid

const { data } = await useFetch('/api/fetch/recomendacao', { method: 'POST', body: { _id: id } })
</script>

<template>
  <section>
    <UCard v-if="data">
      <template #header>
        <div class="flex items-center space-x-2">
          <UBadge label="Recomendação" class="bg-red-500 font-bold text-white" />
          <p class="rounded-full border border-red-500 bg-[rgba(227,24,55,0.15)] px-2 font-bold">
            Rocha: {{ data.rocha || '---' }}
          </p>
        </div>
        <div class="mt-2 text-slate-400">
          <p class="word-break">
            Mohs <span class="font-bold">{{ data.mohs }}</span> · Abrasividade <span class="font-bold">{{ data.abrasividade }}</span> · Formação <span class="font-bold">{{ data.formacao }}</span> · Granulometria <span class="font-bold">{{ data.granulometria }}</span> · Diâmetro <span class="font-bold">{{ data.diametro }}</span>
          </p>
        </div>
      </template>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="rounded-2xl border border-slate-800 bg-slate-950 p-3">
          <p class="font-bold">
            Explotools
          </p>
          <p>
            Série: <span class="font-bold">{{ data.serie || '---' }}</span>
          </p>
          <p>
            Matriz: <span class="font-bold">{{ data.matriz || '---' }}</span>
          </p>
        </div>
        <div class="rounded-2xl border border-slate-800 bg-slate-950 p-3">
          <p class="font-bold">
            Equivalentes
          </p>
          <p>
            Di-Corp: <span class="font-bold">{{ data.diCorpo || '---' }}</span>
          </p>
          <p>
            Fordia/Epiroc: <span class="font-bold">{{ data.fordiaEpiroc || '---' }}</span>
          </p>
          <p>
            Boart Longyear: <span class="font-bold">{{ data.boartLongyear || '---' }}</span>
          </p>
        </div>

        <div class="rounded-2xl border border-slate-800 bg-slate-950 p-3">
          <p class="text-slate-400">
            RPM sugerido
          </p>
          <p class="font-bold">
            {{ data.rpm || '---' }}
          </p>
        </div>
        <div class="rounded-2xl border border-slate-800 bg-slate-950 p-3">
          <p class="text-slate-400">
            WOB típico (kN)
          </p>
          <p class="font-bold">
            {{ data.wob || '---' }}
          </p>
        </div>
        <div class="rounded-2xl border border-slate-800 bg-slate-950 p-3">
          <p class="text-slate-400">
            Fluxo água (L/min)
          </p>
          <p class="font-bold">
            {{ data.fluxoAgua || '---' }}
          </p>
        </div>
        <div class="rounded-2xl border border-slate-800 bg-slate-950 p-3">
          <p class="text-slate-400">
            Canais de água
          </p>
          <p class="font-bold">
            {{ data.canal || '---' }}
          </p>
        </div>
      </div>

      <p class="pt-6 pb-3 font-bold">
        Diagnóstico & Solução
      </p>

      <UTable :data="data.diagnostico" class="flex-1" />

      <p class="pt-6 pb-3 font-bold">
        Parâmetros & Boas práticas
      </p>

      <UTable :data="data.boasPraticas" class="flex-1" />
    </UCard>

    <div v-else class="flex h-96 items-center justify-center">
      Nenhum dado encontrado.
    </div>
  </section>
</template>
