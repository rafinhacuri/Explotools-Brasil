<script setup lang="ts">
  import type { Abra } from '#shared/utils/rochas'
  import { BRASIL_TRANSFORM, BRASIL_UFS, BRASIL_VIEWBOX } from '~/data/brasil'

  interface Tally {
    label: string
    total: number
  }

  const text = {
    period: 'Período',
    total: 'Coroas recomendadas',
    clients: 'Clientes com coroa',
    high: 'Em rocha muito abrasiva',
    states: 'Estados com sondagem',
    lens: 'O mapa mostra',
    lensSeries: 'Qual série?',
    pickState: 'Toque num estado para filtrar o painel inteiro por ele.',
    filtered: 'Mostrando só',
    clear: 'Ver o Brasil todo',
    noLocal: 'recomendações sem local (feitas antes da pergunta da cidade) não entram no mapa.',
    ranking: 'Por estado',
    abrasion: 'Abrasividade das rochas',
    abrasionVersion: 'saíram na versão abrasiva',
    series: 'Séries (matriz)',
    seriesNormal: 'versão normal',
    seriesAbrasive: 'versão abrasiva',
    seriesByState: 'Onde está cada série',
    seriesByStateLede: 'Quantas coroas de cada matriz foram recomendadas em cada estado.',
    cities: 'Cidades com mais coroas',
    byClient: 'Coroas por cliente',
    byClientLede: 'O que cada cliente está pedindo. Toque numa coroa para abrir a recomendação.',
    rule: 'Cotações antigas × regra nova',
    ruleLede:
      'Estas coroas foram cotadas antes da versão abrasiva. Com a regra de hoje, o resultado seria outro. O cliente continua vendo a coroa que foi cotada: nada foi alterado nem enviado.',
    ruleNone: 'Nenhuma cotação antiga mudaria com a regra nova.',
    ruleWould: 'hoje seria',
    empty: 'Nenhuma coroa neste recorte.',
    crowns: 'coroas',
    state: 'Estado',
  }

  const periods = [
    { label: '30 dias', days: 30 },
    { label: '90 dias', days: 90 },
    { label: '12 meses', days: 365 },
    { label: 'Tudo', days: 0 },
  ]
  const lenses = ['Coroas', 'Mais abrasivas', 'Série'] as const
  const ABRA: { key: Abra; label: string; bar: string }[] = [
    { key: 'low', label: 'Baixa', bar: 'bg-fg/30' },
    { key: 'medium', label: 'Média', bar: 'bg-red/50' },
    { key: 'high', label: 'Alta', bar: 'bg-red' },
  ]
  const STATUS: Record<StatusCoroa, string> = {
    aguardando: 'Aguardando teste',
    atendeu: 'Atendeu',
    ajustada: 'Precisou ajustar',
  }

  const periodLabel = ref('Tudo')
  const lens = ref<string>('Coroas')
  const serie = ref('')
  const selected = ref<string | null>(null)

  const { data } = useFetch<PainelRow[]>('/api/painel', {
    lazy: true,
    server: false,
    default: () => [],
  })

  /* ===== Recortes: período e estado ===== */
  const rows = computed(() => {
    const days = periods.find((item) => item.label === periodLabel.value)?.days ?? 0
    if (!days) return data.value
    const since = new Date(Date.now() - days * 86_400_000).toISOString()
    return data.value.filter((row) => row.createdAt >= since)
  })
  const scoped = computed(() =>
    selected.value ? rows.value.filter((row) => row.uf === selected.value) : rows.value,
  )

  function tally(list: PainelRow[], key: (row: PainelRow) => string | null): Tally[] {
    const totals = new Map<string, number>()
    for (const row of list) {
      const label = key(row)
      if (label) totals.set(label, (totals.get(label) ?? 0) + 1)
    }
    return [...totals]
      .map(([label, total]) => ({ label, total }))
      .toSorted((a, b) => b.total - a.total || a.label.localeCompare(b.label))
  }

  function share(part: number, whole: number): string {
    return whole ? `${Math.round((part / whole) * 100)}%` : '0%'
  }

  function nome(uf: string): string {
    return UFS.find((item) => item.sigla === uf)?.nome ?? uf
  }

  /* ===== Números do topo ===== */
  const highCount = computed(() => scoped.value.filter((row) => row.abrasividade === 'high').length)
  const stats = computed(() => [
    { label: text.total, value: String(scoped.value.length), icon: 'ph:diamond' },
    {
      label: text.clients,
      value: String(new Set(scoped.value.map((row) => row.email)).size),
      icon: 'ph:users-three',
    },
    { label: text.high, value: share(highCount.value, scoped.value.length), icon: 'ph:fire' },
    {
      label: text.states,
      value: String(new Set(rows.value.map((row) => row.uf).filter(Boolean)).size),
      icon: 'ph:map-trifold',
    },
  ])

  /* ===== Mapa: a mesma malha, três leituras ===== */
  const seriesAvailable = computed(() =>
    MATRICES.map((matrix) => matrix.id).filter((id) => rows.value.some((row) => row.serie === id)),
  )
  watch(
    seriesAvailable,
    (list) => {
      if (!list.includes(serie.value)) serie.value = list.at(-1) ?? ''
    },
    { immediate: true },
  )
  const lensRows = computed(() => {
    if (lens.value === 'Mais abrasivas') {
      return rows.value.filter((row) => row.abrasividade === 'high')
    }
    if (lens.value === 'Série') return rows.value.filter((row) => row.serie === serie.value)
    return rows.value
  })
  const byState = computed(() => tally(lensRows.value, (row) => row.uf))
  const stateTotals = computed(() => new Map(byState.value.map((item) => [item.label, item.total])))
  const stateMax = computed(() => Math.max(1, ...stateTotals.value.values()))
  const noLocal = computed(() => rows.value.filter((row) => !row.uf).length)
  const lensCaption = computed(() => {
    if (lens.value === 'Mais abrasivas') return 'coroas em rocha de abrasividade alta'
    if (lens.value === 'Série') return `coroas da matriz ${serie.value}`
    return text.crowns
  })

  function opacity(uf: string): number {
    const total = stateTotals.value.get(uf) ?? 0
    return total ? 0.25 + 0.75 * (total / stateMax.value) : 1
  }

  function toggle(uf: string): void {
    selected.value = selected.value === uf ? null : uf
  }

  /* ===== Distribuições (seguem o estado escolhido) ===== */
  const abrasion = computed(() =>
    ABRA.map((level) => ({
      key: level.key,
      label: level.label,
      bar: level.bar,
      total: scoped.value.filter((row) => row.abrasividade === level.key).length,
    })),
  )
  const abrasiveVersion = computed(() => scoped.value.filter((row) => row.abrasiva).length)

  const scale = computed(() => {
    const cells = MATRICES.map((matrix) => {
      const list = scoped.value.filter((row) => row.serie === matrix.id)
      const abrasive = list.filter((row) => row.abrasiva).length
      return { id: matrix.id, total: list.length, abrasive, normal: list.length - abrasive }
    })
    const max = Math.max(1, ...cells.map((cell) => cell.total))
    return cells.map((cell) => ({
      id: cell.id,
      total: cell.total,
      normalHeight: `${(cell.normal / max) * 100}%`,
      abrasiveHeight: `${(cell.abrasive / max) * 100}%`,
    }))
  })

  const breakdowns = computed(() => [
    { title: 'Diâmetros', items: tally(scoped.value, (row) => row.diametro) },
    { title: 'Canal de água', items: tally(scoped.value, (row) => row.canal) },
    { title: 'Rochas', items: tally(scoped.value, (row) => row.rocha).slice(0, 8) },
    { title: 'Avaliação no furo', items: tally(scoped.value, (row) => STATUS[row.status]) },
  ])

  const cities = computed(() =>
    tally(scoped.value, (row) => (row.uf && row.cidade ? `${row.cidade}/${row.uf}` : null)).slice(
      0,
      12,
    ),
  )

  /* ===== Série × estado ===== */
  const grid = computed(() => {
    const states = tally(rows.value, (row) => row.uf).map((item) => item.label)
    const max = Math.max(
      1,
      ...states.flatMap((uf) =>
        seriesAvailable.value.map(
          (id) => rows.value.filter((row) => row.uf === uf && row.serie === id).length,
        ),
      ),
    )
    return states.map((uf) => ({
      uf,
      cells: seriesAvailable.value.map((id) => {
        const total = rows.value.filter((row) => row.uf === uf && row.serie === id).length
        return { id, total, alpha: total ? 0.2 + 0.8 * (total / max) : 0 }
      }),
    }))
  })

  /* ===== Clientes e cotações antigas ===== */
  const clients = computed(() =>
    [...Map.groupBy(scoped.value, (row) => row.email).values()]
      .map((list) => ({
        email: list[0]?.email ?? '',
        cliente: list[0]?.cliente ?? '',
        empresa: list[0]?.empresa ?? '',
        coroas: list,
      }))
      .toSorted((a, b) => b.coroas.length - a.coroas.length),
  )
  const changed = computed(() => scoped.value.filter((row) => row.novaRegra))
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <MatrizSegmented
        v-model="periodLabel"
        class="w-full max-w-md"
        :label="text.period"
        :options="periods.map((item) => item.label)" />
      <p
        v-if="selected"
        class="flex flex-wrap items-center gap-3 rounded-full border border-red/40 bg-red/8 py-1.5 pr-1.5 pl-4 text-[0.875rem]">
        <span
          >{{ text.filtered }} <b>{{ nome(selected) }}</b></span
        >
        <button
          type="button"
          class="flex h-9 items-center gap-1.5 rounded-full bg-fg px-3.5 text-[0.8125rem] font-semibold text-furo"
          @click="selected = null">
          <Icon name="ph:x-bold" class="size-3" />
          {{ text.clear }}
        </button>
      </p>
    </div>

    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-3xl border border-line bg-rocha p-4 sm:p-5">
        <Icon :name="stat.icon" class="size-5 text-red" />
        <p class="mt-4 display text-[2.5rem] leading-none sm:text-[3rem]">{{ stat.value }}</p>
        <p class="mt-1 text-[0.8125rem] text-muted">{{ stat.label }}</p>
      </div>
    </div>

    <!-- Mapa com três leituras -->
    <div class="grid min-w-0 gap-6 lg:grid-cols-[1.25fr_1fr]">
      <div class="min-w-0 rounded-[2rem] border border-line bg-rocha p-4 sm:p-6">
        <MatrizSegmented v-model="lens" :label="text.lens" :options="[...lenses]" />
        <div v-if="lens === 'Série'" class="mt-4">
          <p id="painel-serie" class="text-[0.8125rem] font-semibold">{{ text.lensSeries }}</p>
          <RadioGroupRoot
            v-model="serie"
            aria-labelledby="painel-serie"
            class="mt-2 flex flex-wrap gap-1.5">
            <RadioGroupItem
              v-for="id in seriesAvailable"
              :key="id"
              :value="id"
              class="h-9 min-w-9 rounded-full border px-3 font-mono text-[0.8125rem] transition-colors data-[state=checked]:border-red data-[state=checked]:bg-red data-[state=checked]:text-osso data-[state=unchecked]:border-line-strong data-[state=unchecked]:text-muted">
              {{ id }}
            </RadioGroupItem>
          </RadioGroupRoot>
        </div>
        <svg
          :viewBox="BRASIL_VIEWBOX"
          class="mx-auto mt-4 h-auto w-full max-w-[36rem]"
          role="img"
          :aria-label="`Mapa do Brasil: ${lensCaption} por estado`">
          <g :transform="BRASIL_TRANSFORM">
            <path
              v-for="item in BRASIL_UFS"
              :key="item.uf"
              :d="item.d"
              :fill-opacity="opacity(item.uf)"
              vector-effect="non-scaling-stroke"
              :stroke-width="selected === item.uf ? 2.5 : 1"
              class="cursor-pointer transition-[fill-opacity,fill] duration-300"
              :class="[
                stateTotals.get(item.uf) ? 'fill-red' : 'fill-fg/8',
                selected === item.uf ? 'stroke-osso' : 'stroke-furo',
              ]"
              @click="toggle(item.uf)">
              <title>
                {{ nome(item.uf) }} · {{ stateTotals.get(item.uf) ?? 0 }} {{ lensCaption }}
              </title>
            </path>
          </g>
        </svg>
        <p class="mt-3 text-[0.8125rem] text-muted">{{ text.pickState }}</p>
        <p v-if="noLocal" class="mt-1 text-[0.75rem] text-faint">
          {{ noLocal }} {{ text.noLocal }}
        </p>
      </div>

      <div class="min-w-0 rounded-[2rem] border border-line bg-rocha p-5 sm:p-6">
        <h3 class="display text-[1.75rem] leading-none">{{ text.ranking }}</h3>
        <p class="mt-1 font-mono text-[0.75rem] text-faint">{{ lensCaption }}</p>
        <p v-if="!byState.length" class="mt-4 text-[0.875rem] text-muted">{{ text.empty }}</p>
        <ul class="mt-4 flex flex-col gap-2.5">
          <li v-for="item in byState" :key="item.label">
            <button
              type="button"
              class="w-full text-left"
              :aria-pressed="selected === item.label"
              @click="toggle(item.label)">
              <span class="flex justify-between gap-3 text-[0.875rem]">
                <span :class="selected === item.label ? 'font-semibold text-red' : ''">{{
                  nome(item.label)
                }}</span>
                <span class="font-mono tabular-nums">{{ item.total }}</span>
              </span>
              <span class="mt-1 block h-1.5 overflow-hidden rounded-full bg-fg/8">
                <span
                  class="block h-full rounded-full bg-red"
                  :style="{ width: `${(item.total / stateMax) * 100}%` }" />
              </span>
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Abrasividade e séries -->
    <div class="grid min-w-0 gap-6 lg:grid-cols-[1fr_1.4fr]">
      <div class="min-w-0 rounded-[2rem] border border-line bg-rocha p-5 sm:p-6">
        <h3 class="display text-[1.75rem] leading-none">{{ text.abrasion }}</h3>
        <ul class="mt-5 flex flex-col gap-4">
          <li v-for="level in abrasion" :key="level.key">
            <p class="flex items-baseline justify-between gap-3">
              <span class="text-[0.9375rem] font-semibold">{{ level.label }}</span>
              <span class="font-mono text-[0.8125rem] text-muted tabular-nums">
                {{ level.total }} · {{ share(level.total, scoped.length) }}
              </span>
            </p>
            <span class="mt-1.5 block h-3 overflow-hidden rounded-full bg-fg/8">
              <span
                class="block h-full rounded-full transition-[width] duration-500"
                :class="level.bar"
                :style="{ width: share(level.total, scoped.length) }" />
            </span>
          </li>
        </ul>
        <p class="mt-5 rounded-2xl border border-red/30 bg-red/8 px-4 py-3 text-[0.875rem]">
          <b class="font-mono text-red">{{ abrasiveVersion }}</b> {{ text.abrasionVersion }} ({{
            share(abrasiveVersion, scoped.length)
          }}).
        </p>
      </div>

      <div class="min-w-0 rounded-[2rem] border border-line bg-rocha p-5 sm:p-6">
        <div class="flex flex-wrap items-end justify-between gap-3">
          <h3 class="display text-[1.75rem] leading-none">{{ text.series }}</h3>
          <p class="flex gap-4 font-mono text-[0.6875rem] text-muted">
            <span class="flex items-center gap-1.5"
              ><i class="size-2.5 rounded-sm bg-fg/45" />{{ text.seriesNormal }}</span
            >
            <span class="flex items-center gap-1.5"
              ><i class="size-2.5 rounded-sm bg-red" />{{ text.seriesAbrasive }}</span
            >
          </p>
        </div>
        <div class="mt-5 grid grid-cols-11 gap-1 sm:gap-1.5">
          <div v-for="cell in scale" :key="cell.id" class="flex min-w-0 flex-col items-center">
            <span class="h-4 font-mono text-[0.6875rem] text-fg/80 tabular-nums">{{
              cell.total || ''
            }}</span>
            <div
              class="mt-1 flex h-36 w-full flex-col justify-end overflow-hidden rounded-lg bg-fg/5">
              <span class="block w-full bg-red" :style="{ height: cell.abrasiveHeight }" />
              <span class="block w-full bg-fg/45" :style="{ height: cell.normalHeight }" />
            </div>
            <span
              class="mt-1.5 text-center font-mono text-[0.5rem] leading-tight sm:text-[0.6875rem]"
              :class="cell.total ? 'text-fg' : 'text-faint'"
              >{{ cell.id }}</span
            >
          </div>
        </div>
        <div class="mt-2 flex justify-between font-mono text-[0.6875rem] text-faint">
          <span>← liga mais dura</span>
          <span>liga mais macia →</span>
        </div>
      </div>
    </div>

    <!-- Série × estado -->
    <div class="min-w-0 rounded-[2rem] border border-line bg-rocha p-5 sm:p-6">
      <h3 class="display text-[1.75rem] leading-none">{{ text.seriesByState }}</h3>
      <p class="mt-2 text-[0.875rem] text-muted">{{ text.seriesByStateLede }}</p>
      <p v-if="!grid.length" class="mt-4 text-[0.875rem] text-muted">{{ text.empty }}</p>
      <div v-else class="mt-4 overflow-x-auto overscroll-x-contain">
        <table class="w-full min-w-max border-separate border-spacing-1 text-center">
          <thead>
            <tr>
              <th class="sticky left-0 bg-rocha pr-3 text-left label text-[0.625rem] text-fg/60">
                {{ text.state }}
              </th>
              <th
                v-for="id in seriesAvailable"
                :key="id"
                class="min-w-11 px-1 font-mono text-[0.6875rem] font-medium text-fg/70">
                {{ id }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="line in grid" :key="line.uf">
              <th class="sticky left-0 bg-rocha pr-3 text-left text-[0.8125rem] font-semibold">
                <button
                  type="button"
                  :class="selected === line.uf ? 'text-red' : ''"
                  @click="toggle(line.uf)">
                  {{ line.uf }}
                </button>
              </th>
              <td
                v-for="cell in line.cells"
                :key="cell.id"
                class="h-10 rounded-lg font-mono text-[0.8125rem] tabular-nums"
                :class="cell.total ? 'text-osso' : 'bg-fg/4 text-transparent'"
                :style="cell.total ? { backgroundColor: `rgb(254 0 24 / ${cell.alpha})` } : {}">
                {{ cell.total || '·' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Demais variáveis -->
    <div class="grid min-w-0 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="block in breakdowns"
        :key="block.title"
        class="min-w-0 rounded-[2rem] border border-line bg-rocha p-5 sm:p-6">
        <h3 class="display text-[1.5rem] leading-none">{{ block.title }}</h3>
        <p v-if="!block.items.length" class="mt-4 text-[0.875rem] text-muted">{{ text.empty }}</p>
        <ul class="mt-4 flex flex-col gap-2.5">
          <li v-for="item in block.items" :key="item.label">
            <p class="flex justify-between gap-3 text-[0.875rem]">
              <span class="min-w-0 truncate">{{ item.label }}</span>
              <span class="font-mono tabular-nums">{{ item.total }}</span>
            </p>
            <span class="mt-1 block h-1.5 overflow-hidden rounded-full bg-fg/8">
              <span
                class="block h-full rounded-full bg-red"
                :style="{ width: `${(item.total / (block.items[0]?.total || 1)) * 100}%` }" />
            </span>
          </li>
        </ul>
      </div>
    </div>

    <div class="min-w-0 rounded-[2rem] border border-line bg-rocha p-5 sm:p-6">
      <h3 class="display text-[1.75rem] leading-none">{{ text.cities }}</h3>
      <p v-if="!cities.length" class="mt-4 text-[0.875rem] text-muted">{{ text.empty }}</p>
      <ol class="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="(item, index) in cities"
          :key="item.label"
          class="flex items-center justify-between gap-3 rounded-2xl border border-line bg-furo/40 px-4 py-3 text-[0.875rem]">
          <span class="min-w-0 truncate">
            <span class="font-mono text-faint">{{ index + 1 }}.</span> {{ item.label }}
          </span>
          <span class="font-mono font-semibold tabular-nums">{{ item.total }}</span>
        </li>
      </ol>
    </div>

    <!-- O que cada cliente está pedindo -->
    <div class="min-w-0 rounded-[2rem] border border-line bg-rocha p-5 sm:p-6">
      <h3 class="display text-[1.75rem] leading-none">{{ text.byClient }}</h3>
      <p class="mt-2 text-[0.875rem] text-muted">{{ text.byClientLede }}</p>
      <p v-if="!clients.length" class="mt-4 text-[0.875rem] text-muted">{{ text.empty }}</p>
      <ul class="mt-5 grid gap-3 lg:grid-cols-2">
        <li
          v-for="client in clients"
          :key="client.email"
          class="min-w-0 rounded-3xl border border-line bg-furo/40 p-4">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="truncate font-semibold">{{ client.cliente }}</p>
              <p class="truncate text-[0.8125rem] text-muted">
                {{ client.empresa || client.email }}
              </p>
            </div>
            <span
              class="shrink-0 rounded-full bg-red/15 px-2.5 py-1 font-mono text-[0.75rem] text-red">
              {{ client.coroas.length }} {{ text.crowns }}
            </span>
          </div>
          <ul class="mt-3 flex flex-col gap-1.5">
            <li v-for="coroa in client.coroas" :key="coroa.uid">
              <NuxtLink
                :to="`/selecao-matriz/${coroa.uid}`"
                target="_blank"
                class="flex items-center gap-3 rounded-2xl border border-line bg-rocha px-3 py-2 transition-colors hover:border-red">
                <span class="w-[4.25rem] shrink-0 display text-[1.5rem] leading-none text-red">{{
                  coroa.matriz
                }}</span>
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-[0.875rem] font-semibold">
                    {{ coroa.rocha }}
                    <span class="font-normal text-muted"
                      >· {{ coroa.diametro }} · {{ coroa.canal }}</span
                    >
                  </span>
                  <span class="block truncate font-mono text-[0.6875rem] text-faint">
                    {{ formatDate(coroa.createdAt) }}
                    <template v-if="coroa.cidade"> · {{ coroa.cidade }}/{{ coroa.uf }}</template>
                    · {{ STATUS[coroa.status] }}
                  </span>
                </span>
                <Icon name="ph:arrow-square-out" class="size-4 shrink-0 text-faint" />
              </NuxtLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <!-- Cotações antigas × regra nova -->
    <div class="min-w-0 rounded-[2rem] border border-line bg-rocha p-5 sm:p-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h3 class="display text-[1.75rem] leading-none">{{ text.rule }}</h3>
        <span class="rounded-full bg-fg px-3 py-1 font-mono text-[0.75rem] text-furo">
          {{ changed.length }}
        </span>
      </div>
      <p class="mt-2 max-w-3xl text-[0.875rem] text-muted">
        {{ changed.length ? text.ruleLede : text.ruleNone }}
      </p>
      <ul v-if="changed.length" class="mt-4 grid gap-2 lg:grid-cols-2">
        <li v-for="row in changed" :key="row.uid">
          <NuxtLink
            :to="`/selecao-matriz/${row.uid}`"
            target="_blank"
            class="flex items-center gap-3 rounded-2xl border border-line bg-furo/40 px-4 py-3 transition-colors hover:border-red">
            <span class="min-w-0 flex-1">
              <span class="block truncate text-[0.875rem] font-semibold">
                {{ row.rocha }} <span class="font-normal text-muted">· {{ row.diametro }}</span>
              </span>
              <span class="block truncate text-[0.75rem] text-muted">
                {{ row.cliente
                }}<template v-if="row.cidade"> · {{ row.cidade }}/{{ row.uf }}</template>
              </span>
            </span>
            <span class="shrink-0 text-right">
              <span class="block font-mono text-[0.9375rem] tabular-nums">
                {{ row.matriz }} <span class="text-faint">→</span>
                <b class="text-red">{{ row.novaRegra }}</b>
              </span>
              <span class="block text-[0.6875rem] text-faint">{{ text.ruleWould }}</span>
            </span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
