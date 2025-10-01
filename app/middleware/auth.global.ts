export default defineNuxtRouteMiddleware(async to => {
  const { loggedIn, fetch, user } = useUserSession()

  // * Atualizando a sessão
  await fetch()

  // * Não logado tentando acessar página protegida
  if(!loggedIn.value && ['/adm'].includes(to.fullPath)) return navigateTo('/login')
  if(loggedIn.value && ['/adm'].includes(to.fullPath) && user.value.level !== 'admin') return navigateTo('/')

  // * Logado tentando acessar login
  if(loggedIn.value && ['/login'].includes(to.fullPath)) return navigateTo('/adm')
})
