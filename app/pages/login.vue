<script setup lang="ts">
useHead({ title: `Login` })

definePageMeta({
  layout: false,
})

defineOgImageComponent('NuxtSeo', { theme: '#3FA1B0', colorMode: 'dark' })

const toast = useToast()

const { start, finish, isLoading } = useLoadingIndicator()

const state = ref<User>({ user: '', senha: '' })
const show = ref(false)

async function login(){
  start()

  const body = UserSchema.safeParse(state.value)
  if(!body.success){
    toast.add({ title: body.error.issues[0]?.message || '', icon: 'i-heroicons-exclamation-triangle', color: 'error' })
    return finish({ error: true })
  }

  const res = await $fetch('/auth', { method: 'post', body: body.data })
    .catch(error => { toast.add({ title: error.data.message, icon: 'i-heroicons-exclamation-triangle', color: 'error' }) })

  finish({ error: true })

  if(!res) return finish({ error: true })

  toast.add({ title: res, icon: 'i-heroicons-check-circle', color: 'success' })
  finish()
  await navigateTo('/adm')
}
</script>

<template>
  <section class="min-h-screen bg-[url('/fundo.jpeg')] bg-cover bg-center bg-no-repeat">
    <div class="mx-auto flex min-h-screen flex-col items-center justify-center px-6">
      <div class="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 ">
        <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1 class="ms-2 text-xl leading-tight font-bold tracking-tight text-gray-900 md:text-2xl ">
            Explotools - Login
          </h1>
          <UForm :schema="UserSchema" :state="state" class="space-y-4" @submit="login">
            <UFormField label="Email" name="user">
              <UInput v-model="state.user" icon="i-heroicons-user" class="w-full" @keydown.enter="login" />
            </UFormField>

            <UFormField label="Senha" name="senha">
              <UInput v-model="state.senha" icon="i-heroicons-key" class="w-full" :type="show ? 'text' : 'password'" @keydown.enter="login">
                <template #trailing>
                  <UButton color="neutral" variant="link" size="sm" :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'" :aria-label="show ? 'Esconder senha' : 'Ver senha'" :aria-pressed="show" aria-controls="password" @click="show = !show" />
                </template>
              </UInput>
            </UFormField>

            <UButton label="Entrar" :loading="isLoading" variant="solid" size="xl" class="w-full justify-center rounded-full text-center transition duration-200 hover:bg-blue-600 " trailing-icon="i-heroicons-arrow-right-end-on-rectangle" @click="login" />
          </UForm>
        </div>
      </div>
    </div>
  </section>
</template>
