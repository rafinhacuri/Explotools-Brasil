<script setup lang="ts">
  import { safeParse } from 'valibot'

  const text = {
    title: 'Seleção de matriz',
    description:
      'Ferramenta gratuita da Explotools para escolher a dureza da matriz da coroa diamantada impregnada pela rocha, abrasividade e diâmetro — com RPM, WOB, vazão e equivalência entre marcas.',
    eyebrow: 'Ferramenta Explotools',
    heading: ['Seleção', 'de matriz.'],
    lede: 'Informe a rocha e as condições do furo. A ferramenta sugere a dureza da matriz, a série, a geometria da coroa e os parâmetros de operação.',
    step1: 'Identifique a rocha',
    step1Lede:
      'Digite a litologia. Abrasividade e dureza (Mohs) vêm automaticamente pelo nome da rocha.',
    search: 'Buscar rocha',
    searchPlaceholder: 'Ex.: quartzito, basalto, arenito…',
    noRock: 'Nenhuma rocha com esse nome. Você pode seguir ajustando a dureza manualmente.',
    step2: 'Condições do furo',
    hardness: 'Dureza (Mohs)',
    advanced: 'Ajustar dureza manualmente',
    useRock: 'Usar dureza da rocha',
    abrasion: 'Abrasividade',
    abrasionHint:
      'Estimada pelo teor de quartzo equivalente (EQC) e classe Cerchar (CAI). Mais abrasivo → liga mais dura + ABR + mais água.',
    diameter: 'Diâmetro da coroa',
    grain: 'Granulometria',
    formation: 'Característica da formação',
    formationHint:
      'Friável/fraturada → liga mais dura e RPM/WOB menores. Compacta → liga mais macia.',
    goal: 'Objetivo',
    goalHint:
      'Penetração → mais área aberta e RPM. Vida útil → menos área aberta, parâmetros conservadores.',
    submit: 'Obter recomendação',
    empty: 'Sua recomendação aparece aqui.',
    emptyLede: 'Preencha a rocha e as condições do furo e toque em “Obter recomendação”.',
    copy: 'Copiar link',
    copied: 'Link copiado',
    catalog: 'Ver o catálogo completo',
    recent: 'Recomendações recentes',
    noRecent: 'Nenhuma recomendação ainda.',
    logout: 'Sair',
    tipsTitle: 'Dicas operacionais',
    faqTitle: 'Perguntas frequentes',
    sessionOut: 'Você saiu da ferramenta',
  }

  useHead({ title: text.title })
  useSeoMeta({ description: text.description })
  defineOgImage('Explotools.takumi', {
    title: 'Seleção de matriz.',
    description: 'Qual coroa para a sua rocha? Ferramenta gratuita.',
  })

  const tips = [
    'RPM alta para matrizes maiores (mais macias); RPM moderada para matrizes menores (mais duras).',
    'WOB: use o mínimo que mantenha avanço; excesso pode danificar a coroa.',
    'Aumente o fluxo de água com maior taxa de penetração; evite fluido muito viscoso.',
    'Em alta abrasividade, prefira canais Hydra/Face Discharge e considere séries ABR.',
    'Em terreno quebrado, reduza a RPM (até ~metade) e aplique peso suficiente para manter o avanço.',
  ]

  const faq = [
    {
      q: 'O que é série e o que é matriz?',
      a: 'Série (ex.: 2-4, 4-6, 6-9, 9-11, 12-14) é a família operacional do produto. Matriz (1–9) é a dureza da liga metálica que libera os diamantes: números menores são mais duros; números maiores são mais macios.',
    },
    {
      q: 'Por que rocha dura pede matriz mais macia?',
      a: 'Princípio do autoafiamento: a matriz precisa desgastar na mesma taxa em que a rocha gasta os diamantes, para expor sempre pedras novas. Rocha dura e não abrasiva não desgasta a liga sozinha — então usa-se matriz macia, que se “abre”. Rocha mole e abrasiva desgasta a liga rápido demais — então usa-se matriz dura, para a coroa durar.',
    },
    {
      q: 'De onde vem a abrasividade se eu só informo o nome?',
      a: 'Cada litologia tem um teor de quartzo equivalente (EQC) e uma classe de abrasividade Cerchar (CAI) característicos da sua mineralogia. A ferramenta estima isso pelo nome da rocha — você pode ajustar no campo Abrasividade se o terreno local for atípico.',
    },
    {
      q: 'O que é ABR?',
      a: 'ABR identifica variantes para terrenos abrasivos. Em rochas com muito quartzo/hematita (granito, gnaisse, arenito quartzoso, itabirito), considere 7 ABR ou 9 ABR.',
    },
    {
      q: 'Como são definidas as principais marcas de coroa?',
      a: 'Não existe tabela pública que diga “grade X de uma marca = grade Y de outra”. O único eixo que todos os fabricantes publicam é a escala Mohs. Por isso alinhamos os grades pela faixa de Mohs que cada um cobre, usando dados oficiais: Boart Longyear (cores Longyear + UMX), Fordia/Epiroc (HERO), Di-Corp (CoreMatrix; sufixos A=abrasivo, E=vida, F=penetração), Dimatec (séries S e XT) e Hayden (escala 1–16). Sempre confirme com o catálogo oficial do fabricante.',
    },
    {
      q: 'Os números são exatos?',
      a: 'Não. São um ponto de partida baseado em referências técnicas e de fabricantes. Ajuste sempre pela resposta do furo (taxa de penetração, vibração, polimento da face). Os valores reais de cada maciço dependem de ensaio.',
    },
  ]

  const { recomendacaoSchema } = useRecomendacaoSchema()
  const { loggedIn, fetch: refreshSession, clear: clearSession } = useUserSession()
  const toast = useToast()
  const gate = ref(false)
  const loading = ref(false)
  const result = ref<RecomendacaoMongo | null>(null)
  const resultEl = useTemplateRef<HTMLElement>('resultEl')
  const { $lenis } = useNuxtApp()

  const state = ref<RecomendacaoSchema>({
    rocha: '',
    mohs: 6.5,
    abrasividade: 'Média',
    formacao: 'Moderada',
    granulometria: 'Médio',
    diametro: 'NQ',
    objetivo: 'Equilíbrio',
  })

  const mohs = computed({
    get: () => [state.value.mohs],
    set: (value: number[]) => {
      state.value.mohs = value[0] ?? state.value.mohs
    },
  })

  const advanced = ref(false)
  const term = ref('')
  const rock = computed(() => findRock(state.value.rocha))
  const locked = computed(() => Boolean(rock.value) && !advanced.value)

  function normalize(value: string): string {
    return value
      .normalize('NFD')
      .replaceAll(/\p{Diacritic}/gu, '')
      .toLowerCase()
  }

  const matches = computed(() => {
    const query = normalize(term.value.trim())
    const list = query ? rochas.filter((label) => normalize(label).includes(query)) : rochas
    return list.slice(0, 60)
  })

  function abraLabel(abra: 'low' | 'medium' | 'high'): RecomendacaoSchema['abrasividade'] {
    if (abra === 'low') return 'Baixa'
    return abra === 'high' ? 'Alta' : 'Média'
  }

  watch(
    () => state.value.rocha,
    () => {
      const found = rock.value
      advanced.value = false
      if (!found) return
      state.value.mohs = found.mohs
      state.value.abrasividade = abraLabel(found.abra)
    },
  )

  function toggleAdvanced(): void {
    advanced.value = !advanced.value
    if (!advanced.value && rock.value) state.value.mohs = rock.value.mohs
  }

  const { data: recent, refresh: refreshRecent } = await useFetch<RecomendacaoResumo[]>(
    '/api/recomendacoes',
    {
      default: () => [],
      immediate: loggedIn.value,
    },
  )

  onMounted(() => {
    if (!loggedIn.value) gate.value = true
  })

  async function entered(): Promise<void> {
    await refreshRecent()
  }

  async function submit(): Promise<void> {
    if (!loggedIn.value) {
      gate.value = true
      return
    }
    const body = safeParse(recomendacaoSchema, state.value)
    if (!body.success) {
      toast.error(body.issues[0]?.message ?? 'Confira os campos')
      return
    }
    loading.value = true
    try {
      result.value = await $fetch('/api/recomendacoes', { method: 'POST', body: body.output })
      await refreshRecent()
      await nextTick()
      if (resultEl.value && globalThis.innerWidth < 1024) {
        if ($lenis) $lenis.scrollTo(resultEl.value, { offset: -90, duration: 1.2 })
        else resultEl.value.scrollIntoView({ behavior: 'smooth' })
      }
    } catch (error) {
      toast.fail(error)
      if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
        await refreshSession()
        gate.value = true
      }
    } finally {
      loading.value = false
    }
  }

  const { copy } = useClipboard()

  async function share(): Promise<void> {
    if (!result.value) return
    await copy(`${globalThis.location.origin}/selecao-matriz/${result.value.uid}`)
    toast.success(text.copied)
  }

  async function logout(): Promise<void> {
    await clearSession()
    result.value = null
    recent.value = []
    toast.info(text.sessionOut)
    gate.value = true
  }
