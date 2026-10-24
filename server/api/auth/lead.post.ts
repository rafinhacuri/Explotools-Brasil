const { leadAccessSchema } = useLeadSchema()

export default defineEventHandler(async (event) => {
  const { email } = await validBody(event, leadAccessSchema)
  await connectDb()

  const lead = await Leads.findOneAndUpdate(
    { email },
    { lastAccess: new Date().toISOString() },
  ).catch(() => failed('Não foi possível ler os cadastros'))
  if (!lead) throw createError({ status: 404, message: 'Este e-mail ainda não está cadastrado' })

  const session = await getUserSession(event)
  if (session.user?.level !== 'admin') {
    await setUserSession(event, { user: { email, level: 'user' } })
  }
  return { nome: lead.nome }
})
