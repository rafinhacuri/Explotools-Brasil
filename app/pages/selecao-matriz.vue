<script setup lang="ts">
definePageMeta({
  layout: false,
  colorMode: 'dark',
})

const isMobile = useMediaQuery('(max-width: 768px)')

const rochas = [
  'Calcário - Mohs 3',
  'Calcário dolomítico - Mohs 3.8',
  'Marga - Mohs 3',
  'Gesso - Mohs 2',
  'Halita (sal-gema) - Mohs 2.5',
  'Arenito - Mohs 6.5',
  'Arenito ferruginoso - Mohs 6.8',
  'Siltito - Mohs 3.5',
  'Folhelho - Mohs 3',
  'Conglomerado - Mohs 6.5',
  'Laterita - Mohs 5.5',
  'Basalto - Mohs 6',
]

const selectedRocha = ref()
const dureza = ref(6.5)

const abrasividadeOptions = ['Baixa', 'Média', 'Alta']
const selectedAbrasividade = ref('Média')

const granulometriaOptions = ['Fino', 'Médio', 'Grosso']
const selectedGranulometria = ref('Médio')

const diametroOptions = ['BQ', 'NQ', 'NQ2', 'HQ', 'PQ']
const selectedDiametro = ref('NQ')

const estadoOptions = ['Fracturada', 'Moderada', 'Sólida']
const selectedEstado = ref('Moderada')

const gerarRecomendacao = ref(false)
const rochaRecomendada = ref('sdsdfsdf')

const perguntas = ref([
  {
    label: 'O que é série e o que é matriz?',
    content: 'Série (ex.: 2-4, 4-6, 6-9, 9-11, 12-14) é a família operacional do produto. Matriz (1–9) é a dureza da liga metálica que libera os diamantes: números menores são mais duros; números maiores são mais macios.',
  },
  {
    label: 'O que é ABR?',
    content: 'ABR identifica variantes para terrenos abrasivos. Em rochas com muito quartzo/hematita, considere 7 ABR ou 9 ABR.',
  },
])

