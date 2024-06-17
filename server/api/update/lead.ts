import { EditLeadSchema } from '~/schemas/lead'

export default defineEventHandler(async event => {
  await requireUserSession(event, { statusCode: 401, message: 'Você não tem pemissão para executar essa ação' })

  const body = await readValidatedBody(event, EditLeadSchema.safeParse)

  if(!body.success) throw createError({ status: 400, message: body.error.errors[0].message })

  const { nome, cargo, _id, email, empresa, interesse, telefone } = body.data

  const lead = await Leads.findOne({ _id })
    .catch(() => { throw createError({ status: 500, message: 'Não foi possivel ler a configuração do banco de dados' }) })

  if(!lead) throw createError({ status: 404, message: 'Evento não encontrado' })

  if(nome && lead.nome !== nome) lead.nome = nome
  if(cargo && lead.cargo !== cargo) lead.cargo = cargo
  if(email && lead.email !== email) lead.email = email
  if(empresa && lead.empresa !== empresa) lead.empresa = empresa
  if(interesse && lead.interesse !== interesse) lead.interesse = interesse
  if(telefone && lead.telefone !== telefone) lead.telefone = telefone

  await lead.save()
    .catch(() => { throw createError({ status: 500, message: 'Não foi possivel salvar o configuração de inscrição no banco de dados' }) })

  return 'Configuração salva com sucesso'
})
