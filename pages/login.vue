<script setup lang="ts">
import { UserSchema } from '~/schemas/user'
import type { User } from '~/schemas/user'

useHead({ title: `Login` })

defineOgImageComponent('NuxtSeo', { theme: '#3FA1B0', colorMode: 'dark' })

const toast = useToast()

const { start, finish } = useLoadingIndicator()

const state = ref<User>({ user: '', senha: '' })

async function login(){
  start()

  const body = UserSchema.safeParse(state.value)
  if(!body.success){
    toast.add({ title: body.error.errors[0].message, icon: 'i-heroicons-exclamation-triangle', color: 'red' })
    return finish()
  }

  const res = await $fetch('/auth', { method: 'post', body: body.data })
    .catch(error => { toast.add({ title: error.data.message, icon: 'i-heroicons-exclamation-triangle', color: 'red' }) })

  finish({ error: true })

  if(!res) return finish({ error: true })

  toast.add({ title: res, icon: 'i-heroicons-check-badge', color: 'green' })
  await navigateTo('/lista')
}
</script>

<template>
  <section class="min-h-screen bg-[url('/fundo.jpeg')] bg-cover bg-center bg-no-repeat">
    <div class="mx-auto flex min-h-screen flex-col items-center justify-center px-6">
      <div class="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800">
        <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1 mclass="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white ms-2">
            Explotools - Login
          </h1>
          <UForm :schema="UserSchema" :state class="space-y-4 md:space-y-6" @submit="login">
            <UFormGroup label="Email" name="email">
              <UInput v-model="state.user" icon="i-heroicons-user" size="lg" color="white" />
            </UFormGroup>
            <UFormGroup label="Senha" name="senha">
              <UInput v-model="state.senha" icon="i-heroicons-key" size="lg" color="white" type="password" />
            </UFormGroup>
            <UButton icon="i-heroicons-arrow-left-on-rectangle" label="Entrar" variant="solid" block type="submit" />
          </UForm>
        </div>
      </div>
    </div>
  </section>
</template>
