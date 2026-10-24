export default defineEventHandler(async () => {
  await connectDb()
  const total = await Adm.estimatedDocumentCount().catch(() =>
    failed('Não foi possível ler os usuários'),
  )
  return { open: total === 0 }
})
