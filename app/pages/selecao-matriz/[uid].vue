<script setup lang="ts">
useHead({ title: 'Recomendação' })
definePageMeta({ layout: false, colorMode: 'dark' })
const { uid } = useRoute().params

const id = Array.isArray(uid) ? uid[0] : uid

const { data } = await useFetch('/api/fetch/recomendacao', { method: 'POST', body: { _id: id } })
</script>

<template>
  <UContainer class="my-6">
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

      <p class="mb-3 text-xl font-bold">
        Quadro de séries por fabricante
      </p>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="rounded-2xl border border-slate-800 bg-slate-950 p-3">
          <p class="font-bold">
            Explotools
          </p>
          <p>
            Série: <span class="font-bold">{{ data.serie || '---' }}</span>
          </p>
        </div>
        <div class="rounded-2xl border border-slate-800 bg-slate-950 p-3">
          <p class="font-bold">
            Di-Corp
          </p>
          <p>
            Série: <span class="font-bold">{{ data.diCorpo || '---' }}</span>
          </p>
        </div>
        <div class="rounded-2xl border border-slate-800 bg-slate-950 p-3">
          <p class="font-bold">
            Fordia/Epiroc
          </p>
          <p>
            Série: <span class="font-bold">{{ data.fordiaEpiroc || '---' }}</span>
          </p>
        </div>
        <div class="rounded-2xl border border-slate-800 bg-slate-950 p-3">
          <p class="font-bold">
            Boart Longyear
          </p>
          <p>
            Série: <span class="font-bold">{{ data.boartLongyear || '---' }}</span>
          </p>
        </div>

        <p class="col-span-2 mt-3 text-xl font-bold">
          Especificações padrão de operação
        </p>
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
    </UCard>

    <div v-else class="flex h-96 items-center justify-center">
      Nenhum dado encontrado.
    </div>
  </UContainer>
</template>
