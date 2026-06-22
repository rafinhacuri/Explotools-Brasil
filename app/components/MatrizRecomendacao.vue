<script setup lang="ts">
defineProps<{ data: RecomendacaoMongo }>()

const marcas = (d: RecomendacaoMongo) => [
  { k: 'Boart Longyear', v: d.boartLongyear },
  { k: 'Fordia / Epiroc', v: d.fordiaEpiroc },
  { k: 'Di-Corp', v: d.diCorpo },
  { k: 'Dimatec', v: d.dimatec },
  { k: 'Hayden', v: d.hayden },
]
</script>

<template>
  <div class="et-rec p-5">
    <!-- Cabeçalho -->
    <div class="mb-3 flex flex-wrap items-center gap-2">
      <span class="et-badge">Recomendação</span>
      <span class="et-pill">Rocha: <b>{{ data.rocha || '---' }}</b></span>
    </div>
    <p class="et-sub mb-4 text-sm">
      Mohs <b class="text-(--et-ink)">{{ data.mohs }}</b> · Quartzo eq. <b class="text-(--et-ink)">~{{ data.eqc }}%</b> · CAI <b class="text-(--et-ink)">{{ data.cai }}</b> · Abrasividade <b class="text-(--et-ink)">{{ data.abrasividade }}</b> · Formação <b class="text-(--et-ink)">{{ data.formacao }}</b> · Granulometria <b class="text-(--et-ink)">{{ data.granulometria }}</b> · Diâmetro <b class="text-(--et-ink)">{{ data.diametro }}</b> · Objetivo <b class="text-(--et-ink)">{{ data.objetivo }}</b>
    </p>

    <!-- Perfil recomendado + Geometria da coroa -->
    <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div class="et-tile">
        <p class="mb-1 font-bold text-(--et-ink)">
          Perfil recomendado
        </p>
        <p>Dureza de matriz (1–9): <b>{{ data.matriz }}</b> <span class="et-sub">({{ data.matrizPalavra }})</span></p>
        <p>Variante ABR: <b>{{ data.abrVariante }}</b></p>
        <p>Série de referência: <b>{{ data.serie }}</b></p>
        <p v-if="data.serieAlt" class="et-sub text-sm">
          Alternativa: {{ data.serieAlt }}
        </p>
      </div>
      <div class="et-tile">
        <p class="mb-1 font-bold text-(--et-ink)">
          Geometria da coroa
        </p>
        <p>Área aberta: <b>{{ data.areaAberta }}</b></p>
        <p>Canal de água: <b>{{ data.canalCoroa }}</b></p>
        <p class="et-sub text-sm">
          {{ data.alturaCoroa }}
        </p>
      </div>
    </div>

    <!-- Principais marcas de coroa -->
    <h3 class="mt-5 mb-2 text-base font-bold text-(--et-ink)">
      Principais marcas de coroa
    </h3>
    <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
      <div v-for="m in marcas(data)" :key="m.k" class="et-brand-row">
        <span class="font-semibold text-(--et-ink)">{{ m.k }}</span>
        <span class="text-right font-semibold">{{ m.v || '---' }}</span>
      </div>
    </div>
    <p v-if="data.abrNota" class="et-sub mt-2 text-sm">
      {{ data.abrNota }}
    </p>
    <p class="et-note mt-2">
      Alinhado pela faixa de Mohs (eixo comum publicado pelos fabricantes). O grade de cada marca é o que cobre a mesma faixa de dureza — confirmar com o catálogo oficial.
    </p>

    <!-- KPIs operacionais -->
    <div class="mt-4 grid grid-cols-2 gap-2.5 md:grid-cols-4">
      <div class="et-box">
        <p class="et-sub text-xs">
          RPM sugerido
        </p>
        <p class="font-bold text-(--et-ink)">
          {{ data.rpm || '---' }}
        </p>
      </div>
      <div class="et-box">
        <p class="et-sub text-xs">
          WOB típico (kN)
        </p>
        <p class="font-bold text-(--et-ink)">
          {{ data.wob || '---' }}
        </p>
      </div>
      <div class="et-box">
        <p class="et-sub text-xs">
          Fluxo água (L/min)
        </p>
        <p class="font-bold text-(--et-ink)">
          {{ data.fluxoAgua || '---' }}
        </p>
      </div>
      <div class="et-box">
        <p class="et-sub text-xs">
          Canais de água
        </p>
        <p class="font-bold text-(--et-ink)">
          {{ data.canal || '---' }}
        </p>
      </div>
    </div>

    <!-- Diagnóstico & Solução -->
    <template v-if="data.diagnostico?.length">
      <h3 class="mt-5 mb-2 text-base font-bold text-(--et-ink)">
        Diagnóstico &amp; Solução
      </h3>
      <div class="overflow-x-auto">
        <table class="et-table">
          <thead>
            <tr>
              <th>Sintoma / Condição</th>
              <th>Causa provável</th>
              <th>Ação imediata</th>
              <th>Ajuste</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, i) in data.diagnostico" :key="i">
              <td class="font-semibold text-(--et-ink)">
                {{ r.sintoma }}
              </td>
              <td>{{ r.causa }}</td>
              <td>{{ r.acao }}</td>
              <td>{{ r.ajuste }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- Parâmetros & Boas práticas -->
    <template v-if="data.boasPraticas?.length">
      <h3 class="mt-5 mb-2 text-base font-bold text-(--et-ink)">
        Parâmetros &amp; Boas práticas
      </h3>
      <div class="overflow-x-auto">
        <table class="et-table">
          <thead>
            <tr>
              <th>Parâmetro</th>
              <th>Regra de bolso</th>
              <th>Como ajustar</th>
              <th>Observação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, i) in data.boasPraticas" :key="i">
              <td class="font-semibold text-(--et-ink)">
                {{ r.parametro }}
              </td>
              <td>{{ r.regra }}</td>
              <td>{{ r.ajuste }}</td>
              <td>{{ r.obs }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <slot name="actions" />
  </div>
</template>
