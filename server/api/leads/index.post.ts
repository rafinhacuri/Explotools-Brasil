import { useLeadSchema } from '~~/app/composables/useLeadSchema'

const { leadSchema } = useLeadSchema()

export default defineEventHandler(async (event) => {
  const lead = await validBody(event, leadSchema)
  await connectDb()

  const telefone = formatPhone(lead.telefone)
  const existing = await Leads.findOne({ $or: [{ email: lead.email }, { telefone }] })
    .lean()
    .catch(() => failed('Não foi possível ler os cadastros'))

  if (existing?.email === lead.email) {
    throw createError({ status: 409, message: 'E-mail já cadastrado' })
  }
  if (existing) throw createError({ status: 409, message: 'Telefone já cadastrado' })

  await new Leads({ ...lead, telefone, createdAt: new Date().toISOString() })
    .save()
    .catch(() => failed('Não foi possível salvar o cadastro'))

  return 'Cadastro realizado com sucesso'
})
