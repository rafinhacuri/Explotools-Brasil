import { LeadSchema } from '~/schemas/lead'

export default defineEventHandler(async event => {
  const body = await readValidatedBody(event, LeadSchema.safeParse)

  if(!body.success) throw createError({ status: 400, message: body.error.errors[0].message })

  const { nome, cargo, email, empresa, telefone, interesse } = body.data

  const existe = await Leads.findOne({ email })
    .catch(() => { throw createError({ status: 500, message: 'Não foi possivel ler os cadastros do banco de dados' }) })

  if(existe) throw createError({ status: 400, message: 'Email já cadastrado' })

  await new Leads({ nome, cargo, email, empresa, telefone, interesse }).save()
    .catch(() => { throw createError({ status: 500, message: 'Não foi possivel inserir o cadastro do banco de dados' }) })

  return 'Cadastro criado com Sucesso!'
})