// ===== LITOTOGIAS (BR) COM MOHS/ABRASIVIDADE SUGERIDAS =====
const ROCKS = [
  { n: 'Calcário', mohs: 3, abra: 'low' },
  { n: 'Calcário dolomítico', mohs: 3.8, abra: 'low' },
  { n: 'Marga', mohs: 3, abra: 'low' },
  { n: 'Gesso', mohs: 2, abra: 'low' },
  { n: 'Halita (sal-gema)', mohs: 2.5, abra: 'low' },
  { n: 'Arenito', mohs: 6.5, abra: 'medium' },
  { n: 'Arenito ferruginoso', mohs: 6.8, abra: 'high' },
  { n: 'Siltito', mohs: 3.5, abra: 'low' },
  { n: 'Folhelho', mohs: 3, abra: 'low' },
  { n: 'Conglomerado', mohs: 6.5, abra: 'high' },
  { n: 'Laterita', mohs: 5.5, abra: 'high' },
  { n: 'Basalto', mohs: 6, abra: 'medium' },
  { n: 'Diabásio', mohs: 6.5, abra: 'medium' },
  { n: 'Andesito', mohs: 6.5, abra: 'medium' },
  { n: 'Riolito', mohs: 6.5, abra: 'medium' },
  { n: 'Dacito', mohs: 6.5, abra: 'medium' },
  { n: 'Tonalito', mohs: 6.5, abra: 'medium' },
  { n: 'Granito', mohs: 6.5, abra: 'medium' },
  { n: 'Granodiorito', mohs: 6.5, abra: 'medium' },
  { n: 'Monzogranito', mohs: 6.5, abra: 'medium' },
  { n: 'Sienito', mohs: 5.8, abra: 'medium' },
  { n: 'Gabro', mohs: 6.5, abra: 'medium' },
  { n: 'Peridotito/Dunito', mohs: 6.5, abra: 'medium' },
  { n: 'Kimberlito', mohs: 6, abra: 'high' },
  { n: 'Anortosito', mohs: 6, abra: 'medium' },
  { n: 'Gnaisse', mohs: 6.5, abra: 'high' },
  { n: 'Migmatito', mohs: 6.5, abra: 'medium' },
  { n: 'Quartzito', mohs: 7, abra: 'high' },
  { n: 'Quartzito (Espinhaço)', mohs: 7, abra: 'high' },
  { n: 'Xisto', mohs: 4.5, abra: 'medium' },
  { n: 'Filito', mohs: 3.5, abra: 'low' },
  { n: 'Ardósia', mohs: 4, abra: 'low' },
  { n: 'Mármore', mohs: 3.5, abra: 'low' },
  { n: 'Serpentinitos', mohs: 3.5, abra: 'low' },
  { n: 'Itabirito/Taconita', mohs: 6.8, abra: 'high' },
  { n: 'BIF (Formação Ferrífera Bandada)', mohs: 6.8, abra: 'high' },
  { n: 'Sílex', mohs: 7, abra: 'high' },
  { n: 'Chert', mohs: 7, abra: 'high' },
  { n: 'Jaspe/Jasperito', mohs: 6.8, abra: 'high' },
  { n: 'Cuarcita', mohs: 7, abra: 'high' },
  { n: 'Quartzo maciço', mohs: 7, abra: 'high' },
  { n: 'Norito', mohs: 6.5, abra: 'medium' },
  { n: 'Quartzodiorito', mohs: 6.5, abra: 'medium' },
  { n: 'Sienogranito', mohs: 6.5, abra: 'medium' },
  { n: 'Pegmatita', mohs: 6.5, abra: 'medium' },
  { n: 'Dolomita', mohs: 3.5, abra: 'low' },
  { n: 'Safira (coríndon)', mohs: 9, abra: 'high' },
]

const DIAMETERS = {
  BQ: { rpm: [650, 1600], wob: [13, 24], flow: [8, 21], waterway: 'Standard/Hydra' },
  NQ: { rpm: [500, 1250], wob: [20, 38], flow: [13, 34], waterway: 'Standard/Hydra' },
  NQ2: { rpm: [500, 1250], wob: [20, 38], flow: [13, 34], waterway: 'Standard/Hydra' },
  HQ: { rpm: [400, 1000], wob: [29, 58], flow: [19, 53], waterway: 'Hydra/Face Discharge' },
  PQ: { rpm: [300, 800], wob: [44, 84], flow: [28, 76], waterway: 'Face Discharge/Wide' },
}

const abraKey = computed(() => ({ Baixa: 'low', Média: 'medium', Alta: 'high' }[selectedAbrasividade.value] || 'medium'))
const grainKey = computed(() => ({ Fino: 'fino', Médio: 'médio', Grosso: 'grosso' }[selectedGranulometria.value] || 'médio'))
const formKey = computed(() => ({ Fracturada: 'fracturada', Moderada: 'moderada', Sólida: 'compacta', Compacta: 'compacta' }[selectedEstado.value] || 'moderada'))

