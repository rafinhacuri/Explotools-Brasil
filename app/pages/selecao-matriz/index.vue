<script setup lang="ts">
definePageMeta({
  layout: false,
  colorMode: 'dark',
})

const { start, finish, isLoading } = useLoadingIndicator()
const toast = useToast()

const { loggedIn, user, fetch, clear } = useUserSession()

const naoLogado = computed(() => !loggedIn.value)

const isMobile = useMediaQuery('(max-width: 768px)')

const abrasividadeOptions = ['Baixa', 'Média', 'Alta']
const granulometriaOptions = ['Fino', 'Médio', 'Grosso']
const diametroOptions = ['BQ', 'NQ', 'NQ2', 'HQ', 'PQ']
const estadoOptions = ['Fracturada', 'Moderada', 'Sólida']

const gerarRecomendacao = ref(false)
const state = ref<RecomendacaoForm>({ email: '', rocha: '', mohs: 6.5, abrasividade: 'Média', formacao: 'Moderada', granulometria: 'Médio', diametro: 'NQ' })

const blockMohs = ref(false)

watch(() => state.value.rocha, nv => {
  const rocha = rochas.find(r => r.startsWith(nv ?? ''))
  if(!rocha) return
  // eslint-disable-next-line security/detect-unsafe-regex
  const mohsMatch = rocha.match(/Mohs (\d+(?:\.\d+)?)/)
  if(mohsMatch && mohsMatch[1]){
    state.value.mohs = Number.parseFloat(mohsMatch[1])
  }

  if(nv) blockMohs.value = true
  else blockMohs.value = false
})

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

const recomendacao = ref<RecomendacaoMongo>({ uid: '', rocha: '', serie: '', matriz: '', diCorpo: '', fordiaEpiroc: '', boartLongyear: '', rpm: '', wob: '', fluxoAgua: '', canal: '', diagnostico: [], boasPraticas: [], abrasividade: '', granulometria: '', diametro: '', formacao: '', mohs: 0, email: '' })

const emailPreenchido = ref(false)

async function getRecomendacao(){
  start()

  state.value.email = user.value?.email || ''

  const body = RecomendacaoSchema.safeParse(state.value)
  if(!body.success){
    toast.add({ title: body.error.issues[0]?.message || '', icon: 'i-heroicons-exclamation-triangle', color: 'error' })
    return finish({ error: true })
  }

  const res = await $fetch('/api/insert/recomendacao', { method: 'POST', body: body.data })
    .catch(error => { toast.add({ title: error.data.message, icon: 'i-heroicons-exclamation-triangle', color: 'error' }) })

  if(!res) return finish({ error: true })

  recomendacao.value = res
  if(body.data.email) emailPreenchido.value = true
  gerarRecomendacao.value = true
  finish()
}

const { SITE_URL } = useRuntimeConfig().public

const source = computed(() => `${SITE_URL}/selecao-matriz/${recomendacao.value.uid}`)

const { copy, copied } = useClipboard({ source })

const stateLogin = ref<UserRec>({ email: '' })

async function login(){
  start()

  const body = UserRecSchema.safeParse(stateLogin.value)
  if(!body.success){
    toast.add({ title: body.error.issues[0]?.message || '', icon: 'i-heroicons-exclamation-triangle', color: 'error' })
    return finish({ error: true })
  }

  const res = await $fetch('/auth-recomendacao', { method: 'POST', body: body.data })
    .catch(error => { toast.add({ title: error.data.message, icon: 'i-heroicons-exclamation-triangle', color: 'error' }) })

  if(!res) return finish({ error: true })

  await fetch()
  finish()
}

async function sair(){
  await clear()
  await navigateTo('/')
  toast.add({ title: 'Deslogado com sucesso', icon: 'i-heroicons-check-badge', color: 'success' })
}
</script>

