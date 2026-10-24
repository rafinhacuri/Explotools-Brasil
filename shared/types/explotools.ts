import type { BoaPraticaRow, DiagRow } from '#shared/utils/matriz.engine'

export interface LeadRow {
  _id: string
  nome: string
  email: string
  telefone: string
  empresa: string
  cargo: string
  wireline?: boolean
  createdAt: string
  lastAccess: string
  recomendacoes: { uid: string; date: string; rocha: string }[]
}

export interface AdminRow {
  _id: string
  email: string
  createdAt: string
  self: boolean
}

export interface RecomendacaoMongo {
  uid: string
  email: string
  rocha?: string
  mohs: number
  eqc: number
  cai: number
  caiClasse: string
  ucs: string
  abrasividade: string
  granulometria: string
  diametro: string
  formacao: string
  objetivo: string
  matriz: string
  matrizPalavra: string
  abrVariante: string
  serie: string
  serieAlt: string
  areaAberta: string
  canalCoroa: string
  alturaCoroa: string
  diCorpo: string
  fordiaEpiroc: string
  boartLongyear: string
  dimatec: string
  hayden: string
  abrNota: string
  rpm: string
  wob: string
  fluxoAgua: string
  canal: string
  diagnostico: DiagRow[]
  boasPraticas: BoaPraticaRow[]
  createdAt?: string
}

export interface RecomendacaoResumo {
  uid: string
  rocha: string
  matriz: string
  createdAt: string
}
