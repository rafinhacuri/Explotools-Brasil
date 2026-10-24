import { sha512Crypt } from 'ldap-passwords'

const { adminSchema } = useAdminSchema()

export default defineEventHandler(async (event) => {
  const { email, senha } = await validBody(event, adminSchema)
  await connectDb()

  const total = await Adm.countDocuments().catch(() => failed('Não foi possível ler os usuários'))
  if (total > 0) {
    throw createError({ status: 403, message: 'O primeiro acesso já foi configurado' })
  }

  await new Adm({ user: email, senha: sha512Crypt(senha), createdAt: new Date().toISOString() })
    .save()
    .catch(() => failed('Não foi possível criar o usuário'))

  await setUserSession(event, { user: { email, level: 'admin' } })
  return 'Conta de administrador criada'
})
