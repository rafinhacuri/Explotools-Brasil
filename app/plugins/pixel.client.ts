export default defineNuxtPlugin(() => {
  const router = useRouter()
  const { proxy } = useScriptMetaPixel()
  let first = true

  router.afterEach((to, from) => {
    if (first) {
      first = false
      return
    }
    if (to.path !== from.path) proxy.fbq('track', 'PageView')
  })
})
