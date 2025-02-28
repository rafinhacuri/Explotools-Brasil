import { z } from 'zod'

export const UserSchema = z.object({
  user: z.string().trim().min(1, { message: 'Selecione a nome' }),
  senha: z.string().trim().min(1, { message: 'Selecione a email' }),
})

export type User = z.infer<typeof UserSchema>
