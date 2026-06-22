/* ===========================================================================
   MOTOR DE SELEÇÃO DE MATRIZ
   Dois eixos (dureza/competência + abrasividade) + modificadores (estrutura,
   objetivo), conforme metodologia consolidada de fabricantes.
   Matriz 1–9: nº baixo = liga DURA (rocha mole/abrasiva); nº alto = liga MACIA
   (rocha dura/competente/não-abrasiva).
   =========================================================================== */
import type { Abra } from './rochas'

export type Form = 'compacta' | 'fracturada' | 'moderada'
export type Grain = 'fino' | 'grosso' | 'médio'
export type Obj = 'penetracao' | 'equilibrio' | 'vida'
export type DiaKey = 'BQ' | 'NQ' | 'NQ2' | 'HQ' | 'PQ'

export interface DiagRow { sintoma: string, causa: string, acao: string, ajuste: string }
export interface BoaPraticaRow { parametro: string, regra: string, ajuste: string, obs: string }

/* ===== Mapeamento dos rótulos (PT) para chaves internas ===== */
export function mapAbra(a: string): Abra {
  const key = (a || '').trim().toLowerCase()
  if(key.startsWith('bai')) return 'low'
  if(key.startsWith('alt')) return 'high'
  return 'medium'
}
export function mapForm(f: string): Form {
  const key = (f || '').trim().toLowerCase()
  if(key.startsWith('fri') || key.startsWith('frac')) return 'fracturada'
  if(key.startsWith('comp') || key.startsWith('sól') || key.startsWith('sol')) return 'compacta'
  return 'moderada'
}
export function mapGrain(g: string): Grain {
  const key = (g || '').trim().toLowerCase()
  if(key.startsWith('fin')) return 'fino'
  if(key.startsWith('gro')) return 'grosso'
  return 'médio'
}
export function mapObj(o: string): Obj {
  const key = (o || '').trim().toLowerCase()
  if(key.startsWith('pen')) return 'penetracao'
  if(key.startsWith('vid')) return 'vida'
  return 'equilibrio'
}
export function mapSize(d: string): DiaKey {
  const key = (d || '').trim().toUpperCase()
  return (key in DIAMETERS ? key : 'NQ') as DiaKey
}

/* ===== Rótulos legíveis ===== */
export function ptAbra(a: Abra): string { return a === 'low' ? 'baixa' : (a === 'medium' ? 'média' : 'alta') }
export function ptForm(f: Form): string { return f === 'fracturada' ? 'friável/fraturada' : (f === 'moderada' ? 'moderada' : 'compacta') }
export function ptObj(o: Obj): string { return o === 'penetracao' ? 'penetração' : (o === 'vida' ? 'vida útil' : 'equilíbrio') }

/* ===== Matriz 1–9 ===== */
export function baseMatrix(mohs: number): number {
  if(mohs < 3.5) return 2
  if(mohs < 5) return 4
  if(mohs < 6.5) return 6
  if(mohs < 7.5) return 7
  return 8
}
export function computeMatrix(mohs: number, abra: Abra, form: Form): number {
  let m = baseMatrix(mohs)
  if(abra === 'high') m -= 1 // abrasivo -> liga mais dura
  if(form === 'fracturada') m -= 1 // quebrado/friável -> liga mais dura
  if(form === 'compacta') m += 1 // compacto/competente -> liga mais macia
  if(m < 1) m = 1
  if(m > 9) m = 9
  return m
}
export function matrixWord(m: number): string { return m <= 3 ? 'liga dura' : (m <= 6 ? 'liga média' : 'liga macia') }

/* ===== Série de referência ===== */
export function decideSeries(mohs: number, abra: Abra, form: Form): { serie: string, alt: string } {
  let serie = ''
  let alt = ''
  if(mohs < 4){
    serie = (form === 'fracturada') ? '2-4' : '4-6'
    if(abra === 'high') alt = '7 ABR'
  }
  else if(mohs < 5.5){
    if(form === 'fracturada') serie = '4-6'
    else if(form === 'moderada') serie = (abra === 'high') ? '7 ABR' : '4-6'
    else serie = (abra === 'high') ? '7 ABR' : '6-9'
  }
  else if(mohs <= 7){
    serie = (form === 'compacta') ? '6-9' : '4-6'
    if(abra === 'high') alt = '9 ABR'
  }
  else {
    serie = (form === 'compacta') ? ((mohs > 7.5) ? '12-14' : '9-11') : '6-9'
    if(abra === 'high' && form !== 'fracturada') alt = '11-14 (ABR)'
  }
  return { serie, alt }
}