<template>
  <section>
    <UHeader>
      <template #left>
        <NuxtLink to="/">
          <NuxtImg src="/explotools.png" alt="Logo" class="h-16" />
        </NuxtLink>
      </template>
      <template #right>
        <NuxtLink to="https://wa.link/c1di0k" external target="_blank">
          <UIcon name="ic-baseline-whatsapp" class="mt-2 size-8 rounded-2xl hover:bg-slate-400" color="white" />
        </NuxtLink>
        <UButton icon="i-heroicons-arrow-left-on-rectangle" variant="ghost" class="p-1 text-white" size="xl" @click="sair" />
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
            <UInputMenu id="buscar" v-model="state.rocha" placeholder="Digite o nome da rocha" color="error" class="w-full" :items="rochas" />
          </div>

          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label for="dureza" class="font-bold">
                Dureza (Mohs)  <span class="text-slate-400">{{ state.mohs }}</span>
              </label>
              <USlider id="dureza" v-model="state.mohs" :disabled="blockMohs" tooltip color="error" class="mt-5" :min="1" :max="10" :step="0.1" />
            </div>
            <div class="mb-4">
              <label for="abrasividade" class="font-bold">
                Abrasividade
              </label>
              <URadioGroup id="abrasividade" v-model="state.abrasividade" orientation="horizontal" color="error" :variant="isMobile ? 'list' : 'card'" :items="abrasividadeOptions" />
            </div>
          </div>
          <div class="mb-4">
            <label for="diametro" class="font-bold">
              Diâmetro da coroa
            </label>
            <URadioGroup id="diametro" v-model="state.diametro" orientation="horizontal" color="error" :variant="isMobile ? 'list' : 'card'" :items="diametroOptions" />
          </div>
          <div class="mb-4">
            <label for="granulometria" class="font-bold">
              Granulometria
            </label>
            <URadioGroup id="granulometria" v-model="state.granulometria" orientation="horizontal" color="error" :variant="isMobile ? 'list' : 'card'" :items="granulometriaOptions" />
          </div>
        </div>

        <div class="col-span-2 mx-auto w-full rounded-xl bg-slate-900 p-6 shadow-lg md:col-span-1">
          <h2 class="text-lg font-bold">
            2) Característica da formação
          </h2>
          <p class="mb-5 text-slate-400">
            Defina o estado estrutural do maciço rochoso.
          </p>

          <div class="my-5">
            <URadioGroup id="estado" v-model="state.formacao" orientation="horizontal" color="error" :variant="isMobile ? 'list' : 'card'" :items="estadoOptions" />
          </div>

          <UButton label="Obter recomendação" class="flex w-full justify-center bg-red-500 p-2 font-bold text-white" color="error" :loading="isLoading" @click="getRecomendacao" />

          <UCard v-if="gerarRecomendacao" class="mt-5">
            <template #header>
              <div class="flex items-center space-x-2">
                <UBadge label="Recomendação" class="bg-red-500 font-bold text-white" />
                <p class="rounded-full border border-red-500 bg-[rgba(227,24,55,0.15)] px-2 font-bold">
                  Rocha: {{ recomendacao.rocha || '---' }}
                </p>
              </div>
              <div class="mt-2 text-slate-400">
                <p class="word-break">
                  Mohs <span class="font-bold">{{ recomendacao.mohs }}</span> · Abrasividade <span class="font-bold">{{ recomendacao.abrasividade }}</span> · Formação <span class="font-bold">{{ recomendacao.formacao }}</span> · Granulometria <span class="font-bold">{{ recomendacao.granulometria }}</span> · Diâmetro <span class="font-bold">{{ recomendacao.diametro }}</span>
                </p>
              </div>
            </template>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div class="rounded-2xl border border-slate-800 bg-slate-950 p-3">
                <p class="font-bold">
                  Explotools
                </p>
                <p>
                  Série: <span class="font-bold">{{ recomendacao.serie || '---' }}</span>
                </p>
                <p>
                  Matriz: <span class="font-bold">{{ recomendacao.matriz || '---' }}</span>
                </p>
              </div>
              <div class="rounded-2xl border border-slate-800 bg-slate-950 p-3">
                <p class="font-bold">
                  Equivalentes
                </p>
                <p>
                  Di-Corp: <span class="font-bold">{{ recomendacao.diCorpo || '---' }}</span>
                </p>
                <p>
                  Fordia/Epiroc: <span class="font-bold">{{ recomendacao.fordiaEpiroc || '---' }}</span>
                </p>
                <p>
                  Boart Longyear: <span class="font-bold">{{ recomendacao.boartLongyear || '---' }}</span>
                </p>
              </div>

              <div class="rounded-2xl border border-slate-800 bg-slate-950 p-3">
                <p class="text-slate-400">
                  RPM sugerido
                </p>
                <p class="font-bold">
                  {{ recomendacao.rpm || '---' }}
                </p>
              </div>
              <div class="rounded-2xl border border-slate-800 bg-slate-950 p-3">
                <p class="text-slate-400">
                  WOB típico (kN)
                </p>
                <p class="font-bold">
                  {{ recomendacao.wob || '---' }}
                </p>
              </div>
              <div class="rounded-2xl border border-slate-800 bg-slate-950 p-3">
                <p class="text-slate-400">
                  Fluxo água (L/min)
                </p>
                <p class="font-bold">
                  {{ recomendacao.fluxoAgua || '---' }}
                </p>
              </div>
              <div class="rounded-2xl border border-slate-800 bg-slate-950 p-3">
                <p class="text-slate-400">
                  Canais de água
                </p>
                <p class="font-bold">
                  {{ recomendacao.canal || '---' }}
                </p>
              </div>
            </div>

            <p class="pt-6 pb-3 font-bold">
              Diagnóstico & Solução
            </p>

            <UTable :data="recomendacao.diagnostico" class="flex-1" />

            <p class="pt-6 pb-3 font-bold">
              Parâmetros & Boas práticas
            </p>

            <UTable :data="recomendacao.boasPraticas" class="flex-1" />

            <UButton label="Copiar link" :icon="copied ? 'i-heroicons-check-circle' : 'i-heroicons-link'" class=" mt-4 bg-red-500 font-bold text-white" color="error" :loading="isLoading" @click="copy(source)" />
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

    <UModal v-model:open="naoLogado" :dismissible="false" title="Email" description="Por favor, insira seu email para continuar." :ui="{ footer: 'justify-end' }" :close="false">
      <template #body>
        <div class="flex flex-col">
          <label for="email">Digite o email que você usou para se cadastrar</label>
          <UInput id="email" v-model="stateLogin.email" color="error" />
        </div>

        <UButton label="Cadastrar-se..." class="mt-5" variant="ghost" color="error" :loading="isLoading" to="/lead" />
      </template>

      <template #footer>
        <UButton label="Confirmar" color="error" :loading="isLoading" @click="login" />
      </template>
    </UModal>
  </section>
</template>
