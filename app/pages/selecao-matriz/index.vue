<script setup lang="ts">
import { vMaska } from 'maska/vue'

definePageMeta({
  layout: false,
  colorMode: 'light',
})

useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Saira:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap' },
  ],
})

const { start, finish, isLoading } = useLoadingIndicator()
const toast = useToast()

const { loggedIn, user, fetch, clear } = useUserSession()

const naoLogado = computed(() => !loggedIn.value)

const isMobile = useMediaQuery('(max-width: 768px)')

const { data, refresh } = await useFetch('/api/fetch/user-recomendacao', { method: 'POST', body: { _id: user.value?.email } })

const abrasividadeOptions = ['Baixa', 'Média', 'Alta']
const granulometriaOptions = ['Fino', 'Médio', 'Grosso']
const diametroOptions = ['BQ', 'NQ', 'NQ2', 'HQ', 'PQ']
const estadoOptions = ['Friável / Fraturada', 'Moderada', 'Compacta']
const objetivoOptions = ['Penetração', 'Equilíbrio', 'Vida útil']

const gerarRecomendacao = ref(false)
const state = ref<RecomendacaoForm>({ email: '', rocha: '', mohs: 6.5, abrasividade: 'Média', formacao: 'Moderada', granulometria: 'Médio', diametro: 'NQ', objetivo: 'Equilíbrio' })

const blockMohs = ref(false)
const modoAvancado = ref(false)

const selectedRock = computed(() => findRock(state.value.rocha))

function abraLabel(abra: 'low' | 'medium' | 'high'){
  return abra === 'low' ? 'Baixa' : abra === 'high' ? 'Alta' : 'Média'
}

// Abrasividade e dureza são pré-preenchidas pelo nome da rocha (ajustáveis no campo).
watch(() => state.value.rocha, nv => {
  const rock = findRock(nv)
  if(!rock){ blockMohs.value = false; modoAvancado.value = false; return }
  state.value.mohs = rock.mohs
  state.value.abrasividade = abraLabel(rock.abra)
  blockMohs.value = true
  modoAvancado.value = false
})

function toggleAvancado(){
  modoAvancado.value = !modoAvancado.value
  if(!modoAvancado.value){
    const rock = findRock(state.value.rocha)
    if(rock) state.value.mohs = rock.mohs
  }
}

const perguntas = ref([
  {
    label: 'O que é série e o que é matriz?',
    content: 'Série (ex.: 2-4, 4-6, 6-9, 9-11, 12-14) é a família operacional do produto. Matriz (1–9) é a dureza da liga metálica que libera os diamantes: números menores são mais duros; números maiores são mais macios.',
  },
  {
    label: 'Por que rocha dura pede matriz mais MACIA?',
    content: 'Princípio do autoafiamento: a matriz precisa desgastar na mesma taxa em que a rocha gasta os diamantes, para expor sempre pedras novas. Rocha dura e não-abrasiva não desgasta a liga sozinha — então usa-se matriz macia (que se "abre"). Rocha mole e abrasiva desgasta a liga rápido demais — então usa-se matriz dura, para o bit durar.',
  },
  {
    label: 'De onde vem a abrasividade se eu só informo o nome?',
    content: 'Cada litologia tem um teor de quartzo equivalente (EQC) e uma classe de abrasividade Cerchar (CAI) característicos da sua mineralogia. A ferramenta estima isso pelo nome da rocha — você pode ajustar no campo Abrasividade se o terreno local for atípico.',
  },
  {
    label: 'O que é ABR?',
    content: 'ABR identifica variantes para terrenos abrasivos. Em rochas com muito quartzo/hematita (granito, gnaisse, arenito quartzoso, itabirito), considere 7 ABR ou 9 ABR.',
  },
  {
    label: 'Como são definidas as principais marcas de coroa?',
    content: 'Não existe tabela pública que diga "grade X de uma marca = grade Y de outra". O único eixo que todos os fabricantes publicam é a escala Mohs. Por isso alinhamos os grades pela faixa de Mohs que cada um cobre, usando dados oficiais das marcas internacionais: Boart Longyear (cartela de cores Longyear + linha UMX), Fordia/Epiroc (linha HERO), Di-Corp (CoreMatrix; sufixos A=abrasivo, E=vida, F=penetração), Dimatec (séries S e XT) e Hayden (escala 1–16). É uma correspondência por faixa de dureza — sempre confirme com o catálogo oficial do fabricante.',
  },
  {
    label: 'Os números são exatos?',
    content: 'Não. São um ponto de partida baseado em referências técnicas e de fabricantes. Ajuste sempre pela resposta do furo (taxa de penetração, vibração, polimento da face). Os valores reais de cada maciço dependem de ensaio.',
  },
])

