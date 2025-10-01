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
}))

export const Adm = mongoose.model('adm', new Schema<User>({
  user: { type: String, required: true },
  senha: { type: String, required: true },
}))

export const Recomenacoes = mongoose.model('recomendacao', new Schema<RecomendacaoMongo>({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  rocha: { type: String, required: false },
  mohs: { type: Number, required: true },
  abrasividade: { type: String, required: true },
  granulometria: { type: String, required: true },
  diametro: { type: String, required: true },
  formacao: { type: String, required: true },
  serie: { type: String, required: true },
  matriz: { type: String, required: true },
  diCorpo: { type: String, required: true },
  fordiaEpiroc: { type: String, required: true },
  boartLongyear: { type: String, required: true },
  rpm: { type: String, required: true },
  wob: { type: String, required: true },
  fluxoAgua: { type: String, required: true },
  canal: { type: String, required: true },
  diagnostico: { type: [new Schema({
    sintoma: String,
    causa: String,
    acao: String,
    ajuste: String,
  })], required: true },
  boasPraticas: { type: [new Schema({
    parametro: String,
    regraBolso: String,
    comoAjustar: String,
    obs: String,
  })], required: true },
}))
