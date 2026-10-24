export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const _id = objectId(event)

  const lead = await Leads.findByIdAndDelete(_id).catch(() =>
    failed('Não foi possível excluir o cadastro'),
  )
  if (!lead) throw createError({ status: 404, message: 'Cadastro não encontrado' })

  await Recomendacoes.deleteMany({ email: lead.email }).catch(() =>
    failed('Não foi possível excluir as recomendações do cadastro'),
  )

  return 'Cadastro excluído'
})
