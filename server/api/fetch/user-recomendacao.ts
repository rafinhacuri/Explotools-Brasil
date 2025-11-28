export default defineEventHandler(async event => {
  const body = await readValidatedBody(event, IdSchema.safeParse)

  if(!body.success) throw createError({ status: 401, message: body.error.issues[0]?.message || '' })

  const { _id: email } = body.data

  const recomendacao = await Recomenacoes.find({ email }).lean()
    .catch(() => { throw createError({ status: 500, message: 'Não foi possivel ler a recomendação do banco de dados' }) })

  if(!recomendacao.length) return []

  const links = recomendacao.toReversed().map(rec => ({ link: `/selecao-matriz/${rec.uid}`, label: rec.createdAt || '' }))

  if(links.length > 6){
    return links.slice(0, 6)
  }

  return links
})
