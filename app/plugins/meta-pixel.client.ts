export default defineNuxtPlugin(() => {
  const router = useRouter()

  const track = () => {
    // eslint-disable-next-line typescript/no-explicit-any
    const w = globalThis as any
    if(typeof w.fbq === 'function'){
      w.fbq('track', 'PageView')
    }
  }

  track()

  router.afterEach(() => track())
})