function approxMatrix(mohs: number, abra: 'high' | 'low' | 'medium', form: 'compacta' | 'fracturada' | 'moderada'){
  let m = mohs < 3.5 ? 2 : mohs < 5 ? 4 : mohs < 6.5 ? 6 : mohs < 7.5 ? 7 : 8
  if(abra === 'high') m -= 1
  if(form === 'fracturada') m -= 1
  if(form === 'compacta') m += 1
  if(m < 1) m = 1
  if(m > 9) m = 9
  return m
}
function decideSeries(mohs: number, abra: 'high' | 'low' | 'medium', form: 'compacta' | 'fracturada' | 'moderada'){
  let serie = ''
  let alt = ''
  if(mohs < 4){
    serie = form === 'fracturada' ? '2-4' : '4-6'
    if(abra === 'high') alt = '7 ABR'
  }
  else if(mohs < 5.5){
    if(form === 'fracturada') serie = '4-6'
    else if(form === 'moderada') serie = abra === 'high' ? '7 ABR' : '4-6'
    else serie = abra === 'high' ? '7 ABR' : '6-9'
  }
  else if(mohs <= 7){
    serie = form === 'compacta' ? '6-9' : '4-6'
    if(abra === 'high') alt = '9 ABR'
  }
  else {
    serie = form === 'compacta' ? (mohs > 7.5 ? '12-14' : '9-11') : '6-9'
    if(abra === 'high' && form !== 'fracturada') alt = '11-14 (ABR)'
  }
  return { serie, alt }
}
function equivalents(serie: string, abra: 'high' | 'low' | 'medium'){
  let dicorp = '—'
  let fordia = '—'
  let boart = '—'
  if(serie === '2-4'){
    dicorp = '2A/5'
    fordia = 'HERO 3-5 · T-Xtreme 4-6'
    boart = 'UMX 5'
  }
  else if(serie === '4-6'){
    dicorp = '6/7'
    fordia = 'HERO 5-7'
    boart = 'UMX 7'
  }
  else if(serie === '7 ABR'){
    dicorp = '7 (Abrasive)'
    fordia = 'HERO Abrasive 7'
    boart = 'UMX 7 Abrasive'
  }
  else if(serie === '6-9'){
    dicorp = '7E/8/9'
    fordia = 'HERO 8-9 · T‑Xtreme 6‑9'
    boart = 'UMX 9'
  }
  else if(serie === '9 ABR'){
    dicorp = '9 (Abrasive)'
    fordia = 'HERO Abrasive 9'
    boart = 'UMX 9 Abrasive'
  }
  else if(serie === '9-11'){
    dicorp = '10/11'
    fordia = 'HERO 11 · T‑Xtreme 9‑11'
    boart = 'UMX 10'
  }
  else if(serie === '12-14' || serie.includes('11-14')){
    dicorp = '12/13'
    fordia = 'HERO 13 · T‑Xtreme 11‑14'
    boart = 'UMX 12'
  }
  if(abra === 'high' && !serie.includes('ABR')) fordia += ' · (HERO Abrasive)'
  return { dicorp, fordia, boart }
}
function opNumbers(size: string, mohs: number, abra: 'high' | 'low' | 'medium', grain: 'fino' | 'grosso' | 'médio', form: 'compacta' | 'fracturada' | 'moderada'){
  // eslint-disable-next-line typescript/no-explicit-any
  const p = (DIAMETERS as any)[size] || DIAMETERS.NQ
  const rpm = [...p.rpm]
  const wob = [...p.wob]
  const flow = [...p.flow]
  const water = p.waterway
  if(abra === 'high'){
    rpm[1] -= 100
    flow[0] += 2
  }
  if(form === 'fracturada'){
    rpm[0] -= 100
    rpm[1] -= 100
    wob[0] -= 2
    flow[0] -= 2
  }
  if(grain === 'grosso'){
    flow[0] += 5
    flow[1] += 5
  }
  if(rpm[0] < 0) rpm[0] = 0
  if(rpm[1] < rpm[0]) rpm[1] = rpm[0] + 100
  return { rpmRange: [Math.round(rpm[0]), Math.round(rpm[1])], wobRange: [Math.round(wob[0]), Math.round(wob[1])], flowRange: [Math.round(flow[0]), Math.round(flow[1])], waterway: water }
}

const rochaNome = computed(() => selectedRocha.value || '—')
// eslint-disable-next-line typescript/no-explicit-any
const matriz = computed(() => approxMatrix(Number(dureza.value || 0), abraKey.value as any, formKey.value as any))
// eslint-disable-next-line typescript/no-explicit-any
const serieData = computed(() => decideSeries(Number(dureza.value || 0), abraKey.value as any, formKey.value as any))
// eslint-disable-next-line typescript/no-explicit-any
const eqv = computed(() => equivalents(serieData.value.serie, abraKey.value as any))
// eslint-disable-next-line typescript/no-explicit-any
const ops = computed(() => opNumbers(selectedDiametro.value, Number(dureza.value || 0), abraKey.value as any, grainKey.value as any, formKey.value as any))

