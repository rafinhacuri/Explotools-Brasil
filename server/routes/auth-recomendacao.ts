export default defineEventHandler(async event => {
  const body = await readValidatedBody(event, UserRecSchema.safeParse)

  if(!body.success) throw createError({ status: 401, message: body.error.issues[0]?.message || '' })

  const { email } = body.data

  const usuario = await Leads.findOne({ email })
    .catch(() => { throw createError({ status: 500, message: 'Não foi possivel ler os usuarios do banco de dados' }) })

  if(!usuario) throw createError({ status: 401, message: 'Este email não está cadastrado' })

  await Leads.updateOne({ email }, { lastAccess: new Date().toISOString() })

  await setUserSession(event, { user: { email, level: 'user' } })

  return 'Autenticado com sucesso!'
})
