<script setup lang="ts">
  import { safeParse } from 'valibot'

  const emit = defineEmits<{ saved: [] }>()
  const open = defineModel<boolean>('open', { default: false })

  const text = {
    title: 'Novo usuário',
    lede: 'A pessoa poderá entrar no painel com este e-mail e senha.',
    email: 'E-mail',
    password: 'Senha',
    confirm: 'Confirme a senha',
    create: 'Criar usuário',
  }

  const { adminSchema } = useAdminSchema()
  const { errors, collect, clear } = useFormErrors()
  const toast = useToast()
  const loading = ref(false)
  const state = ref<AdminSchema>({ email: '', senha: '', confirmacao: '' })

  watch(open, (value) => {
    if (!value) return
    clear()
    state.value = { email: '', senha: '', confirmacao: '' }
  })

  async function save(): Promise<void> {
    const body = safeParse(adminSchema, state.value)
    if (!body.success) {
      collect(body.issues)
      return
    }
    loading.value = true
    try {
      toast.success(await $fetch('/api/admins', { method: 'POST', body: body.output }))
      open.value = false
      emit('saved')
    } catch (error) {
      toast.fail(error)
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <AdmModal v-model:open="open" :title="text.title" :description="text.lede">
    <form class="flex flex-col gap-4" novalidate @submit.prevent="save">
      <Field
        v-model="state.email"
        :label="text.email"
        name="email"
        type="email"
        autocomplete="off"
        :error="errors.email" />
      <Field
        v-model="state.senha"
        :label="text.password"
        name="senha"
        type="password"
        autocomplete="new-password"
        :error="errors.senha" />
      <Field
        v-model="state.confirmacao"
        :label="text.confirm"
        name="confirmacao"
        type="password"
        autocomplete="new-password"
        :error="errors.confirmacao" />
      <div class="mt-2 flex justify-end">
        <Btn type="submit" :loading="loading" icon="ph:user-plus">{{ text.create }}</Btn>
      </div>
    </form>
  </AdmModal>
</template>
