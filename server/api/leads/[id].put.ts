import { useLeadSchema } from '~~/app/composables/useLeadSchema'

const { leadUpdateSchema } = useLeadSchema()

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const _id = objectId(event)
  const changes = await validBody(event, leadUpdateSchema)

  const lead = await Leads.findById(_id).catch(() => failed('Não foi possível ler o cadastro'))
  if (!lead) throw createError({ status: 404, message: 'Cadastro não encontrado' })

  const previous = lead.email
  if (
    changes.email &&
    changes.email !== previous &&
    (await Leads.exists({ email: changes.email }))
  ) {
    throw createError({ status: 409, message: 'E-mail já cadastrado' })
  }
  if (changes.telefone) changes.telefone = formatPhone(changes.telefone)
  lead.set(changes)
  await lead.save().catch(() => failed('Não foi possível salvar o cadastro'))

  if (changes.email && changes.email !== previous) {
    await Recomendacoes.updateMany({ email: previous }, { email: changes.email })
  }

  return 'Cadastro atualizado'
})
