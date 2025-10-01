import { z } from 'zod'

export const UserSchema = z.object({
  user: z.string().trim().min(1, { message: 'Selecione a email' }),
  senha: z.string().trim().min(1, { message: 'Selecione a senha' }),
})

export type User = z.infer<typeof UserSchema>

export const UserRecSchema = z.object({
  email: z.string().trim().min(1, { message: 'Selecione a email' }),
})

export type UserRec = z.infer<typeof UserRecSchema>