</script>

<template>
  <div>
    <section class="relative overflow-hidden pt-32 pb-12 sm:pt-40">
      <div aria-hidden="true" class="absolute inset-x-0 bottom-0 h-full opacity-60">
        <Strata :layers="6" :seed="31" :depth="180" :vein="3" />
      </div>
      <div
        aria-hidden="true"
        class="absolute inset-0 bg-linear-to-b from-furo/30 via-furo/60 to-furo" />
      <div
        class="relative mx-auto flex max-w-[90rem] flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Motion
            as="p"
            class="label text-red"
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :transition="{ delay: 0.15 }">
            {{ text.eyebrow }}
          </Motion>
          <h1 class="mt-5 display text-[clamp(4rem,12vw,10rem)] leading-[0.82]">
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
          <Reveal :delay="0.4">
            <p class="mt-6 max-w-xl text-lede text-muted">{{ text.lede }}</p>
          </Reveal>
        </div>

        <div v-if="loggedIn" class="flex items-center gap-2">
          <PopoverRoot>
            <PopoverTrigger
              class="flex h-11 items-center gap-2 rounded-full border border-line-strong bg-furo/50 px-4 text-[0.875rem] font-semibold backdrop-blur hover:border-fg/50">
              <Icon name="ph:clock-counter-clockwise" class="size-4" />
              {{ text.recent }}
              <span class="rounded-full bg-red px-2 py-0.5 font-mono text-[0.6875rem] text-osso">{{
                recent.length
              }}</span>
            </PopoverTrigger>
            <PopoverPortal>
              <PopoverContent
                align="end"
                :side-offset="8"
                class="pop z-60 w-80 rounded-2xl border border-line-strong bg-rocha-2 p-2 shadow-float">
                <p v-if="!recent.length" class="p-3 text-[0.875rem] text-muted">
                  {{ text.noRecent }}
                </p>
                <NuxtLink
                  v-for="item in recent"
                  :key="item.uid"
                  :to="`/selecao-matriz/${item.uid}`"
                  class="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-fg/5">
                  <span class="min-w-0">
                    <span class="block truncate text-[0.875rem] font-semibold">{{
                      item.rocha || 'Sem rocha'
                    }}</span>
                    <span class="block font-mono text-[0.6875rem] text-faint">{{
                      formatDate(item.createdAt)
                    }}</span>
                  </span>
                  <span class="display text-[1.75rem] leading-none text-red">{{
                    item.matriz
                  }}</span>
                </NuxtLink>
              </PopoverContent>
            </PopoverPortal>
          </PopoverRoot>
          <button
            type="button"
            class="flex size-11 items-center justify-center rounded-full border border-line-strong bg-furo/50 backdrop-blur hover:border-red hover:text-red"
            :aria-label="text.logout"
            @click="logout">
            <Icon name="ph:sign-out" class="size-4" />
          </button>
        </div>
      </div>
    </section>

    <section class="relative bg-furo pb-20">
      <div
        class="mx-auto grid max-w-[90rem] gap-6 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <form
          class="flex flex-col gap-6 rounded-[2rem] border border-line bg-rocha p-6 sm:p-8"
          novalidate
          @submit.prevent="submit">
          <div>
            <p class="flex items-center gap-3">
              <span
                class="flex size-7 items-center justify-center rounded-lg bg-red font-mono text-[0.8125rem] font-semibold text-osso"
                >1</span
              >
              <span class="text-title font-semibold">{{ text.step1 }}</span>
            </p>
            <p class="mt-2 text-[0.875rem] text-muted">{{ text.step1Lede }}</p>
          </div>

          <div>
            <label for="rocha" class="text-[0.875rem] font-semibold">{{ text.search }}</label>
            <ComboboxRoot v-model="state.rocha" ignore-filter open-on-focus class="relative mt-2.5">
              <ComboboxAnchor
                class="flex h-12 items-center gap-2 rounded-xl border border-line-strong bg-furo/60 px-4 focus-within:border-red focus-within:ring-4 focus-within:ring-red/20">
                <Icon name="ph:magnifying-glass" class="size-4 shrink-0 text-faint" />
                <ComboboxInput
                  id="rocha"
                  v-model="term"
                  :placeholder="text.searchPlaceholder"
                  class="h-full flex-1 bg-transparent text-[0.9375rem] outline-none placeholder:text-faint"
                  :display-value="(value: string) => value" />
                <ComboboxTrigger
                  class="text-faint hover:text-fg"
                  aria-label="Abrir lista de rochas">
                  <Icon name="ph:caret-down" class="size-4" />
                </ComboboxTrigger>
              </ComboboxAnchor>
              <ComboboxPortal>
                <ComboboxContent
                  position="popper"
                  :side-offset="6"
                  class="pop z-60 max-h-72 w-(--reka-combobox-trigger-width) overflow-hidden rounded-2xl border border-line-strong bg-rocha-2 shadow-float">
                  <ComboboxViewport class="max-h-72 overflow-y-auto p-1.5">
                    <ComboboxEmpty class="p-3 text-[0.8125rem] text-muted">{{
                      text.noRock
                    }}</ComboboxEmpty>
                    <ComboboxItem
                      v-for="label in matches"
                      :key="label"
                      :value="label"
                      class="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-[0.875rem] outline-none data-highlighted:bg-red data-highlighted:text-osso">
                      <span>{{ label.split(' - Mohs')[0] }}</span>
                      <span class="font-mono text-[0.75rem] opacity-70"
                        >Mohs {{ label.split(' - Mohs ')[1] }}</span
                      >
                    </ComboboxItem>
                  </ComboboxViewport>
                </ComboboxContent>
              </ComboboxPortal>
            </ComboboxRoot>

            <Transition
              enter-active-class="transition duration-300 ease-out-quint"
              enter-from-class="-translate-y-2 opacity-0"
              leave-active-class="transition duration-150"
              leave-to-class="opacity-0">
              <div v-if="rock" class="mt-3 rounded-2xl border border-red/30 bg-red/8 p-4">
                <p class="display text-[1.5rem] leading-none">{{ rock.n }}</p>
                <div class="mt-3 flex flex-wrap gap-1.5 text-[0.75rem]">
                  <span class="rounded-full border border-line-strong px-2.5 py-1"
                    >Mohs <b>{{ rock.mohs }}</b></span
                  >
                  <span class="rounded-full border border-line-strong px-2.5 py-1"
                    >Quartzo eq. <b>~{{ rock.eqc }}%</b></span
                  >
                  <span class="rounded-full border border-line-strong px-2.5 py-1"
                    >CAI <b>{{ rock.cai }}</b> ({{ caiClass(rock.cai) }})</span
                  >
                  <span class="rounded-full border border-line-strong px-2.5 py-1"
                    >UCS <b>{{ rock.ucs[0] }}–{{ rock.ucs[1] }} MPa</b></span
                  >
                </div>
              </div>
            </Transition>
          </div>

          <div class="h-px bg-line" />

          <p class="flex items-center gap-3">
            <span
              class="flex size-7 items-center justify-center rounded-lg bg-red font-mono text-[0.8125rem] font-semibold text-osso"
              >2</span
            >
            <span class="text-title font-semibold">{{ text.step2 }}</span>
          </p>

          <div>
            <div class="flex items-baseline justify-between">
              <span id="mohs" class="text-[0.875rem] font-semibold">{{ text.hardness }}</span>
              <span
                class="font-mono text-[1.125rem] tabular-nums"
                :class="locked ? 'text-muted' : 'text-fg'"
                >{{ state.mohs.toFixed(1) }}</span
              >
            </div>
            <SliderRoot
              v-model="mohs"
              :min="1"
              :max="10"
              :step="0.1"
              :disabled="locked"
              aria-labelledby="mohs"
              class="relative mt-4 flex h-6 touch-none items-center select-none data-disabled:opacity-50">
              <SliderTrack
                class="relative h-1.5 grow overflow-hidden rounded-full bg-[linear-gradient(90deg,#3a3a40,#fe0018)]">
                <SliderRange class="absolute h-full" />
              </SliderTrack>
              <SliderThumb
                class="block size-6 rounded-full border-4 border-rocha bg-osso shadow-float transition-transform hover:scale-110"
                aria-label="Dureza Mohs" />
            </SliderRoot>
            <button
              v-if="rock"
              type="button"
              class="mt-2 text-[0.8125rem] font-semibold text-red hover:underline"
              @click="toggleAdvanced">
              {{ advanced ? text.useRock : text.advanced }}
            </button>
          </div>

          <MatrizSegmented
            v-model="state.abrasividade"
            :label="text.abrasion"
            :options="ABRASIVIDADES"
            :hint="text.abrasionHint" />
          <MatrizSegmented v-model="state.diametro" :label="text.diameter" :options="DIAMETROS" />
          <MatrizSegmented
            v-model="state.granulometria"
            :label="text.grain"
            :options="GRANULOMETRIAS" />
          <MatrizSegmented
            v-model="state.formacao"
            :label="text.formation"
            :options="FORMACOES"
            :hint="text.formationHint" />
          <MatrizSegmented
            v-model="state.objetivo"
            :label="text.goal"
            :options="OBJETIVOS"
            :hint="text.goalHint" />

          <Btn type="submit" size="lg" :loading="loading" icon="ph:diamond" class="w-full">{{
            text.submit
          }}</Btn>
        </form>

        <div ref="resultEl" class="flex flex-col gap-4 lg:sticky lg:top-24">
          <Transition
            mode="out-in"
            enter-active-class="transition duration-500 ease-out-quint"
            enter-from-class="translate-y-6 opacity-0 blur-sm"
            leave-active-class="transition duration-200"
            leave-to-class="opacity-0">
            <MatrizResult v-if="result" :key="result.uid" :data="result">
              <template #actions>
                <Btn icon="ph:link" @click="share">{{ text.copy }}</Btn>
                <Btn
                  to="/catalogos/catalogo2025.pdf"
                  external
                  variant="ghost"
                  icon="ph:download-simple"
                  >{{ text.catalog }}</Btn
                >
              </template>
            </MatrizResult>
            <div
              v-else
              class="relative flex min-h-[28rem] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-dashed border-line-strong p-8 text-center">
              <div
                aria-hidden="true"
                class="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgb(254_0_24/0.1),transparent_60%)]" />
              <svg
                :viewBox="MARK_VIEWBOX"
                class="relative h-20 w-auto text-red/80"
                aria-hidden="true">
                <path fill="currentColor" :d="MARK_PATH" />
              </svg>
              <p class="relative mt-6 display text-[2rem] leading-none">{{ text.empty }}</p>
              <p class="relative mt-3 max-w-sm text-[0.9375rem] text-muted">{{ text.emptyLede }}</p>
            </div>
          </Transition>
        </div>
      </div>

      <div class="mx-auto mt-6 grid max-w-[90rem] gap-6 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal class="rounded-[2rem] border border-line bg-rocha p-6 sm:p-8">
          <h2 class="display text-[2rem] leading-none">{{ text.tipsTitle }}</h2>
          <ul class="mt-5 flex flex-col gap-3">
            <li v-for="tip in tips" :key="tip" class="flex gap-3 text-[0.9375rem] text-fg/85">
              <Icon name="ph:lightning-fill" class="mt-1 size-4 shrink-0 text-red" />
              {{ tip }}
            </li>
          </ul>
        </Reveal>

        <Reveal :delay="0.08" class="rounded-[2rem] border border-line bg-rocha p-6 sm:p-8">
          <h2 class="display text-[2rem] leading-none">{{ text.faqTitle }}</h2>
          <AccordionRoot type="single" collapsible class="mt-4">
            <AccordionItem
              v-for="item in faq"
              :key="item.q"
              :value="item.q"
              class="border-b border-line last:border-b-0">
              <AccordionHeader>
                <AccordionTrigger
                  class="group flex w-full items-center justify-between gap-4 py-4 text-left text-[0.9375rem] font-semibold">
                  {{ item.q }}
                  <Icon
                    name="ph:plus"
                    class="size-4 shrink-0 text-red transition-transform duration-300 group-data-[state=open]:rotate-45" />
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent class="fold">
                <p class="pb-4 text-[0.9375rem] text-muted">{{ item.a }}</p>
              </AccordionContent>
            </AccordionItem>
          </AccordionRoot>
        </Reveal>
      </div>
    </section>

    <MatrizGate v-model:open="gate" @entered="entered" />
  </div>
</template>
