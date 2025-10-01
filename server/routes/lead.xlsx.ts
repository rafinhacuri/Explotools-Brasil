import excel from 'exceljs'

export default defineEventHandler(async event => {
  const { user } = await requireUserSession(event, { statusCode: 401, message: 'Você não tem pemissão para executar essa ação' })

  if(user.level !== 'admin') throw createError({ statusCode: 401, message: 'Você não tem pemissão para executar essa ação' })

  const lead = await Leads.find().lean()
    .catch(() => { throw createError({ status: 500, message: 'Não foi possivel ler as configurações do banco de dados' }) })

  if(!lead) throw createError({ statusCode: 400, message: 'configuração não encontrada' })

  const workbook = new excel.Workbook()
  const worksheet = workbook.addWorksheet('Ordens de Serviço Mecânica')

  worksheet.columns = [
    { header: 'Nome', key: 'nome', width: 30 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Telefone', key: 'telefone', width: 20 },
    { header: 'Empresa', key: 'empresa', width: 20 },
    { header: 'Cargo', key: 'cargo', width: 20 },
  ]

  worksheet.getRow(1).eachCell(cell => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF008000' },
    }
  })

  for(const pessoa of lead){
    const { nome, cargo, email, empresa, telefone } = pessoa

    worksheet.addRow({ nome, cargo, email, empresa, telefone })
  }

  const buffer = await workbook.xlsx.writeBuffer()

  appendResponseHeaders(event, {
    'Content-Disposition': 'attachment; filename=leads.xlsx',
    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  return buffer
})
