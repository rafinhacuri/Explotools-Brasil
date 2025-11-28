export default defineEventHandler(async event => {
  const { user } = await requireUserSession(event, { statusCode: 401, message: 'Você não tem pemissão para executar essa ação' })

  if(user.level !== 'admin') throw createError({ statusCode: 401, message: 'Você não tem pemissão para executar essa ação' })

  const body = await readValidatedBody(event, IdSchema.safeParse)

  if(!body.success) throw createError({ status: 401, message: body.error.issues[0]?.message || '' })

  const { _id } = body.data

  const lead = await Leads.findOne({ _id })
    .catch(() => { throw createError({ status: 500, message: 'Não foi possivel ler o lead do banco de dados' }) })

  if(!lead) throw createError({ status: 404, message: 'lead não encontrado' })

  await Leads.findByIdAndDelete(_id)
    .catch(() => { throw createError({ status: 500, message: 'Não foi possivel deletar a pagina do banco de dados' }) })

  const leadRecomendacoes = await Recomenacoes.find({ email: lead.email })
    .catch(() => { throw createError({ status: 500, message: 'Não foi possivel ler as recomendações do banco de dados' }) })

  await Promise.all(leadRecomendacoes.map(async recomendacao => {
    await Recomenacoes.findByIdAndDelete(recomendacao._id)
      .catch(() => { throw createError({ status: 500, message: 'Não foi possivel deletar a recomendação do banco de dados' }) })
  }))

  return 'lead excluido com susseso!'
})
