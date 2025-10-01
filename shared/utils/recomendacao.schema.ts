import { z } from 'zod'

export const RecomendacaoSchema = z.object({
  email: z.email('Digite um email válido'),
  rocha: z.string().optional(),
  mohs: z.number().min(1, 'Selecione a dureza Mohs'),
  abrasividade: z.string().min(1, 'Selecione a abrasividade'),
  granulometria: z.string().min(1, 'Selecione a granulometria'),
  diametro: z.string().min(1, 'Selecione o diâmetro'),
  formacao: z.string().min(1, 'Selecione a formação'),
})

export type RecomendacaoForm = z.infer<typeof RecomendacaoSchema>

export const RecomendacaoMongoSchema = z.object({
  uid: z.string(),
  email: z.string(),
  rocha: z.string().optional(),
  mohs: z.number(),
  abrasividade: z.string(),
  granulometria: z.string(),
  diametro: z.string(),
  formacao: z.string(),
  serie: z.string(),
  matriz: z.string(),
  diCorpo: z.string(),
  fordiaEpiroc: z.string(),
  boartLongyear: z.string(),
  rpm: z.string(),
  wob: z.string(),
  fluxoAgua: z.string(),
  canal: z.string(),
  diagnostico: z.array(z.object({
    sintoma: z.string(),
    causa: z.string(),
    acao: z.string(),
    ajuste: z.string(),
  })),
  boasPraticas: z.array(z.object({
    parametro: z.string(),
    regraBolso: z.string(),
    comoAjustar: z.string(),
    obs: z.string(),
  })),
})

export type RecomendacaoMongo = z.infer<typeof RecomendacaoMongoSchema>
