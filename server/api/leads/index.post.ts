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

  await avisar({
    evento: 'Novo cadastro',
    assunto: `Novo cadastro: ${lead.nome} · ${lead.empresa}`,
    titulo: `${lead.nome} se cadastrou`,
    resumo: `${lead.cargo} na ${lead.empresa}`,
    campos: [
      ['Nome', lead.nome],
      ['Empresa', lead.empresa],
      ['Cargo', lead.cargo],
      ['Telefone', telefone],
      ['E-mail', lead.email],
      ['Trabalha com wireline', simNao(lead.wireline)],
    ],
    botao: 'Abrir o painel',
    caminho: '/adm',
    whatsapp: whatsapp(telefone),
    responderPara: lead.email,
  })

  return 'Cadastro realizado com sucesso'
})
