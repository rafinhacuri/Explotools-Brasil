import mongoose, { Schema } from 'mongoose'

const { MONGO_URL, MONGO_USERNAME, MONGO_PASSWORD, MONGO_DB_NAME } = useRuntimeConfig()

mongoose.connect(MONGO_URL, {
  tls: true,
  auth: { username: MONGO_USERNAME, password: MONGO_PASSWORD },
  dbName: MONGO_DB_NAME,
})

export const Leads = mongoose.model('lead', new Schema<Lead>({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  telefone: { type: String, required: true },
  empresa: { type: String, required: true },
  cargo: { type: String, required: true },
  wireline: { type: Boolean, required: false },
  createdAt: { type: String, required: false },
  lastAccess: { type: String, required: false },
}))

export const Adm = mongoose.model('adm', new Schema<User>({
  user: { type: String, required: true },
  senha: { type: String, required: true },
}))

const DiagRowSchema = new Schema({
  sintoma: { type: String, required: true },
  causa: { type: String, required: true },
  acao: { type: String, required: true },
  ajuste: { type: String, required: true },
}, { _id: false })

const BoaPraticaRowSchema = new Schema({
  parametro: { type: String, required: true },
  regra: { type: String, required: true },
  ajuste: { type: String, required: true },
  obs: { type: String, required: true },
}, { _id: false })

export const Recomenacoes = mongoose.model('recomendacao', new Schema<RecomendacaoMongo>({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  rocha: { type: String, required: false },
  mohs: { type: Number, required: true },
  eqc: { type: Number, required: true },
  cai: { type: Number, required: true },
  caiClasse: { type: String, required: true },
  ucs: { type: String, required: true },
  abrasividade: { type: String, required: true },
  granulometria: { type: String, required: true },
  diametro: { type: String, required: true },
  formacao: { type: String, required: true },
  objetivo: { type: String, required: true },
  matriz: { type: String, required: true },
  matrizPalavra: { type: String, required: true },
  abrVariante: { type: String, required: true },
  serie: { type: String, required: true },
  serieAlt: { type: String, required: false, default: '' },
  areaAberta: { type: String, required: true },
  canalCoroa: { type: String, required: true },
  alturaCoroa: { type: String, required: true },
  diCorpo: { type: String, required: true },
  fordiaEpiroc: { type: String, required: true },
  boartLongyear: { type: String, required: true },
  dimatec: { type: String, required: true },
  hayden: { type: String, required: true },
  abrNota: { type: String, required: false, default: '' },
  rpm: { type: String, required: true },
  wob: { type: String, required: true },
  fluxoAgua: { type: String, required: true },
  canal: { type: String, required: true },
  diagnostico: { type: [DiagRowSchema], required: true },
  boasPraticas: { type: [BoaPraticaRowSchema], required: true },
  createdAt: { type: String, required: false },
}))
