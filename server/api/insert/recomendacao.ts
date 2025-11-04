import { v4 } from 'uuid'

export default defineEventHandler(async event => {
  await requireUserSession(event, { statusCode: 401, message: 'Você não tem pemissão para executar essa ação' })

  const body = await readValidatedBody(event, RecomendacaoSchema.safeParse)
  if(!body.success) throw createError({ status: 400, message: body.error.issues[0]?.message || '' })

  const { abrasividade, granulometria, diametro, formacao, mohs, rocha, email } = body.data

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

  type DiaKey = 'bq' | 'hq' | 'nq' | 'nq2' | 'pq'
  const diametros: Record<DiaKey, { rpm: [number, number], wob: [number, number], flow: [number, number], waterway: string }> = {
    bq: { rpm: [850, 1550], wob: [13, 24], flow: [8, 21], waterway: 'Standard/Hydra' },
    nq: { rpm: [620, 1200], wob: [20, 38], flow: [13, 34], waterway: 'Standard/Hydra' },
    nq2: { rpm: [620, 1200], wob: [20, 38], flow: [13, 34], waterway: 'Standard/Hydra' },
    hq: { rpm: [420, 880], wob: [29, 58], flow: [19, 53], waterway: 'Hydra/Face Discharge' },
    pq: { rpm: [300, 580], wob: [44, 84], flow: [28, 76], waterway: 'Face Discharge/Wide' },
  }

  function opNumbers(size: DiaKey, m: number, abra: 'high' | 'low' | 'medium', grain: 'fino' | 'grosso' | 'médio', form: 'compacta' | 'fracturada' | 'moderada'){
    const p = diametros[size] ?? diametros.nq
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

  function targetRPM(size: DiaKey, m: number, a: 'high' | 'low' | 'medium', f: 'compacta' | 'fracturada' | 'moderada', g: 'fino' | 'grosso' | 'médio'){
    const p = diametros[size] ?? diametros.nq
    const [min, max] = p.rpm
    let pos = 0.55
    const hard = Math.max(0, Math.min(1, (m - 5) / 3.5))
    pos -= 0.15 * hard
    if(f === 'compacta') pos += 0.1
    if(f === 'fracturada') pos -= 0.1
    if(a === 'high') pos -= 0.05
    if(g === 'grosso') pos -= 0.03
    if(a === 'low' && f === 'compacta') pos += 0.05
    pos = Math.max(0.05, Math.min(0.95, pos))
    return Math.round(min + pos * (max - min))
  }
  function rpmNarrow(size: DiaKey, target: number): [number, number]{
    const p = diametros[size] ?? diametros.nq
    const span = p.rpm[1] - p.rpm[0]
    const half = Math.max(40, Math.round(span * 0.1))
    let lo = Math.max(p.rpm[0], target - half)
    let hi = Math.min(p.rpm[1], target + half)
    const minWidth = Math.max(80, Math.round(span * 0.08))
    if(hi - lo < minWidth){
      const need = minWidth - (hi - lo)
      lo = Math.max(p.rpm[0], lo - Math.ceil(need / 2))
      hi = Math.min(p.rpm[1], hi + Math.floor(need / 2))
    }
    return [lo, hi]
  }

  const abra = mapAbra(abrasividade)
  const form = mapForm(formacao)
  const grain = mapGrain(granulometria)
  const size = (String(diametro).toLowerCase() as DiaKey) in diametros ? (String(diametro).toLowerCase() as DiaKey) : 'nq'

  const matriz = String(approxMatrix(mohs, abra, form))
  const ds = decideSeries(mohs, abra, form)
  const ep = seriesEpiroc(mohs, abra, form)
  const bo = seriesBoart(mohs, abra, form)
  const di = seriesDicorp(mohs, abra, form)
  const ops = opNumbers(size, mohs, abra, grain, form)
  const rpmTarget = targetRPM(size, mohs, abra, form, grain)
  const rpmWindow = rpmNarrow(size, rpmTarget)

  const recomendacao: RecomendacaoMongo = {
    uid: v4(),
    rocha: rocha || '',
    serie: ds.serie,
    matriz,
    diCorpo: di.serie,
    fordiaEpiroc: ep.alt ? `${ep.serie} · Alternativa: ${ep.alt}` : ep.serie,
    boartLongyear: bo.serie,
    rpm: `${rpmWindow[0]}–${rpmWindow[1]}`,
    wob: `${ops.wobRange[0]}–${ops.wobRange[1]}`,
    fluxoAgua: `${ops.flowRange[0]}–${ops.flowRange[1]}`,
    canal: ops.waterway,
    abrasividade,
    granulometria,
    diametro,
    formacao,
    mohs,
    email: email || '',
  }

  await new Recomenacoes(recomendacao).save()

  return recomendacao
})

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
  const mat = approxMatrix(m, abra, form)
  let serie = ''
  let alt = ''
  if(mat <= 3) serie = '2-4'
  else if(mat <= 5) serie = '4-6'
  else if(mat <= 7) serie = '6-9'
  else if(mat <= 8.5) serie = '9-11'
  else serie = '12-14'

  if(abra === 'high'){
    if(serie === '4-6') alt = '7 ABR'
    if(serie === '6-9') alt = '9 ABR'
  }
  return { serie, alt }
}

function seriesEpiroc(m: number, a: 'high' | 'low' | 'medium', f: 'compacta' | 'fracturada' | 'moderada'){
  let hero = ''
  let alt = ''
  if(m < 4){
    hero = 'HERO 3–5'
  }
  else if(m < 5.5){
    hero = (f === 'compacta') ? (a === 'high' ? 'HERO Abrasive 7' : 'HERO 7') : (a === 'high' ? 'HERO Abrasive 5–7' : 'HERO 5–7')
  }
  else if(m <= 7){
    hero = (f === 'compacta') ? (a === 'high' ? 'HERO 8 Abrasive' : 'HERO 8') : (a === 'high' ? 'HERO Abrasive 7' : 'HERO 7')
  }
  else {
    hero = (f === 'compacta') ? 'HERO 11–13' : 'HERO 9–11'
    if(a === 'high' && f !== 'fracturada') alt = 'HERO Abrasive 11'
  }
  return { serie: hero, alt }
}

function seriesBoart(m: number, a: 'high' | 'low' | 'medium', f: 'compacta' | 'fracturada' | 'moderada'){
  let s = ''
  if(m < 4) s = 'UMX 5'
  else if(m < 5.5) s = (f === 'compacta') ? 'UMX 7' : 'UMX 5'
  else if(m <= 7) s = (f === 'compacta') ? (a === 'high' ? 'UMX 9 Abrasive' : 'UMX 9') : 'UMX 7'
  else s = (f === 'compacta') ? 'UMX 10–12' : 'UMX 9'
  return { serie: s }
}

function seriesDicorp(m: number, a: 'high' | 'low' | 'medium', f: 'compacta' | 'fracturada' | 'moderada'){
  let s = ''
  if(m < 4) s = '2A/5'
  else if(m < 5.5) s = (f === 'compacta') ? '6/7' : '2A/5'
  else if(m <= 7) s = (f === 'compacta') ? (a === 'high' ? '9 (Abrasive)' : '7E/8/9') : '6/7'
  else s = (f === 'compacta') ? '10/11–12/13' : '7E/8/9'
  return { serie: s }
}
