import { v4 } from 'uuid'

export default defineEventHandler(async event => {
  const body = await readValidatedBody(event, RecomendacaoSchema.safeParse)
  if(!body.success) throw createError({ status: 400, message: body.error.issues[0]?.message || '' })

  const { abrasividade, granulometria, diametro, formacao, mohs, rocha } = body.data

  const mapAbra = (a: string): 'high' | 'low' | 'medium' => {
    const key = a.trim().toLowerCase()
    if(key.startsWith('bai')) return 'low'
    if(key.startsWith('alt')) return 'high'
    return 'medium'
  }
  const mapForm = (f: string): 'compacta' | 'fracturada' | 'moderada' => {
    const key = f.trim().toLowerCase()
    if(key.startsWith('frac')) return 'fracturada'
    if(key.startsWith('sól') || key.startsWith('sol')) return 'compacta'
    return 'moderada'
  }
  const mapGrain = (g: string): 'fino' | 'grosso' | 'médio' => {
    const key = g.trim().toLowerCase()
    if(key.startsWith('fin')) return 'fino'
    if(key.startsWith('gro')) return 'grosso'
    return 'médio'
  }

  type DiaKey = 'BQ' | 'HQ' | 'NQ' | 'NQ2' | 'PQ'
  const DIAMETERS: Record<DiaKey, { rpm: [number, number], wob: [number, number], flow: [number, number], waterway: string }> = {
    BQ: { rpm: [650, 1600], wob: [13, 24], flow: [8, 21], waterway: 'Standard/Hydra' },
    NQ: { rpm: [500, 1250], wob: [20, 38], flow: [13, 34], waterway: 'Standard/Hydra' },
    NQ2: { rpm: [500, 1250], wob: [20, 38], flow: [13, 34], waterway: 'Standard/Hydra' },
    HQ: { rpm: [400, 1000], wob: [29, 58], flow: [19, 53], waterway: 'Hydra/Face Discharge' },
    PQ: { rpm: [300, 800], wob: [44, 84], flow: [28, 76], waterway: 'Face Discharge/Wide' },
  }

  function opNumbers(size: DiaKey, m: number, abra: 'high' | 'low' | 'medium', grain: 'fino' | 'grosso' | 'médio', form: 'compacta' | 'fracturada' | 'moderada'){
    const p = DIAMETERS[size] ?? DIAMETERS.NQ
    const rpm: [number, number] = [p.rpm[0], p.rpm[1]]
    const wob: [number, number] = [p.wob[0], p.wob[1]]
    const flow: [number, number] = [p.flow[0], p.flow[1]]
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
    if(rpm[1] <= rpm[0]) rpm[1] = rpm[0] + 100

    return {
      rpmRange: [Math.round(rpm[0]), Math.round(rpm[1])],
      wobRange: [Math.round(wob[0]), Math.round(wob[1])],
      flowRange: [Math.round(flow[0]), Math.round(flow[1])],
      waterway: water,
    }
  }

  const abra = mapAbra(abrasividade)
  const form = mapForm(formacao)
  const grain = mapGrain(granulometria)
  const size = (String(diametro).toUpperCase() as DiaKey) in DIAMETERS ? (String(diametro).toUpperCase() as DiaKey) : 'NQ'

  const matriz = String(approxMatrix(mohs, abra, form))
  const ds = decideSeries(mohs, abra, form)
  const eq = equivalents(ds.serie, abra)
  const ops = opNumbers(size, mohs, abra, grain, form)

  const diagnostico: { sintoma: string, causa: string, acao: string, ajuste: string }[] = []
  diagnostico.push({
    sintoma: 'Glazing (face lisa, sem corte)',
    causa: 'Matriz muito dura; RPM alta com WOB baixo; liberação insuficiente',
    acao: 'Aumente WOB por 30–60 s; faça "dress" curto',
    ajuste: 'Reduza RPM 10–15% ou use matriz +1 (mais macia)',
  }, {
    sintoma: 'Vibração / chatter',
    causa: 'Ressonância; estabilização deficiente (reaming shell/alinhamento)',
    acao: 'Reduzir RPM 10–15%; leve incremento de WOB; checar estabilizadores',
    ajuste: 'Operar no terço inferior do intervalo de RPM; preferir Hydra/Face',
  })
  if(form === 'fracturada'){
    diagnostico.push({
      sintoma: 'Perda de face / quebra de diamante',
      causa: 'Impactos por fraturas; avanço longo no arranque',
      acao: 'Cortes curtos; reduzir RPM/WOB no início; limpeza frequente',
      ajuste: 'Série mais ampla (4–6); se preciso, matriz um passo mais macia',
    })
  }
  diagnostico.push({
    sintoma: 'Lavagem de núcleo (core wash)',
    causa: 'Fluxo insuficiente; WOB alto com RPM alta',
    acao: 'Aumente vazão e reduza RPM temporariamente; bombeios de limpeza',
    ajuste: `Manter ${ops.flowRange[0]}–${ops.flowRange[1]} L/min; considerar Face Discharge`,
  }, {
    sintoma: 'Coroa empastada (packing)',
    causa: 'Finos acumulados por fluido viscoso/baixo fluxo; canais estreitos',
    acao: 'Parar avanço, bombear/limpar, retomar com maior fluxo',
    ajuste: 'Face Discharge/Wide; reduzir viscosidade ou usar defloculante',
  })
  if(abra === 'high'){
    diagnostico.push({
      sintoma: 'Desgaste acelerado',
      causa: 'Quartzo/hematita elevados; água insuficiente',
      acao: 'Evitar topo do intervalo de RPM; maximizar limpeza de face',
      ajuste: 'Variantes ABR; água limpa em alto volume; dress preventivo',
    })
  }

  const boasPraticas: { parametro: string, regraBolso: string, comoAjustar: string, obs: string }[] = []
  boasPraticas.push({
    parametro: 'RPM',
    regraBolso: `Começar no meio do intervalo (${ops.rpmRange[0]}–${ops.rpmRange[1]}) para ${size}`,
    comoAjustar: 'Subir até cavacos uniformes/temperatura estável; reduzir 10–15% se houver vibração/polimento',
    obs: `${form === 'fracturada' ? 'Em fracturada, use metade inferior do intervalo. ' : ''}Em abrasiva, evite topo por longos períodos.`,
  }, {
    parametro: 'WOB (kN)',
    regraBolso: `Iniciar próximo de ${ops.wobRange[0]} kN e subir gradualmente`,
    comoAjustar: 'Parar quando a taxa de penetração estabilizar sem travar o núcleo',
    obs: 'Excesso arredonda diamantes e induz aquecimento/vibração.',
  }, {
    parametro: 'Fluxo (L/min)',
    regraBolso: `Manter entre ${ops.flowRange[0]}–${ops.flowRange[1]} L/min`,
    comoAjustar: 'Aumentar se cavacos secos/finos; reduzir se houver erosão de face',
    obs: `${abra === 'high' ? 'Em abrasiva, some +2–5 L/min. ' : ''}Usar água limpa; checar sólidos/filtragem.`,
  }, {
    parametro: 'Canais de água',
    regraBolso: ops.waterway,
    comoAjustar: 'Usar Hydra/Face em alta carga de finos ou aquecimento de face',
    obs: `Garantir pressão/caudal compatíveis com o diâmetro ${size}.`,
  }, {
    parametro: 'Quebra de aresta',
    regraBolso: '2–3 min a ~50% RPM e ~50% WOB em coroa nova',
    comoAjustar: 'Subir gradualmente para regime observando cavacos regulares',
    obs: 'Crítico para vida útil e início estável; evite começar em plena carga.',
  }, {
    parametro: 'Fluido',
    regraBolso: 'Água limpa; viscosidade mínima para transporte de finos',
    comoAjustar: 'Reduzir viscosidade em rochas abrasivas; usar defloculantes quando necessário',
    obs: 'Evitar bentonita elevada com matrizes mais macias; monitorar retorno/temperatura.',
  })

  const recomendacao: RecomendacaoReturn = {
    uid: v4(),
    rocha: rocha || '',
    serie: ds.serie,
    matriz,
    diCorpo: eq.dicorp,
    fordiaEpiroc: eq.fordia,
    boartLongyear: eq.boart,
    rpm: `${ops.rpmRange[0]}–${ops.rpmRange[1]}`,
    wob: `${ops.wobRange[0]}–${ops.wobRange[1]}`,
    fluxoAgua: `${ops.flowRange[0]}–${ops.flowRange[1]}`,
    canal: ops.waterway,
    diagnostico,
    boasPraticas,
  }

  await new Recomenacoes({ ...recomendacao, abrasividade, granulometria, diametro, formacao, mohs }).save()

  return recomendacao
})

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
  if(abra === 'high' && !/ABR/i.test(serie))fordia += ' · (HERO Abrasive)'
  return { dicorp, fordia, boart }
}