const recomendacao = ref<RecomendacaoMongo | null>(null)

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
  await refresh()
  finish()
}

const { SITE_URL } = useRuntimeConfig().public

const source = computed(() => `${SITE_URL}/selecao-matriz/${recomendacao.value?.uid ?? ''}`)

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
  await refresh()
  finish()
}

async function sair(){
  await clear()
  await navigateTo('/')
  toast.add({ title: 'Deslogado com sucesso', icon: 'i-heroicons-check-badge', color: 'success' })
}

const modalCadastro = ref(false)
const wireline = ref('')
const newLead = ref<Lead>({ nome: '', email: '', telefone: '', empresa: '', cargo: '', wireline: false })

async function salvarLead(){
  start()

  if(wireline.value === 'Sim') newLead.value.wireline = true

  const body = LeadSchema.safeParse(newLead.value)

  if(!body.success){
    toast.add({ title: body.error.issues[0]?.message || '', icon: 'i-heroicons-exclamation-triangle', color: 'error' })
    return finish({ error: true })
  }

  const res = await $fetch('/api/insert/lead', { method: 'POST', body: body.data })
    .catch(error => { toast.add({ title: error.data.message, icon: 'i-heroicons-exclamation-triangle', color: 'error' }) })

  if(!res) return finish({ error: true })

  finish()
  toast.add({ title: res, icon: 'i-heroicons-check-circle', color: 'success' })
  modalCadastro.value = false
  stateLogin.value.email = newLead.value.email
  login()
}
</script>

