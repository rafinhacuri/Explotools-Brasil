const { recomendacaoSchema } = useRecomendacaoSchema()

export default defineEventHandler(async (event): Promise<RecomendacaoCoroa> => {
  const { email } = await requireLead(event)
  const { rocha, durezaManual, abrasividade, granulometria, diametro, testemunho, uf, municipio } =
    await validBody(event, recomendacaoSchema)

  const rock = findRock(rocha)
  if (rocha && !rock && durezaManual === undefined) {
    throw createError({
      status: 400,
      message: 'Rocha não encontrada. Escolha uma da lista ou defina a dureza manualmente',
    })
  }

  const local = findMunicipio(uf, municipio)
  if (!local) {
    throw createError({ status: 400, message: 'Escolha a cidade da sondagem na lista' })
  }

  const recomendacao = buildCoroa(
    email,
    {
      rock,
      size: diametro,
      cond: testemunho,
      manualH: durezaManual ?? null,
      abra: abrasividade ?? null,
      grain: granulometria ?? null,
    },
    local,
  )

  await new Recomendacoes(recomendacao)
    .save()
    .catch(() => failed('Não foi possível salvar a recomendação'))

  const quem = await cliente(email)
  const dados = dadosCoroa(recomendacao)
  await avisar({
    evento: 'Nova coroa',
    assunto: `Nova coroa: ${dados.rocha} ${dados.diametro} · Matriz ${recomendacao.matriz} · ${quem.empresa ?? quem.nome}`,
    titulo: `${quem.nome} gerou uma recomendação`,
    resumo: `${dados.rocha} em ${dados.diametro}${dados.cidade ? `, ${dados.cidade}` : ''}`,
    campos: [
      ['Nome', quem.nome],
      ['Empresa', quem.empresa],
      ['Cargo', quem.cargo],
      ['Telefone', quem.telefone],
      ['E-mail', quem.email],
      ['Rocha', dados.rocha],
      ['Diâmetro', dados.diametro],
      ['Testemunho', dados.testemunho],
      ['Abrasividade', dados.abrasividade],
      ['Granulometria', dados.granulometria],
      ['Matriz', dados.matriz],
      ['Canal de água', dados.canal],
      ['Cidade', dados.cidade],
    ],
    botao: 'Abrir a recomendação',
    caminho: `/selecao-matriz/${recomendacao.uid}`,
    whatsapp: whatsapp(quem.telefone),
    responderPara: quem.email,
  })

  return recomendacao
})
