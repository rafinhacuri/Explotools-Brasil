<script setup lang="ts">
useHead({ title: `Login` })

definePageMeta({
  layout: false,
})

defineOgImageComponent('NuxtSeo', { theme: '#3FA1B0', colorMode: 'dark' })

const toast = useToast()

const { start, finish } = useLoadingIndicator()

const state = ref<User>({ user: '', senha: '' })

async function login(){
  start()

  const body = UserSchema.safeParse(state.value)
  if(!body.success){
    toast.add({ severity: 'error', detail: body.error.errors[0]?.message || '', summary: 'Erro', life: 10000 })
    return finish()
  }

  const res = await $fetch('/auth', { method: 'post', body: body.data })
    .catch(error => { toast.add({ severity: 'error', detail: error.data.message, summary: 'Erro', life: 10000 }) })

  finish({ error: true })

  if(!res) return finish({ error: true })

  toast.add({ severity: 'success', detail: res, summary: 'Sucesso', life: 10000 })
  finish()
  await navigateTo('/adm')
}
</script>

<template>
  <section class="min-h-screen bg-[url('/fundo.jpeg')] bg-cover bg-center bg-no-repeat">
    <div class="mx-auto flex min-h-screen flex-col items-center justify-center px-6">
      <div class="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 ">
        <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1 class="ms-2 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
            Explotools - Login
          </h1>
          <div class="space-y-6">
            <div>
              <label for="idcbpf" class="block text-sm font-medium text-gray-700">Email</label>
              <InputText id="email" v-model="state.user" type="text" class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" @keydown.enter="login" />
            </div>

            <div>
              <label for="senha" class="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <InputText id="senha" v-model="state.senha" type="password" class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" @keydown.enter="login" />
            </div>
            <Button label="Entrar" class="mt-6 w-full rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600" @click="login" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
