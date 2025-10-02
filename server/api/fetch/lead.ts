export default defineEventHandler(async event => {
  const { user } = await requireUserSession(event, { statusCode: 401, message: 'Você não tem pemissão para executar essa ação' })

  if(user.level !== 'admin') throw createError({ statusCode: 401, message: 'Você não tem pemissão para executar essa ação' })

  const lead = await Leads.find().lean()
    .catch(() => { throw createError({ status: 500, message: 'Não foi possivel ler as configurações do banco de dados' }) })

  const recomendacoes = await Recomenacoes.find().lean()
    .catch(() => { throw createError({ statusCode: 500, message: 'Não foi possivel ler as configurações do banco de dados' }) })

  const leadsMap = lead.map(l => {
    const recs = recomendacoes.filter(r => r.email === l.email)

    const recReturn: { date: string, link: string }[] = recs.map(r => ({
      date: r._id.getTimestamp().toString(),
      link: `/selecao-matriz/${r.uid}`,
    }))

    return { ...l, recomendacoes: recReturn }
  })

  return leadsMap.toSorted((a, b) => a.nome.localeCompare(b.nome))
})
