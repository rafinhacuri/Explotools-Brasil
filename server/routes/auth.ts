import { verifySha512Crypt } from 'ldap-passwords'

export default defineEventHandler(async event => {
  const body = await readValidatedBody(event, UserSchema.safeParse)

  if(!body.success) throw createError({ status: 401, message: body.error.issues[0]?.message || '' })

  const { user, senha } = body.data

  const usuario: { user: string } = { user }

  if(!(/^\S[^\s@]*@\S[^\s.]*\.\S+$/.test(user))) throw createError({ status: 401, message: 'escreva um email valido' })

  const userRes = await Adm.findOne({ user })
    .catch(() => { throw createError({ status: 500, message: 'Não foi possivel ler os usuarios do banco de dados' }) })

  if(!userRes) throw createError({ status: 401, message: 'Usuário e/ou senha inválidos' })

  const senhas = userRes.senha

  if(!senhas) throw createError({ status: 401, message: 'Usuário e/ou senha inválidos' })

  if(!verifySha512Crypt(senha, senhas)) throw createError({ status: 401, message: 'Usuário e/ou senha inválidos' })

  await setUserSession(event, { user: { email: usuario.user, level: 'admin' } })

  return 'Autenticado com sucesso!'
})
