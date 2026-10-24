export default defineEventHandler(async (event): Promise<RecomendacaoResumo[]> => {
  const { email } = await requireLead(event)

  const recomendacoes = await Recomendacoes.find({ email })
    .select('uid rocha matriz createdAt')
    .sort({ _id: -1 })
    .limit(8)
    .lean()
    .catch(() => failed('Não foi possível ler as recomendações'))

  return recomendacoes.map((rec) => ({
    uid: rec.uid,
    rocha: rec.rocha ?? '',
    matriz: rec.matriz,
    createdAt: rec.createdAt ?? rec._id.getTimestamp().toISOString(),
  }))
})
