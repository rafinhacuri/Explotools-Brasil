import { v4 } from 'uuid'

export default defineEventHandler(async event => {
  await requireUserSession(event, { statusCode: 401, message: 'Você não tem pemissão para executar essa ação' })

  const body = await readValidatedBody(event, RecomendacaoSchema.safeParse)
  if(!body.success) throw createError({ status: 400, message: body.error.issues[0]?.message || '' })

  const { abrasividade, granulometria, diametro, formacao, objetivo, mohs, rocha, email } = body.data

  const abra = mapAbra(abrasividade)
  const form = mapForm(formacao)
  const grain = mapGrain(granulometria)
  const obj = mapObj(objetivo)
  const size = mapSize(diametro)

  // Propriedades da rocha (eqc/cai/ucs) — da base quando reconhecida, senão estimadas.
  const rock = findRock(rocha)
  const eqc = rock?.eqc ?? (abra === 'high' ? 60 : abra === 'medium' ? 28 : 5)
  const cai = rock?.cai ?? (abra === 'high' ? 4.2 : abra === 'medium' ? 2.5 : 1.0)
  const ucs = rock ? `${rock.ucs[0]}–${rock.ucs[1]} MPa` : '—'

  const matriz = computeMatrix(mohs, abra, form)
  const ds = decideSeries(mohs, abra, form)
  const eq = equivalents(mohs, abra)
  const cp = crownProfile(mohs, abra, form, obj)
  const ops = opNumbers(size, abra, grain, form)

  const recomendacao: RecomendacaoMongo = {
    uid: v4(),
    email: email || '',
    rocha: rocha || '',
    mohs,
    eqc,
    cai,
    caiClasse: caiClass(cai),
    ucs,
    abrasividade,
    granulometria,
    diametro,
    formacao,
    objetivo,
    matriz: String(matriz),
    matrizPalavra: matrixWord(matriz),
    abrVariante: abra === 'high' ? 'Sim' : 'Não',
    serie: ds.serie,
    serieAlt: ds.alt,
    areaAberta: cp.openness,
    canalCoroa: cp.waterway,
    alturaCoroa: cp.crown,
    diCorpo: eq.dicorp,
    fordiaEpiroc: eq.hero,
    boartLongyear: eq.bl,
    dimatec: eq.dimatec,
    hayden: eq.hayden,
    abrNota: eq.abr,
    rpm: `${ops.rpmRange[0]}–${ops.rpmRange[1]}`,
    wob: `${ops.wobRange[0]}–${ops.wobRange[1]}`,
    fluxoAgua: `${ops.flowRange[0]}–${ops.flowRange[1]}`,
    canal: ops.waterway,
    diagnostico: buildDiagnostico(abra, form, ops),
    boasPraticas: buildBoasPraticas(size, abra, form, ops),
    createdAt: new Date().toISOString(),
  }

  await new Recomenacoes(recomendacao).save()

  return recomendacao
})
