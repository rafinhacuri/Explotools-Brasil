import { z } from 'zod'

export const IdSchema = z.object({
  _id: z.string().trim().min(1, { message: 'Selecione o id' }),
})

export type Id = z.infer<typeof IdSchema>