/* ===== Cross-reference de marcas (ancorado na escala Mohs) =====
   Não há tabela pública 1:1 entre marcas; o eixo comum publicado por todas é a
   escala Mohs. Alinhamos os grades pela faixa de Mohs que cada um cobre.
   Fontes: Boart Longyear (cores Longyear + UMX), Fordia/Epiroc (HERO),
   Di-Corp (CoreMatrix), Dimatec (séries S/XT) e Hayden (escala 1–16). */
interface XRefRow { max: number, bl: string, hero: string, dicorp: string, dimatec: string, hayden: string }
const XREF: XRefRow[] = [
  { max: 4.5, bl: 'Roxo · 07UMX', hero: 'HERO 3', dicorp: '2A–5', dimatec: 'S3–S6', hayden: '2–4' },
  { max: 6.0, bl: 'Verde · 07UMX', hero: 'HERO 5 / 7', dicorp: '5–7', dimatec: 'S6–XT8', hayden: '4–7' },
  { max: 7.0, bl: 'Verde–Amarelo · 09UMX', hero: 'HERO 8 / 9', dicorp: '7–9', dimatec: 'XT8–XT10', hayden: '7–10' },
  { max: 7.5, bl: 'Amarelo · 09UMX', hero: 'HERO 9 / 11', dicorp: '9–11', dimatec: 'XT10–XT13', hayden: '10–13' },
  { max: 10, bl: 'Vermelho · 10UMX', hero: 'HERO 13', dicorp: '11–13F', dimatec: 'XT13–XT15', hayden: '13–16' },
]
export interface Equivalents { bl: string, hero: string, dicorp: string, dimatec: string, hayden: string, abr: string }
export function equivalents(mohs: number, abra: Abra): Equivalents {
  let row = XREF[XREF.length - 1]!
  for(const r of XREF){ if(mohs < r.max){ row = r; break } }
  const abr = (abra === 'high')
    ? 'Variante abrasiva recomendada: HERO Abrasive · Di-Corp “A” · BL Abrasive · Dimatec série ABR'
    : ''
  return { bl: row.bl, hero: row.hero, dicorp: row.dicorp, dimatec: row.dimatec, hayden: row.hayden, abr }
}

/* ===== Geometria da coroa ===== */
export interface CrownProfile { openness: string, waterway: string, crown: string }
export function crownProfile(mohs: number, abra: Abra, form: Form, obj: Obj): CrownProfile {
  let openness: string
  if(form === 'fracturada' || mohs < 5 || obj === 'penetracao') openness = 'alta (~30%)'
  else if(form === 'compacta' && mohs >= 6.5 && obj === 'vida') openness = 'baixa (~15%)'
  else openness = 'média (~20–25%)'

  let waterway: string
  if(abra === 'high' || openness.indexOf('alta') > -1) waterway = 'Face Discharge / Hydra (limpeza alta)'
  else if(openness.indexOf('baixa') > -1) waterway = 'Standard (vida longa)'
  else waterway = 'Hydra / Tapered (equilíbrio)'

  const crown = (abra === 'high') ? 'Coroa alta (extra height) p/ vida em abrasivo' : 'Coroa padrão'
  return { openness, waterway, crown }
}

/* ===== Parâmetros por diâmetro =====
   RPM / WOB (kN) / fluxo de água (L/min) consolidados de referências de
   fabricantes (Boart Longyear, Dimatec) para bits impregnados. */
export const DIAMETERS: Record<DiaKey, { rpm: [number, number], wob: [number, number], flow: [number, number], waterway: string }> = {
  BQ: { rpm: [800, 1600], wob: [10, 24], flow: [20, 35], waterway: 'Standard/Hydra' },
  NQ: { rpm: [600, 1250], wob: [13, 37], flow: [35, 50], waterway: 'Standard/Hydra' },
  NQ2: { rpm: [600, 1250], wob: [13, 37], flow: [35, 50], waterway: 'Standard/Hydra' },
  HQ: { rpm: [400, 1000], wob: [20, 56], flow: [50, 70], waterway: 'Hydra/Face Discharge' },
  PQ: { rpm: [300, 800], wob: [31, 84], flow: [80, 100], waterway: 'Face Discharge/Wide' },
}
export interface OpNumbers { rpmRange: [number, number], wobRange: [number, number], flowRange: [number, number], waterway: string }
export function opNumbers(size: DiaKey, abra: Abra, grain: Grain, form: Form): OpNumbers {
  const p = DIAMETERS[size] ?? DIAMETERS.NQ
  const rpm: [number, number] = [p.rpm[0], p.rpm[1]]
  const wob: [number, number] = [p.wob[0], p.wob[1]]
  const flow: [number, number] = [p.flow[0], p.flow[1]]
  const water = p.waterway

  if(abra === 'high'){ rpm[1] = Math.round(rpm[1] * 0.9); flow[0] += 3; flow[1] += 3 }
  if(form === 'fracturada'){ rpm[0] = Math.round(rpm[0] * 0.6); rpm[1] = Math.round(rpm[1] * 0.7); wob[0] = Math.max(0, wob[0] - 3); flow[0] = Math.max(0, flow[0] - 2) }
  if(grain === 'grosso'){ flow[0] += 5; flow[1] += 5 }
  if(rpm[1] < rpm[0]) rpm[1] = rpm[0] + 100

  return {
    rpmRange: [Math.round(rpm[0]), Math.round(rpm[1])],
    wobRange: [Math.round(wob[0]), Math.round(wob[1])],
    flowRange: [Math.round(flow[0]), Math.round(flow[1])],
    waterway: water,
  }
}