function approxMatrix(m: number, abra: 'high' | 'low' | 'medium', form: 'compacta' | 'fracturada' | 'moderada'){
  let val = 0
  if(m < 3.5) val = 2
  else if(m < 5) val = 4
  else if(m < 6.5) val = 6
  else if(m < 7.5) val = 7
  else val = 8
  if(abra === 'high') val -= 1
  if(form === 'fracturada') val -= 1
  if(form === 'compacta') val += 1
  if(val < 1) val = 1
  if(val > 9) val = 9
  return val
}

function decideSeries(m: number, abra: 'high' | 'low' | 'medium', form: 'compacta' | 'fracturada' | 'moderada'){
  let serie = ''
  let alt = ''
  if(m < 4){
    serie = (form === 'fracturada') ? '2-4' : '4-6'
    if(abra === 'high') alt = '7 ABR'
  }
  else if(m < 5.5){
    if(form === 'fracturada') serie = '4-6'
    else if(form === 'moderada') serie = (abra === 'high') ? '7 ABR' : '4-6'
    else serie = (abra === 'high') ? '7 ABR' : '6-9'
  }
  else if(m <= 7){
    serie = (form === 'compacta') ? '6-9' : '4-6'
    if(abra === 'high') alt = '9 ABR'
  }
  else {
    serie = (form === 'compacta') ? ((m > 7.5) ? '12-14' : '9-11') : '6-9'
    if(abra === 'high' && form !== 'fracturada') alt = '11-14 (ABR)'
  }
  return { serie, alt }
}
