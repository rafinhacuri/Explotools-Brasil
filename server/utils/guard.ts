import type { H3Event } from 'h3'
import { isValidObjectId } from 'mongoose'
import { safeParse } from 'valibot'
import type { GenericSchema, InferOutput } from 'valibot'

const DENIED = 'Você não tem permissão para executar essa ação'

export async function requireAdmin(event: H3Event): Promise<{ email: string }> {
  const { user } = await requireUserSession(event, { statusCode: 401, message: DENIED })
  if (user.level !== 'admin') throw createError({ status: 403, message: DENIED })
  await connectDb()
  return { email: user.email }
}

export async function requireLead(event: H3Event): Promise<{ email: string }> {
  const { user } = await requireUserSession(event, {
    statusCode: 401,
    message: 'Informe seu e-mail para continuar',
  })
  await connectDb()
  return { email: user.email }
}

export async function validBody<T extends GenericSchema>(
  event: H3Event,
  schema: T,
): Promise<InferOutput<T>> {
  const result = safeParse(schema, await readBody(event))
  if (!result.success) {
    throw createError({ status: 400, message: result.issues[0].message })
  }
  return result.output
}

export function objectId(event: H3Event): string {
  const id = getRouterParam(event, 'id') ?? ''
  if (!isValidObjectId(id)) throw createError({ status: 400, message: 'Identificador inválido' })
  return id
}

export function failed(message: string): never {
  throw createError({ status: 500, message })
}
