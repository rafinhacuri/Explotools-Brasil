import { z } from 'zod'

export const LeadSchema = z.object({
  nome: z.string().trim().min(1, { message: 'Selecione a nome' }),
  email: z.string().trim().min(1, { message: 'Selecione a email' }),
  telefone: z.string().trim().min(1, { message: 'Selecione a telefone' }),
  empresa: z.string().trim().min(1, { message: 'Selecione a empresa' }),
  cargo: z.string().trim().min(1, { message: 'Selecione a cargo' }),
})

export type Lead = z.infer<typeof LeadSchema>
