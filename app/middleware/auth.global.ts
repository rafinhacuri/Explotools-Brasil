export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path !== '/adm' && to.path !== '/login') return

  const { loggedIn, user, fetch } = useUserSession()
  await fetch()

  const admin = loggedIn.value && user.value?.level === 'admin'
  if (to.path === '/adm' && !admin) return navigateTo('/login')
  if (to.path === '/login' && admin) return navigateTo('/adm')
})
