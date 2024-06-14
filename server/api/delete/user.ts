import { IdSchema } from '~/schemas/id'

export default defineEventHandler(async event => {
  await requireUserSession(event, { statusCode: 401, message: 'Você não tem pemissão para executar essa ação' })

  const body = await readValidatedBody(event, IdSchema.safeParse)

  if(!body.success) throw createError({ status: 401, message: body.error.errors[0].message })

  const { _id } = body.data

  const adm = await Adm.findOne({ _id })
    .catch(() => { throw createError({ status: 500, message: 'Não foi possivel ler o adm do banco de dados' }) })

  if(!adm) throw createError({ status: 404, message: 'adm não encontrado' })

  await Adm.findByIdAndDelete(_id)
    .catch(() => { throw createError({ status: 500, message: 'Não foi possivel deletar a pagina do banco de dados' }) })

  return 'Adm excluido com susseso!'
})
