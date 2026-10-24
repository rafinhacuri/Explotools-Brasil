<script setup lang="ts">
  import { safeParse } from 'valibot'

  definePageMeta({ layout: 'bare' })

  const text = {
    title: 'Entrar',
    panel: 'Painel administrativo',
    loginTitle: 'Entrar no painel',
    loginLede: 'Acesse com o e-mail e a senha de administrador.',
    setupBadge: 'Primeiro acesso',
    setupTitle: 'Crie a conta de administrador',
    setupLede:
      'Ainda não existe nenhum usuário. Esta conta será a primeira do painel — depois, só ela poderá criar novos acessos.',
    email: 'E-mail',
    password: 'Senha',
    confirm: 'Confirme a senha',
    show: 'Mostrar senha',
    hide: 'Esconder senha',
    enter: 'Entrar',
    create: 'Criar conta e entrar',
    back: 'Voltar ao site',
    quote: 'Contra a hora parada.',
  }

  useHead({ title: text.title })
  useSeoMeta({ robots: 'noindex' })

  const { loginSchema, adminSchema } = useAdminSchema()
  const { errors, collect, clear } = useFormErrors()
  const { fetch: refreshSession } = useUserSession()
  const toast = useToast()

  const { data: setup } = await useFetch('/api/setup', { default: () => ({ open: false }) })
  const firstAccess = computed(() => setup.value.open)

  const state = ref<AdminSchema>({ email: '', senha: '', confirmacao: '' })
  const show = ref(false)
  const loading = ref(false)

  async function submit(): Promise<void> {
    const schema = firstAccess.value ? adminSchema : loginSchema
    const body = safeParse(schema, state.value)
    if (!body.success) {
      collect(body.issues)
      return
    }
    clear()
    loading.value = true
    try {
      const message = await $fetch(firstAccess.value ? '/api/setup' : '/api/auth/login', {
        method: 'POST',
        body: body.output,
      })
      await refreshSession()
      toast.success(message)
      await navigateTo('/adm')
    } catch (error) {
      toast.fail(error)
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <div class="grid min-h-dvh lg:grid-cols-[1.1fr_1fr]">
    <aside class="relative hidden overflow-hidden border-r border-line lg:block">
      <Strata :layers="7" :seed="17" :depth="200" :vein="4" />
      <div
        aria-hidden="true"
        class="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_30%_30%,rgb(254_0_24/0.22)_0%,transparent_70%)]" />
      <div class="relative flex h-full flex-col justify-between p-12">
        <NuxtLink to="/" class="text-[1.5rem]" :aria-label="text.back">
          <Logo tagline />
        </NuxtLink>
        <div>
          <p class="label text-red">{{ text.panel }}</p>
          <p class="mt-4 display text-[clamp(4rem,7vw,7rem)] leading-[0.84]">{{ text.quote }}</p>
        </div>
      </div>
    </aside>

    <div class="relative flex items-center justify-center px-5 py-12 sm:px-8">
      <div class="w-full max-w-md">
        <NuxtLink
          to="/"
          class="mb-12 inline-block text-[1.375rem] lg:hidden"
          :aria-label="text.back">
          <Logo tagline />
        </NuxtLink>

        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ type: 'spring', bounce: 0, duration: 0.8 }">
          <span
            v-if="firstAccess"
            class="inline-flex items-center gap-2 rounded-full border border-red/40 bg-red/10 px-3 py-1.5 label text-red">
            <Icon name="ph:sparkle-fill" class="size-3.5" />
            {{ text.setupBadge }}
          </span>
          <h1 class="mt-4 display text-[clamp(2.75rem,6vw,4rem)] leading-[0.9]">
            {{ firstAccess ? text.setupTitle : text.loginTitle }}
          </h1>
          <p class="mt-4 text-[0.9375rem] text-muted">
            {{ firstAccess ? text.setupLede : text.loginLede }}
          </p>

          <form class="mt-10 flex flex-col gap-5" novalidate @submit.prevent="submit">
            <Field
              v-model="state.email"
              :label="text.email"
              name="email"
              type="email"
              inputmode="email"
              autocomplete="username"
              :error="errors.email" />
            <Field
              v-model="state.senha"
              :label="text.password"
              name="senha"
              :type="show ? 'text' : 'password'"
              :autocomplete="firstAccess ? 'new-password' : 'current-password'"
              :error="errors.senha">
              <template #trailing>
                <button
                  type="button"
                  class="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-fg/60 hover:text-fg"
                  :aria-label="show ? text.hide : text.show"
                  :aria-pressed="show"
                  @click="show = !show">
                  <Icon :name="show ? 'ph:eye-slash' : 'ph:eye'" class="size-5" />
                </button>
              </template>
            </Field>
            <Field
              v-if="firstAccess"
              v-model="state.confirmacao"
              :label="text.confirm"
              name="confirmacao"
              :type="show ? 'text' : 'password'"
              autocomplete="new-password"
              :error="errors.confirmacao" />
            <Btn
              type="submit"
              size="lg"
              :loading="loading"
              trailing="ph:arrow-right"
              class="mt-2 w-full">
              {{ firstAccess ? text.create : text.enter }}
            </Btn>
          </form>

          <NuxtLink
            to="/"
            class="mt-10 inline-flex items-center gap-2 text-[0.875rem] text-muted hover:text-fg">
            <Icon name="ph:arrow-left" class="size-4" />
            {{ text.back }}
          </NuxtLink>
        </Motion>
      </div>
    </div>
  </div>
</template>
