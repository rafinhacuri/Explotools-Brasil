export default defineEventHandler(async event => {
  const body = await readValidatedBody(event, LeadSchema.safeParse)

  if(!body.success) throw createError({ status: 400, message: body.error.errors[0]?.message || '' })

  const { nome, cargo, email, empresa, telefone } = body.data

  const existe = await Leads.findOne({ email })
    .catch(() => { throw createError({ status: 500, message: 'Não foi possivel ler os cadastros do banco de dados' }) })

  if(existe) throw createError({ status: 400, message: 'Email já cadastrado' })

  const existe2 = await Leads.findOne({ telefone })
    .catch(() => { throw createError({ status: 500, message: 'Não foi possivel ler os cadastros do banco de dados' }) })

  if(existe2) throw createError({ status: 400, message: 'Telefone já cadastrado' })

  await new Leads({ nome, cargo, email, empresa, telefone }).save()
    .catch(() => { throw createError({ status: 500, message: 'Não foi possivel inserir o cadastro do banco de dados' }) })

  return 'Cadastro criado com Sucesso!'
})
