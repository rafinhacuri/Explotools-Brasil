import { UserSchema } from '~/schemas/user'
import { sha512Crypt } from 'ldap-passwords'

export default defineEventHandler(async event => {
  const body = await readValidatedBody(event, UserSchema.safeParse)

  if(!body.success) throw createError({ status: 400, message: body.error.errors[0].message })

  const { user, senha } = body.data

  const existe = await Adm.findOne({ user })
    .catch(() => { throw createError({ status: 500, message: 'Não foi possivel ler os cadastros do banco de dados' }) })

  if(existe) throw createError({ status: 400, message: 'já cadastrado' })

  const senhaCrypt = sha512Crypt(senha)
  const userCrypt = sha512Crypt(user)

  await new Adm({ userCrypt, senhaCrypt }).save()
    .catch(() => { throw createError({ status: 500, message: 'Não foi possivel inserir o cadastro do banco de dados' }) })

  return 'Cadastro criado com Sucesso!'
})
