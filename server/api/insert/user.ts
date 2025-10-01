import { sha512Crypt } from 'ldap-passwords'

export default defineEventHandler(async event => {
  const { user } = await requireUserSession(event, { statusCode: 401, message: 'Você não tem pemissão para executar essa ação' })

  if(user.level !== 'admin') throw createError({ statusCode: 401, message: 'Você não tem pemissão para executar essa ação' })

  const body = await readValidatedBody(event, UserSchema.safeParse)

  if(!body.success) throw createError({ status: 400, message: body.error.issues[0]?.message || '' })

  const { user: email, senha } = body.data

  const existe = await Adm.findOne({ user: email })
    .catch(() => { throw createError({ status: 500, message: 'Não foi possivel ler os usuarios do banco de dados' }) })

  if(existe) throw createError({ status: 400, message: 'já cadastrado' })

  const senhaCrypt = sha512Crypt(senha)

  await new Adm({ user, senha: senhaCrypt }).save()
    .catch(() => { throw createError({ status: 500, message: 'Não foi possivel inserir o usuario do banco de dados' }) })

  return 'Cadastro criado com Sucesso!'
})