<template>
  <section>
    <UHeader>
      <template #left>
        <div class="flex items-center gap-3">
          <NuxtLink to="/">
            <NuxtImg src="/explotools.png" alt="Logo" class="h-16" />
          </NuxtLink>
          <span class="border-l border-[#E2E7EE] pl-3 font-[Saira] font-semibold tracking-wide text-[#5B6573]">Seleção de Matriz</span>
        </div>
      </template>
      <template #right>
        <UPopover>
          <UButton icon="i-heroicons-clipboard-document-list" variant="ghost" class="p-1" size="xl" />

          <template #content>
            <div class="p-4">
              <p class="mb-2 font-bold">
                Recomendações recentes
              </p>
              <div class="flex flex-col space-y-2">
                <NuxtLink v-for="({link, label}, index) in data" :key="link" :to="link" target="_blank" class="rounded-lg bg-[#F7F9FB] p-2 hover:bg-[#EEF1F5]">
                  <NuxtTime v-if="label" :datetime="label" locale="pt-BR" day="2-digit" month="2-digit" year="numeric" hour="2-digit" minute="2-digit" />
                  <span v-else>Recomendação {{ index + 1 }}</span>
                </NuxtLink>
                <p v-if="!data || data.length === 0" class="text-[#5B6573]">
                  Nenhuma recomendação encontrada.
                </p>
              </div>
            </div>
          </template>
        </UPopover>
        <UButton icon="i-heroicons-arrow-left-on-rectangle" variant="ghost" class="ml-3 p-1" size="xl" @click="sair" />
      </template>
    </UHeader>
    <div class="matriz min-h-screen p-4">
      <div class=" mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 md:grid-cols-2">
        <div class="et-card col-span-2 mx-auto w-full md:col-span-1">
          <h2 class="et-h2">
            <span class="et-step">1</span>Identifique a rocha
          </h2>
          <p class="et-sub mb-5">
            Digite a litologia. Abrasividade e dureza (Mohs) são definidas automaticamente pelo nome da rocha.
          </p>

          <div class="mb-5">
            <label for="buscar" class="font-semibold">
              Buscar rocha
            </label>
            <UInputMenu id="buscar" v-model="state.rocha" placeholder="Ex.: quartzito, basalto, arenito..." color="error" class="w-full" :items="rochas" />

            <div v-if="selectedRock" class="et-rockcard mt-3">
              <p class="font-[Saira] text-base font-bold text-(--et-ink)">
                {{ selectedRock.n }}
              </p>
              <div class="mt-2 flex flex-wrap gap-2">
                <span class="et-chip">Mohs <b>{{ selectedRock.mohs }}</b></span>
                <span class="et-chip">Quartzo eq. <b>~{{ selectedRock.eqc }}%</b></span>
                <span class="et-chip">CAI <b>{{ selectedRock.cai }}</b> ({{ caiClass(selectedRock.cai) }})</span>
                <span class="et-chip">Abrasividade <b>{{ state.abrasividade }}</b></span>
                <span class="et-chip">UCS <b>{{ selectedRock.ucs[0] }}–{{ selectedRock.ucs[1] }} MPa</b></span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label for="dureza" class="font-semibold">
                Dureza (Mohs)  <span class="et-sub">{{ state.mohs }}</span>
              </label>
              <USlider id="dureza" v-model="state.mohs" :disabled="blockMohs && !modoAvancado" tooltip color="error" class="mt-5" :min="1" :max="10" :step="0.1" />
              <UButton v-if="blockMohs" variant="link" color="error" class="mt-1 p-0" :label="modoAvancado ? 'Usar dureza da rocha' : 'Modo avançado: ajustar dureza'" @click="toggleAvancado" />
            </div>
            <div class="mb-4">
              <label for="abrasividade" class="font-semibold">
                Abrasividade
                <UTooltip text="Estimada pelo teor de quartzo equivalente (EQC) e classe Cerchar (CAI). Mais abrasivo → liga mais dura + ABR + mais água.">
                  <UIcon name="i-heroicons-information-circle" class="size-4 align-middle text-[#5B6573]" />
                </UTooltip>
              </label>
              <URadioGroup id="abrasividade" v-model="state.abrasividade" orientation="horizontal" color="error" :variant="isMobile ? 'list' : 'card'" :items="abrasividadeOptions" />
            </div>
          </div>
          <div class="mb-4">
            <label for="diametro" class="font-semibold">
              Diâmetro da coroa
            </label>
            <URadioGroup id="diametro" v-model="state.diametro" orientation="horizontal" color="error" :variant="isMobile ? 'list' : 'card'" :items="diametroOptions" />
          </div>
          <div class="mb-4">
            <label for="granulometria" class="font-semibold">
              Granulometria
            </label>
            <URadioGroup id="granulometria" v-model="state.granulometria" orientation="horizontal" color="error" :variant="isMobile ? 'list' : 'card'" :items="granulometriaOptions" />
          </div>
          <div class="mb-4">
            <label for="formacao" class="font-semibold">
              Característica da formação
              <UTooltip text="Friável/fraturada → liga mais dura e RPM/WOB menores. Compacta → liga mais macia.">
                <UIcon name="i-heroicons-information-circle" class="size-4 align-middle text-[#5B6573]" />
              </UTooltip>
            </label>
            <URadioGroup id="formacao" v-model="state.formacao" orientation="horizontal" color="error" :variant="isMobile ? 'list' : 'card'" :items="estadoOptions" />
          </div>
          <div class="mb-4">
            <label for="objetivo" class="font-semibold">
              Objetivo
              <UTooltip text="Penetração → mais área aberta e RPM. Vida útil → menos área aberta, parâmetros conservadores.">
                <UIcon name="i-heroicons-information-circle" class="size-4 align-middle text-[#5B6573]" />
              </UTooltip>
            </label>
            <URadioGroup id="objetivo" v-model="state.objetivo" orientation="horizontal" color="error" :variant="isMobile ? 'list' : 'card'" :items="objetivoOptions" />
          </div>

          <UButton label="Obter recomendação" class="et-btn-red flex w-full justify-center p-2 font-bold" :loading="isLoading" @click="getRecomendacao" />
        </div>

        <div class="col-span-2 mx-auto w-full md:col-span-1">
          <MatrizRecomendacao v-if="gerarRecomendacao && recomendacao" :data="recomendacao">
            <template #actions>
              <UButton label="Copiar link" :icon="copied ? 'i-heroicons-check-circle' : 'i-heroicons-link'" class="et-btn-red mt-4 font-bold" :loading="isLoading" @click="copy(source)" />
            </template>
          </MatrizRecomendacao>

          <NuxtLink to="/catalogos/catalogo2025.pdf" external target="_blank" label="Veja o catálogo" class="et-btn-red mt-5 flex w-full justify-center rounded-lg p-2 font-bold">
            Veja o catálogo competo!
          </NuxtLink>
        </div>

        <div class="et-card col-span-2">
          <h2 class="et-h2">
            Dicas operacionais
          </h2>
          <ol class="et-sub list-inside list-disc space-y-2 p-4">
            <li>RPM alta para matrizes maiores (mais macias); RPM moderada para matrizes menores (mais duras).</li>
            <li>WOB: use o mínimo que mantenha avanço; excesso pode danificar a coroa.</li>
            <li>Aumente o fluxo de água com maior taxa de penetração; evite fluido muito viscoso.</li>
            <li>Em alta abrasividade, prefira canais Hydra/Face Discharge e considere séries ABR.</li>
            <li>Em terreno quebrado, reduza a RPM (até ~metade) e aplique peso suficiente para manter o avanço.</li>
          </ol>
        </div>

        <div class="et-card col-span-2">
          <h2 class="et-h2">
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

        <UModal v-model:open="modalCadastro" title="Cadastre-se" description="Por favor, preencha os dados abaixo para se cadastrar." :ui="{ footer: 'justify-end' }">
          <UButton label="Cadastrar-se..." class="mt-5" variant="ghost" color="error" :loading="isLoading" />

          <template #body>
            <UForm :schema="LeadSchema" :state="newLead" class="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:grid-rows-3">
              <UFormField label="Nome" name="nome">
                <UInput v-model="newLead.nome" color="error" @keydown.enter="salvarLead" />
              </UFormField>
              <UFormField label="Email" name="email">
                <UInput v-model="newLead.email" color="error" @keydown.enter="salvarLead" />
              </UFormField>
              <UFormField label="Telefone" name="telefone">
                <UInput v-model="newLead.telefone" v-maska="'(##) #####-####'" placeholder="(99) 99999-9999" color="error" @keydown.enter="salvarLead" />
              </UFormField>
              <UFormField label="Empresa" name="empresa">
                <UInput v-model="newLead.empresa" color="error" @keydown.enter="salvarLead" />
              </UFormField>
              <UFormField label="Cargo" name="cargo">
                <UInput v-model="newLead.cargo" color="error" @keydown.enter="salvarLead" />
              </UFormField>
              <UFormField label="Trabalha com método Wireline?" name="wireline">
                <URadioGroup id="wireline" v-model="wireline" orientation="horizontal" color="error" :variant="isMobile ? 'list' : 'card'" :items="['Sim', 'Não']" />
              </UFormField>
            </UForm>
          </template>

          <template #footer>
            <UButton label="Cancelar" color="error" variant="outline" @click="modalCadastro = false" />
            <UButton label="Confirmar" color="error" :loading="isLoading" @click="salvarLead" />
          </template>
        </UModal>
      </template>

      <template #footer>
        <UButton label="Confirmar" color="error" :loading="isLoading" @click="login" />
      </template>
    </UModal>

    <UButton class="fixed right-5 bottom-5 z-50 flex size-14 items-center justify-center overflow-hidden rounded-full bg-[#5BF070] p-0 text-white transition-opacity ease-in-out" @click="navigateTo('https://wa.link/c1di0k', { open: { target: '_blank' } })">
      <UIcon name="ic-baseline-whatsapp" class="pointer-events-none size-10" />
    </UButton>
  </section>
</template>
