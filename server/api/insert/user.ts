import { sha512Crypt } from 'ldap-passwords'
import { UserSchema } from '~/schemas/user'

export default defineEventHandler(async event => {
  await requireUserSession(event, { statusCode: 401, message: 'Você não tem pemissão para executar essa ação' })

  const body = await readValidatedBody(event, UserSchema.safeParse)

  if(!body.success) throw createError({ status: 400, message: body.error.errors[0].message })

  const { user, senha } = body.data

  const existe = await Adm.findOne({ user })
    .catch(() => { throw createError({ status: 500, message: 'Não foi possivel ler os usuarios do banco de dados' }) })

  if(existe) throw createError({ status: 400, message: 'já cadastrado' })

  const senhaCrypt = sha512Crypt(senha)

  await new Adm({ user, senha: senhaCrypt }).save()
    .catch(() => { throw createError({ status: 500, message: 'Não foi possivel inserir o usuario do banco de dados' }) })

  return 'Cadastro criado com Sucesso!'
})
