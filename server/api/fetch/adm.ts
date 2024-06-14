export default defineEventHandler(async event => {
  await requireUserSession(event, { statusCode: 401, message: 'Você não tem pemissão para executar essa ação' })

  const adm = await Adm.find().lean()
    .catch(() => { throw createError({ status: 500, message: 'Não foi possivel ler as configurações do banco de dados' }) })

  return adm
})
