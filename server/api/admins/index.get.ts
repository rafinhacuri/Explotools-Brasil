export default defineEventHandler(async (event): Promise<AdminRow[]> => {
  const { email } = await requireAdmin(event)

  const admins = await Adm.find()
    .select('user createdAt')
    .lean()
    .catch(() => failed('Não foi possível ler os usuários'))

  return admins
    .map((admin) => ({
      _id: String(admin._id),
      email: admin.user,
      createdAt: admin.createdAt ?? admin._id.getTimestamp().toISOString(),
      self: admin.user === email,
    }))
    .toSorted((a, b) => a.createdAt.localeCompare(b.createdAt))
})
