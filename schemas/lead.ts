import { z } from 'zod'

export const LeadSchema = z.object({
  nome: z.string().trim().min(1, { message: 'Selecione a nome' }),
  email: z.string().email({ message: 'Email invalido' }),
  telefone: z.string().trim().min(1, { message: 'Selecione a telefone' }),
  empresa: z.string().trim().min(1, { message: 'Selecione a empresa' }),
  cargo: z.string().trim().min(1, { message: 'Selecione a cargo' }),
})

export type Lead = z.infer<typeof LeadSchema>

export const EditLeadSchema = z.object({
  _id: z.string().trim().min(1, { message: 'Selecione o id' }),
  nome: z.string().optional(),
  email: z.string().optional(),
  telefone: z.string().optional(),
  empresa: z.string().optional(),
  cargo: z.string().optional(),

})

export type EditLead = z.infer<typeof EditLeadSchema>
