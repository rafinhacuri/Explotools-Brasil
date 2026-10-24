export default defineEventHandler(async (event) => {
  const { email } = await requireAdmin(event)
  const _id = objectId(event)

  const admin = await Adm.findById(_id)
    .lean()
    .catch(() => failed('Não foi possível ler o usuário'))
  if (!admin) throw createError({ status: 404, message: 'Usuário não encontrado' })
  if (admin.user === email) {
    throw createError({ status: 400, message: 'Você não pode excluir a própria conta' })
  }

  await Adm.deleteOne({ _id }).catch(() => failed('Não foi possível excluir o usuário'))
  return 'Usuário excluído'
})
