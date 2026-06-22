import { z } from 'zod'

export const RecomendacaoSchema = z.object({
  email: z.email('Digite um email válido'),
  rocha: z.string().optional(),
  mohs: z.number().min(1, 'Selecione a dureza Mohs'),
  abrasividade: z.string().min(1, 'Selecione a abrasividade'),
  granulometria: z.string().min(1, 'Selecione a granulometria'),
  diametro: z.string().min(1, 'Selecione o diâmetro'),
  formacao: z.string().min(1, 'Selecione a formação'),
  objetivo: z.string().min(1, 'Selecione o objetivo'),
})

export type RecomendacaoForm = z.infer<typeof RecomendacaoSchema>

const DiagRowSchema = z.object({
  sintoma: z.string(),
  causa: z.string(),
  acao: z.string(),
  ajuste: z.string(),
})

const BoaPraticaRowSchema = z.object({
  parametro: z.string(),
  regra: z.string(),
  ajuste: z.string(),
  obs: z.string(),
})

export const RecomendacaoMongoSchema = z.object({
  uid: z.string(),
  email: z.string(),
  // entradas / propriedades da rocha
  rocha: z.string().optional(),
  mohs: z.number(),
  eqc: z.number(),
  cai: z.number(),
  caiClasse: z.string(),
  ucs: z.string(),
  abrasividade: z.string(),
  granulometria: z.string(),
  diametro: z.string(),
  formacao: z.string(),
  objetivo: z.string(),
  // perfil recomendado
  matriz: z.string(),
  matrizPalavra: z.string(),
  abrVariante: z.string(),
  serie: z.string(),
  serieAlt: z.string(),
  // geometria da coroa
  areaAberta: z.string(),
  canalCoroa: z.string(),
  alturaCoroa: z.string(),
  // marcas
  diCorpo: z.string(),
  fordiaEpiroc: z.string(),
  boartLongyear: z.string(),
  dimatec: z.string(),
  hayden: z.string(),
  abrNota: z.string(),
  // parâmetros operacionais
  rpm: z.string(),
  wob: z.string(),
  fluxoAgua: z.string(),
  canal: z.string(),
  // tabelas
  diagnostico: z.array(DiagRowSchema),
  boasPraticas: z.array(BoaPraticaRowSchema),
  createdAt: z.string().optional(),
})

export type RecomendacaoMongo = z.infer<typeof RecomendacaoMongoSchema>
