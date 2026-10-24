<script setup lang="ts">
  import { safeParse } from 'valibot'

  const props = defineProps({
    submit: { type: String, default: 'Quero ter acesso em primeira mão' },
    tone: { type: String as PropType<'dark' | 'light'>, default: 'dark' },
  })

  const emit = defineEmits<{ done: [email: string] }>()

  const text = {
    nome: 'Nome',
    email: 'E-mail',
    telefone: 'Telefone',
    empresa: 'Empresa',
    cargo: 'Cargo',
    wireline: 'Trabalha com o método wireline?',
    yes: 'Sim',
    no: 'Não',
    privacy: 'Usamos seus dados só para falar com você sobre produtos Explotools.',
  }

  const { leadSchema } = useLeadSchema()
  const { errors, collect, clear } = useFormErrors()
  const toast = useToast()
  const loading = ref(false)
  const wireline = ref<'sim' | 'nao' | ''>('')
  const state = ref<LeadSchema>({ nome: '', email: '', telefone: '', empresa: '', cargo: '' })

  watch(
    () => state.value.telefone,
    (value) => {
      const formatted = formatPhone(value)
      if (formatted !== value) state.value.telefone = formatted
    },
  )

  async function save(): Promise<void> {
    const body = safeParse(leadSchema, {
      ...state.value,
      wireline: wireline.value === '' ? undefined : wireline.value === 'sim',
    })
    if (!body.success) {
      collect(body.issues)
      return
    }
    clear()
    loading.value = true
    try {
      const message = await $fetch('/api/leads', { method: 'POST', body: body.output })
      toast.success(message)
      emit('done', body.output.email)
    } catch (error) {
      toast.fail(error)
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <form class="grid gap-4 sm:grid-cols-2" novalidate @submit.prevent="save">
    <Field
      v-model="state.nome"
      :label="text.nome"
      name="nome"
      autocomplete="name"
      :error="errors.nome"
      :tone="props.tone"
      class="sm:col-span-2" />
    <Field
      v-model="state.email"
      :label="text.email"
      name="email"
      type="email"
      inputmode="email"
      autocomplete="email"
      :error="errors.email"
      :tone="props.tone" />
    <Field
      v-model="state.telefone"
      :label="text.telefone"
      name="telefone"
      type="tel"
      inputmode="tel"
      autocomplete="tel"
      placeholder="(31) 99999-9999"
      :error="errors.telefone"
      :tone="props.tone" />
    <Field
      v-model="state.empresa"
      :label="text.empresa"
      name="empresa"
      autocomplete="organization"
      :error="errors.empresa"
      :tone="props.tone" />
    <Field
      v-model="state.cargo"
      :label="text.cargo"
      name="cargo"
      autocomplete="organization-title"
      :error="errors.cargo"
      :tone="props.tone" />

    <div class="flex flex-col gap-2 sm:col-span-2">
      <span
        id="lead-wireline"
        class="text-[0.8125rem] font-medium"
        :class="props.tone === 'dark' ? 'text-fg/80' : 'text-furo/75'">
        {{ text.wireline }}
      </span>
      <RadioGroupRoot
        v-model="wireline"
        aria-labelledby="lead-wireline"
        class="grid grid-cols-2 gap-2">
        <RadioGroupItem
          v-for="option in [
            { value: 'sim', label: text.yes },
            { value: 'nao', label: text.no },
          ]"
          :key="option.value"
          :value="option.value"
          class="flex h-12 items-center justify-center gap-2 rounded-xl border text-[0.9375rem] font-medium transition-colors data-[state=checked]:border-red data-[state=checked]:bg-red data-[state=checked]:text-osso"
          :class="
            props.tone === 'dark'
              ? 'border-line-strong text-fg/80 hover:border-fg/40'
              : 'border-furo/15 bg-white text-furo/80 hover:border-furo/35'
          ">
          {{ option.label }}
        </RadioGroupItem>
      </RadioGroupRoot>
    </div>

    <div class="flex flex-col gap-3 sm:col-span-2">
      <Btn type="submit" size="lg" :loading="loading" trailing="ph:arrow-right" class="w-full">{{
        props.submit
      }}</Btn>
      <p
        class="flex items-center gap-2 text-[0.75rem]"
        :class="props.tone === 'dark' ? 'text-faint' : 'text-furo/50'">
        <Icon name="ph:lock-simple" class="size-3.5" />
        {{ text.privacy }}
      </p>
    </div>
  </form>
</template>