watch(selectedRocha, nv => {
  if(!nv) return
  const nvStr = String(nv ?? '').toLowerCase().trim()
  const idx = nvStr.indexOf(' - mohs')
  const nvName = (idx !== -1 ? nvStr.slice(0, idx) : nvStr).trim()
  const rock = ROCKS.find(r => nvName.startsWith(r.n.toLowerCase()) || r.n.toLowerCase().startsWith(nvName))
  if(rock){
    dureza.value = rock.mohs
    selectedAbrasividade.value = rock.abra === 'low' ? 'Baixa' : rock.abra === 'high' ? 'Alta' : 'Média'
  }
  rochaRecomendada.value = String(nv)
})
</script>

<template>
  <section>
    <UHeader>
      <template #left>
        <NuxtLink to="/">
          <img src="/explotools.png" alt="Logo" class="h-16">
        </NuxtLink>
      </template>
      <template #right>
        <NuxtLink to="'https://wa.link/c1di0k'" external target="_blank">
          <UIcon name="ic-baseline-whatsapp" class="size-9 rounded-2xl hover:bg-slate-400" color="white" />
        </NuxtLink>
      </template>
    </UHeader>
    <div class="min-h-screen  bg-slate-950 p-4 text-white">
      <div class=" mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 md:grid-cols-2">
        <div class="col-span-2 mx-auto w-full rounded-xl bg-slate-900 p-6 shadow-lg md:col-span-1">
          <h2 class="text-lg font-bold">
            1) Identifique a rocha
          </h2>
          <p class="mb-5 text-slate-400">
            Pesquise a litologia. Dureza (Mohs) e abrasividade são sugeridas automaticamente.
          </p>

          <div class="mb-5">
            <label for="buscar" class="font-bold">
              Buscar rocha
            </label>
            <UInputMenu id="buscar" v-model="selectedRocha" placeholder="Digite o nome da rocha" color="error" class="w-full" :items="rochas" />
          </div>

          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label for="dureza" class="font-bold">
                Dureza (Mohs)  <span class="text-slate-400">{{ dureza }}</span>
              </label>
              <USlider id="dureza" v-model="dureza" tooltip color="info" class="mt-5" :min="1" :max="10" :step="0.1" />
            </div>
            <div class="mb-4">
              <label for="abrasividade" class="font-bold">
                Abrasividade
              </label>
              <URadioGroup id="abrasividade" v-model="selectedAbrasividade" orientation="horizontal" color="error" :variant="isMobile ? 'list' : 'card'" :items="abrasividadeOptions" />
            </div>
          </div>
          <div class="mb-4">
            <label for="diametro" class="font-bold">
              Diâmetro da coroa
            </label>
            <URadioGroup id="diametro" v-model="selectedDiametro" orientation="horizontal" color="error" :variant="isMobile ? 'list' : 'card'" :items="diametroOptions" />
          </div>
          <div class="mb-4">
            <label for="granulometria" class="font-bold">
              Granulometria
            </label>
            <URadioGroup id="granulometria" v-model="selectedGranulometria" orientation="horizontal" color="info" :variant="isMobile ? 'list' : 'card'" :items="granulometriaOptions" />
          </div>
        </div>

        <div class="col-span-2 mx-auto w-full rounded-xl bg-slate-900 p-6 shadow-lg md:col-span-1">
          <h2 class="text-lg font-bold">
            2) Característica da formação
          </h2>
          <p class="mb-5 text-slate-400">
            Defina o estado estrutural do maciço rochoso.
          </p>

          <div class="mb-5">
            <URadioGroup id="estado" v-model="selectedEstado" orientation="horizontal" color="error" :variant="isMobile ? 'list' : 'card'" :items="estadoOptions" />
          </div>

          <UButton label="Obter recomendação" class="flex w-full justify-center bg-red-500 p-2 font-bold text-white" color="error" @click="gerarRecomendacao = true" />

          <UCard v-if="gerarRecomendacao" class="mt-5">
            <template #header>
              <div class="flex items-center space-x-2">
                <UBadge label="Recomendação" class="bg-red-500 font-bold text-white" />
                <p class="rounded-full border border-red-500 bg-[rgba(227,24,55,0.15)] px-2 font-bold">
                  Rocha: {{ rochaNome }}
                </p>
              </div>
              <div class="mt-2 text-slate-400">
                <p class="word-break">
                  Mohs <span class="font-bold">{{ dureza }}</span> · Abrasividade <span class="font-bold">{{ selectedAbrasividade }}</span> · Formação <span class="font-bold">{{ selectedEstado }}</span> · Granulometria <span class="font-bold">{{ selectedGranulometria }}</span> · Diâmetro <span class="font-bold">{{ selectedDiametro }}</span>
                </p>
              </div>
            </template>

            <div class="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <p class="font-bold">
                Explotools
              </p>
              <p>
                Série: <span class="font-bold">{{ serieData.serie }}</span>
              </p>
              <p>
                Matriz: <span class="font-bold">{{ matriz }}</span>
              </p>
            </div>

            <div class="mt-3 rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <p class="font-bold">
                Equivalentes
              </p>
              <p>
                Di-Corp: <span class="font-bold">{{ eqv.dicorp }}</span>
              </p>
              <p>
                Fordia/Epiroc: <span class="font-bold">{{ eqv.fordia }}</span>
              </p>
              <p>
                Boart Longyear: <span class="font-bold">{{ eqv.boart }}</span>
              </p>
            </div>
            <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div class="mt-3 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p class="text-slate-400">
                  RPM sugerido
                </p>
                <p class="font-bold">
                  {{ ops.rpmRange[0] }}-{{ ops.rpmRange[1] }}
                </p>
              </div>
              <div class="mt-3 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p class="text-slate-400">
                  WOB típico (kN)
                </p>
                <p class="font-bold">
                  {{ ops.wobRange[0] }}-{{ ops.wobRange[1] }}
                </p>
              </div>
            </div>
            <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div class="mt-3 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p class="text-slate-400">
                  Fluxo água (L/min)
                </p>
                <p class="font-bold">
                  {{ ops.flowRange[0] }}-{{ ops.flowRange[1] }}
                </p>
              </div>
              <div class="mt-3 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p class="text-slate-400">
                  Canais de água
                </p>
                <p class="font-bold">
                  {{ ops.waterway }}
                </p>
              </div>
            </div>
          </UCard>
        </div>

        <div class="mx col-span-2 rounded-xl bg-slate-900 p-6 shadow-lg">
          <h2 class="text-lg font-bold">
            Dicas operacionais
          </h2>
          <ol class="list-inside list-disc space-y-2 p-4 text-slate-400">
            <li>RPM alta para matrizes maiores (mais macias); RPM moderada para matrizes menores (mais duras).</li>
            <li>WOB: use o mínimo que mantenha avanço; excesso pode danificar a coroa.</li>
            <li>Aumente o fluxo de água com maior taxa de penetração; evite fluido muito viscoso.</li>
            <li>Em alta abrasividade, prefira canais Hydra/Face Discharge e considere séries ABR.</li>
          </ol>
        </div>

        <div class="mx col-span-2 rounded-xl bg-slate-900 p-6 shadow-lg">
          <h2 class="text-lg font-bold">
            Perguntas frequentes
          </h2>
          <UAccordion :items="perguntas" />
        </div>
      </div>
    </div>
  </section>
</template>
