export default defineEventHandler(async (event): Promise<LeadRow[]> => {
  await requireAdmin(event)

  const [leads, recomendacoes] = await Promise.all([
    Leads.find().lean(),
    Recomendacoes.find().select('uid email rocha matriz diametro versao entrada createdAt').lean(),
  ]).catch(() => failed('Não foi possível ler os cadastros'))

  const byEmail = Map.groupBy(recomendacoes, (rec) => rec.email)

  return leads
    .map((lead) => ({
      _id: String(lead._id),
      nome: lead.nome,
      email: lead.email,
      telefone: lead.telefone,
      empresa: lead.empresa,
      cargo: lead.cargo,
      wireline: lead.wireline,
      createdAt: lead.createdAt ?? lead._id.getTimestamp().toISOString(),
      lastAccess: lead.lastAccess ?? '',
      recomendacoes: (byEmail.get(lead.email) ?? [])
        .map((rec) => ({
          uid: rec.uid,
          rocha: rec.rocha ?? '',
          matriz: rec.matriz ?? '',
          diametro:
            rec.versao === 2 && rec.diametro ? normSize(rec.diametro) : (rec.diametro ?? ''),
          // Cotação feita na regra antiga: o que ela seria hoje (só informa, não muda a cotação).
          novaRegra:
            rec.versao === 2 && rec.entrada ? (ruleChange(rec.entrada)?.para ?? null) : null,
          date: rec.createdAt ?? rec._id.getTimestamp().toISOString(),
        }))
        .toSorted((a, b) => b.date.localeCompare(a.date)),
    }))
    .toSorted((a, b) => b.createdAt.localeCompare(a.createdAt))
})
