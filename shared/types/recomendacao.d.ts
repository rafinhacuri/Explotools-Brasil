interface RecomendacaoReturn{
  rocha: string,
  serie: string,
  matriz: string,
  diCorpo: string,
  fordiaEpiroc: string,
  boartLongyear: string,
  rpm: string,
  wob: string,
  fluxoAgua: string,
  canal: string,
  diagnostico: { sintoma: string, causa: string, acao: string, ajuste: string }[],
  boasPraticas: { parametro: string, regraBolso: string, comoAjustar: string, obs: string }[],
}
