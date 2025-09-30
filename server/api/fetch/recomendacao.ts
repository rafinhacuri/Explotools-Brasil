export default defineEventHandler(async event => {
  const body = await readValidatedBody(event, IdSchema.safeParse)

  if(!body.success) throw createError({ status: 401, message: body.error.issues[0]?.message || '' })

  const { _id } = body.data

  const recomendacao = await Recomenacoes.findOne({ uid: _id }).lean()
    .catch(() => { throw createError({ status: 500, message: 'Não foi possivel ler a recomendação do banco de dados' }) })

  if(!recomendacao) throw createError({ status: 404, message: 'Recomendação não encontrada' })

  return recomendacao
})
