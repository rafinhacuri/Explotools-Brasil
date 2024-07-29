export default defineNuxtRouteMiddleware(async (to, from) => {
  const { loggedIn, fetch } = useUserSession()

  // * Atualizando a sessão
  await fetch()

  // * Não logado tentando acessar página protegida
  if(!loggedIn.value && ['/adm'].includes(to.fullPath)) return navigateTo('/login')

  // * Logado tentando acessar login
  if(loggedIn.value && ['/login'].includes(to.fullPath)) return navigateTo('/adm')

  // * tentando acessar index
  if(['/'].includes(to.fullPath)) return navigateTo('/lead')

  // * Apenas permitir acesso à página de obrigado se vier da página de lead
  if(to.fullPath === '/obrigado' && from.fullPath !== '/lead') return navigateTo('/lead')
})
