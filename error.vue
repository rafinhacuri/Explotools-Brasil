<script setup lang="ts">
const error = useError()

const statusCode = ref(500)
const message = ref('Something went wrong...')

if(error.value && 'statusCode' in error.value && 'message' in error.value){
  statusCode.value = error.value.statusCode
  message.value = error.value.message
}

useHead({
  title: `${statusCode.value}`,
})
</script>

<template>
  <section>
    <div class="mx-auto flex min-h-[calc(100vh-131px)] flex-col items-center justify-center px-8">
      <div class="w-full rounded-lg bg-gray-50 shadow sm:max-w-5xl">
        <div class="space-y-4 p-8 text-center">
          <h1 class="text-7xl font-bold leading-tight tracking-tight text-red-600">
            {{ statusCode }}
          </h1>
          <p class="text-4xl font-bold leading-tight tracking-tight text-gray-900">
            {{ message }}
          </p>
          <Button label="Voltar" @click="clearError({ redirect: '/' })" />
        </div>
      </div>
    </div>
  </section>
</template>
