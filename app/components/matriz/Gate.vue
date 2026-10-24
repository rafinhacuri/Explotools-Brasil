<script setup lang="ts">
  import { safeParse } from 'valibot'

  const emit = defineEmits<{ entered: [] }>()
  const open = defineModel<boolean>('open', { default: false })

  const text = {
    title: 'Acesse a ferramenta',
    lede: 'Informe o e-mail que você usou no cadastro. É gratuito e leva menos de um minuto.',
    signupTitle: 'Cadastre-se',
    signupLede: 'Preencha seus dados para usar a Seleção de Matriz.',
    email: 'E-mail',
    enter: 'Continuar',
    noAccount: 'Ainda não tem cadastro?',
    signup: 'Cadastre-se',
    haveAccount: 'Já tem cadastro?',
    back: 'Entrar com e-mail',
    signupSubmit: 'Cadastrar e continuar',
    welcome: 'Bem-vindo',
  }

  const { leadAccessSchema } = useLeadSchema()
  const { errors, collect, clear } = useFormErrors()
  const { fetch: refreshSession } = useUserSession()
  const toast = useToast()
  const mode = ref<'login' | 'signup'>('login')
  const email = ref('')
  const loading = ref(false)

  async function enter(value = email.value): Promise<void> {
    const body = safeParse(leadAccessSchema, { email: value })
    if (!body.success) {
      collect(body.issues)
      return
    }
    clear()
    loading.value = true
    try {
      const { nome } = await $fetch('/api/auth/lead', { method: 'POST', body: body.output })
      await refreshSession()
      toast.success(`${text.welcome}, ${nome.split(' ')[0] ?? nome}!`)
      open.value = false
      emit('entered')
    } catch (error) {
      toast.fail(error)
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <DialogRoot v-model:open="open" :modal="true">
    <DialogPortal>
      <DialogOverlay class="scrim fixed inset-0 z-80 bg-furo/80 backdrop-blur-md" />
      <DialogContent
        class="sheet fixed top-1/2 left-1/2 z-90 max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[2rem] border border-line-strong bg-rocha p-6 shadow-float outline-none sm:p-9"
        :class="mode === 'signup' ? 'max-w-2xl' : 'max-w-md'"
        @escape-key-down.prevent
        @pointer-down-outside.prevent
        @interact-outside.prevent>
        <svg :viewBox="MARK_VIEWBOX" class="h-10 w-auto text-red" aria-hidden="true">
          <path fill="currentColor" :d="MARK_PATH" />
        </svg>
        <DialogTitle class="mt-5 display text-[2.5rem] leading-none">
          {{ mode === 'login' ? text.title : text.signupTitle }}
        </DialogTitle>
        <DialogDescription class="mt-3 text-[0.9375rem] text-muted">
          {{ mode === 'login' ? text.lede : text.signupLede }}
        </DialogDescription>

        <Transition
          mode="out-in"
          enter-active-class="transition duration-300 ease-out-quint"
          enter-from-class="translate-y-3 opacity-0"
          leave-active-class="transition duration-150"
          leave-to-class="opacity-0">
          <form
            v-if="mode === 'login'"
            key="login"
            class="mt-7 flex flex-col gap-4"
            novalidate
            @submit.prevent="enter()">
            <Field
              v-model="email"
              :label="text.email"
              name="email"
              type="email"
              inputmode="email"
              autocomplete="email"
              :error="errors.email" />
            <Btn
              type="submit"
              size="lg"
              :loading="loading"
              trailing="ph:arrow-right"
              class="w-full"
              >{{ text.enter }}</Btn
            >
            <p class="text-center text-[0.875rem] text-muted">
              {{ text.noAccount }}
              <button
                type="button"
                class="font-semibold text-red hover:underline"
                @click="mode = 'signup'">
                {{ text.signup }}
              </button>
            </p>
          </form>
          <div v-else key="signup" class="mt-7">
            <LeadForm :submit="text.signupSubmit" @done="enter" />
            <p class="mt-5 text-center text-[0.875rem] text-muted">
              {{ text.haveAccount }}
              <button
                type="button"
                class="font-semibold text-red hover:underline"
                @click="mode = 'login'">
                {{ text.back }}
              </button>
            </p>
          </div>
        </Transition>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
