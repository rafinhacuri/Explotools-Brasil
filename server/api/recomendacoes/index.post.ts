import { randomUUID } from 'node:crypto'

const { recomendacaoSchema } = useRecomendacaoSchema()

export default defineEventHandler(async (event): Promise<RecomendacaoMongo> => {
  const { email } = await requireLead(event)
  const input = await validBody(event, recomendacaoSchema)
  const { abrasividade, granulometria, diametro, formacao, objetivo, mohs, rocha } = input

  const abra = mapAbra(abrasividade)
  const form = mapForm(formacao)
  const grain = mapGrain(granulometria)
  const obj = mapObj(objetivo)
  const size = mapSize(diametro)

  // Propriedades da rocha (eqc/cai/ucs) — da base quando reconhecida, senão estimadas.
  const rock = findRock(rocha)
  const fallback = ABRA_DEFAULTS[abra]
  const eqc = rock?.eqc ?? fallback.eqc
  const cai = rock?.cai ?? fallback.cai
  const ucs = rock ? `${rock.ucs[0]}–${rock.ucs[1]} MPa` : '—'

  const matriz = computeMatrix(mohs, abra, form)
  const series = decideSeries(mohs, abra, form)
  const eq = equivalents(mohs, abra)
  const crown = crownProfile(mohs, abra, form, obj)
  const ops = opNumbers(size, abra, grain, form)

  const recomendacao: RecomendacaoMongo = {
    uid: randomUUID(),
    email,
    rocha: rock?.n ?? rocha ?? '',
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
    serie: series.serie,
    serieAlt: series.alt,
    areaAberta: crown.openness,
    canalCoroa: crown.waterway,
    alturaCoroa: crown.crown,
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

  await new Recomendacoes(recomendacao)
    .save()
    .catch(() => failed('Não foi possível salvar a recomendação'))

  return recomendacao
})