/* ===== Tabelas: Diagnóstico & Solução / Parâmetros & Boas práticas ===== */
export function buildDiagnostico(abra: Abra, form: Form, ops: OpNumbers): DiagRow[] {
  const rows: DiagRow[] = [
    { sintoma: 'Glazing (face lisa, sem corte)', causa: 'Matriz muito dura p/ a rocha; RPM alta + WOB baixo', acao: 'Aumente WOB 30–60 s; faça "dress" curto; reduza RPM 10–15%', ajuste: 'Matriz +1 (mais macia); em abrasiva, série ABR' },
    { sintoma: 'Vibração / chatter', causa: 'Ressonância; estabilização/reaming shell deficiente', acao: 'Reduza RPM 10–15%; leve incremento de WOB; cheque alinhamento', ajuste: 'Operar no terço inferior do intervalo de RPM' },
  ]
  if(form === 'fracturada') rows.push({ sintoma: 'Perda de face / quebra de diamante', causa: 'Impactos em fraturas; avanço longo no arranque', acao: 'Cortes curtos; RPM/WOB menores no início; limpeza frequente', ajuste: 'Série mais ampla (4–6); matriz um passo mais macia se preciso' })
  rows.push({ sintoma: 'Lavagem de núcleo (core wash)', causa: 'Fluxo insuficiente; WOB alto com RPM alta', acao: 'Aumente vazão; reduza RPM temporariamente; bombeios de limpeza', ajuste: `Manter ${ops.flowRange[0]}–${ops.flowRange[1]} L/min; Face Discharge` })
  rows.push({ sintoma: 'Coroa empastada (packing)', causa: 'Finos acumulados; fluido viscoso/baixo fluxo', acao: 'Pare o avanço, bombeie/limpe, retome com mais fluxo', ajuste: 'Face Discharge/Wide; reduza viscosidade' })
  if(abra === 'high') rows.push({ sintoma: 'Desgaste acelerado', causa: 'Quartzo/hematita elevados; água insuficiente', acao: 'Evite topo do intervalo de RPM; maximize limpeza de face', ajuste: 'Variantes ABR; coroa alta; água limpa em alto volume' })
  return rows
}
export function buildBoasPraticas(size: DiaKey, abra: Abra, form: Form, ops: OpNumbers): BoaPraticaRow[] {
  return [
    { parametro: 'RPM', regra: `Começar no meio do intervalo (${ops.rpmRange[0]}–${ops.rpmRange[1]}) para ${size}`, ajuste: 'Subir até cavacos uniformes; reduzir 10–15% se houver vibração/polimento', obs: (form === 'fracturada' ? 'Em quebrado, ~metade do intervalo. ' : '') + 'Em abrasiva, evite o topo por longos períodos.' },
    { parametro: 'WOB (kN)', regra: `Iniciar próximo de ${ops.wobRange[0]} kN e subir gradualmente`, ajuste: 'Parar quando a taxa de penetração estabilizar sem travar o núcleo', obs: 'Excesso arredonda diamantes e induz aquecimento/vibração.' },
    { parametro: 'Fluxo (L/min)', regra: `Manter entre ${ops.flowRange[0]}–${ops.flowRange[1]} L/min`, ajuste: 'Aumentar se cavacos secos/finos; reduzir se houver erosão de face', obs: (abra === 'high' ? 'Em abrasiva, água limpa em alto volume. ' : '') + 'Checar sólidos/filtragem.' },
    { parametro: 'Canal de água', regra: ops.waterway, ajuste: 'Usar Hydra/Face em alta carga de finos ou aquecimento de face', obs: `Garantir pressão/caudal compatíveis com o diâmetro ${size}.` },
    { parametro: 'Quebra de aresta', regra: '2–3 min a ~50% RPM e ~50% WOB em coroa nova', ajuste: 'Subir gradualmente observando cavacos regulares', obs: 'Crítico para vida útil e início estável.' },
  ]
}
