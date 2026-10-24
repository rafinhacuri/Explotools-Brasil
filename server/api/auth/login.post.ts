import { verifySha512Crypt } from 'ldap-passwords'
import { useAdminSchema } from '~~/app/composables/useAdminSchema'

const INVALID = 'E-mail e/ou senha inválidos'

const { loginSchema } = useAdminSchema()

export default defineEventHandler(async (event) => {
  const { email, senha } = await validBody(event, loginSchema)
  await connectDb()

  const admin = await Adm.findOne({ user: email })
    .lean()
    .catch(() => failed('Não foi possível ler os usuários'))

  if (!admin?.senha || !verifySha512Crypt(senha, admin.senha)) {
    throw createError({ status: 401, message: INVALID })
  }

  await setUserSession(event, { user: { email, level: 'admin' } })
  return 'Bem-vindo de volta'
})
