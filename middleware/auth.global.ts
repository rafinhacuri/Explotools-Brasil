export default defineNuxtRouteMiddleware(async to => {
  // * tentando acessar index
  if(['/'].includes(to.fullPath)) return navigateTo('/lead')

  const { loggedIn, fetch } = useUserSession()

  // * Atualizando a sessão
  await fetch()

  // * Não logado tentando acessar página protegida
  if(!loggedIn.value && ['/adm'].includes(to.fullPath)) return navigateTo('/login')

  // * Logado tentando acessar login
  if(loggedIn.value && ['/login'].includes(to.fullPath)) return navigateTo('/adm')
})
