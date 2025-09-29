import { z } from 'zod'

export const recomendacaoSchema = z.object({
  rocha: z.string().optional(),
  mohs: z.number().min(1, 'Selecione a dureza Mohs'),
  abrasividade: z.string().min(1, 'Selecione a abrasividade'),
  granulometria: z.string().min(1, 'Selecione a granulometria'),
  diametro: z.string().min(1, 'Selecione o diâmetro'),
  formacao: z.string().min(1, 'Selecione a formação'),
})

export type RecomendacaoForm = z.infer<typeof recomendacaoSchema>
