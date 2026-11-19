const STATUS: readonly StatusCoroa[] = ['aguardando', 'atendeu', 'ajustada']

// Painel de coroas: uma linha por recomendação, com cliente, rocha, série, versão, canal e local.
// A tela agrupa como quiser (mapa, abrasividade, série, cliente). Só administradores.
export default defineEventHandler(async (event): Promise<PainelRow[]> => {
  await requireAdmin(event)

  const [recomendacoes, leads] = await Promise.all([
    Recomendacoes.find({ versao: 2 })
      .select('uid email rocha matriz diametro entrada resultado status local createdAt')
      .sort({ _id: -1 })
      .lean(),
    Leads.find().select('email nome empresa').lean(),
  ]).catch(() => failed('Não foi possível ler as recomendações'))

  const clientes = new Map(leads.map((lead) => [lead.email, lead]))

  return recomendacoes.map((rec) => {
    const lead = clientes.get(rec.email)
    const matriz = rec.resultado?.matriz ?? rec.matriz ?? ''
    return {
      uid: rec.uid,
      email: rec.email,
      cliente: lead?.nome ?? rec.email,
      empresa: lead?.empresa ?? '',
      rocha: rec.rocha === undefined || rec.rocha === '' ? 'Rocha não listada' : rec.rocha,
      diametro: normSize(rec.diametro ?? ''),
      matriz,
      serie: matriz.replace(/A$/u, ''),
      abrasiva: rec.resultado?.abrasiva ?? matriz.endsWith('A'),
      abrasividade: rec.resultado?.abrasividade ?? 'medium',
      canal: rec.resultado?.canal ?? 'Standard',
      status: STATUS.find((item) => item === rec.status) ?? 'aguardando',
      uf: rec.local?.uf ?? null,
      cidade: rec.local?.cidade ?? null,
      createdAt: rec.createdAt ?? rec._id.getTimestamp().toISOString(),
      // Cotação feita na regra antiga: o que ela seria hoje. Só informa; a cotação do cliente não muda.
      novaRegra: rec.entrada ? (ruleChange(rec.entrada)?.para ?? null) : null,
    }
  })
})
