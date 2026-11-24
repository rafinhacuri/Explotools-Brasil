import { sha512Crypt } from 'ldap-passwords'

const { adminSchema } = useAdminSchema()

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)
  const { email, senha } = await validBody(event, adminSchema)

  if (await Adm.exists({ user: email })) {
    throw createError({ status: 409, message: 'Já existe um usuário com este e-mail' })
  }

  await new Adm({ user: email, senha: sha512Crypt(senha), createdAt: new Date().toISOString() })
    .save()
    .catch(() => failed('Não foi possível criar o usuário'))

  await avisar({
    evento: 'Novo administrador',
    assunto: `Novo administrador: ${email}`,
    titulo: 'Novo administrador no painel',
    resumo: `${admin.email} criou o acesso de ${email}`,
    campos: [
      ['Novo usuário', email],
      ['Criado por', admin.email],
    ],
    botao: 'Abrir o painel',
    caminho: '/adm',
  })

  return 'Usuário criado'
})
