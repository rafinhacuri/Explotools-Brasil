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
