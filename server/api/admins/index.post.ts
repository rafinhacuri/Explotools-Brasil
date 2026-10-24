import { sha512Crypt } from 'ldap-passwords'
import { useAdminSchema } from '~~/app/composables/useAdminSchema'

const { adminSchema } = useAdminSchema()

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const { email, senha } = await validBody(event, adminSchema)

  if (await Adm.exists({ user: email })) {
    throw createError({ status: 409, message: 'Já existe um usuário com este e-mail' })
  }

  await new Adm({ user: email, senha: sha512Crypt(senha), createdAt: new Date().toISOString() })
    .save()
    .catch(() => failed('Não foi possível criar o usuário'))

  return 'Usuário criado'
})
