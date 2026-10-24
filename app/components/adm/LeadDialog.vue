<script setup lang="ts">
  import { safeParse } from 'valibot'

  const props = defineProps({
    lead: { type: Object as PropType<LeadRow | null>, default: null },
  })

  const emit = defineEmits<{ saved: [] }>()
  const open = defineModel<boolean>('open', { default: false })

  const text = {
    create: 'Adicionar lead',
    edit: 'Editar lead',
    createLede: 'Cadastre um contato manualmente.',
    editLede: 'As recomendações do lead acompanham a troca de e-mail.',
    nome: 'Nome',
    email: 'E-mail',
    telefone: 'Telefone',
    empresa: 'Empresa',
    cargo: 'Cargo',
    wireline: 'Trabalha com wireline?',
    yes: 'Sim',
    no: 'Não',
    unknown: 'Não informado',
    save: 'Salvar',
    add: 'Adicionar',
  }

  const { leadSchema } = useLeadSchema()
  const { errors, collect, clear } = useFormErrors()
  const toast = useToast()
  const loading = ref(false)
  const wireline = ref<'sim' | 'nao' | ''>('')
  const state = ref<LeadSchema>({ nome: '', email: '', telefone: '', empresa: '', cargo: '' })

  watch(open, (value) => {
    if (!value) return
    clear()
    const { lead } = props
    state.value = {
      nome: lead?.nome ?? '',
      email: lead?.email ?? '',
      telefone: lead?.telefone ?? '',
      empresa: lead?.empresa ?? '',
      cargo: lead?.cargo ?? '',
    }
    wireline.value = ''
    if (lead?.wireline !== undefined) wireline.value = lead.wireline ? 'sim' : 'nao'
  })

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
    loading.value = true
    try {
      const message = props.lead
        ? await $fetch<string>(`/api/leads/${props.lead._id}`, { method: 'PUT', body: body.output })
        : await $fetch('/api/leads', { method: 'POST', body: body.output })
      toast.success(message)
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
  <AdmModal
    v-model:open="open"
    wide
    :title="props.lead ? text.edit : text.create"
    :description="props.lead ? text.editLede : text.createLede">
    <form class="grid gap-4 sm:grid-cols-2" novalidate @submit.prevent="save">
      <Field
        v-model="state.nome"
        :label="text.nome"
        name="nome"
        :error="errors.nome"
        class="sm:col-span-2" />
      <Field
        v-model="state.email"
        :label="text.email"
        name="email"
        type="email"
        :error="errors.email" />
      <Field
        v-model="state.telefone"
        :label="text.telefone"
        name="telefone"
        type="tel"
        :error="errors.telefone" />
      <Field v-model="state.empresa" :label="text.empresa" name="empresa" :error="errors.empresa" />
      <Field v-model="state.cargo" :label="text.cargo" name="cargo" :error="errors.cargo" />
      <div class="flex flex-col gap-2 sm:col-span-2">
        <span id="adm-wireline" class="text-[0.8125rem] font-medium text-fg/80">{{
          text.wireline
        }}</span>
        <RadioGroupRoot
          v-model="wireline"
          aria-labelledby="adm-wireline"
          class="grid grid-cols-3 gap-2">
          <RadioGroupItem
            v-for="option in [
              { value: 'sim', label: text.yes },
              { value: 'nao', label: text.no },
              { value: '', label: text.unknown },
            ]"
            :key="option.value"
            :value="option.value"
            class="h-11 rounded-xl border border-line-strong text-[0.875rem] font-medium text-fg/80 transition-colors hover:border-fg/40 data-[state=checked]:border-red data-[state=checked]:bg-red data-[state=checked]:text-osso">
            {{ option.label }}
          </RadioGroupItem>
        </RadioGroupRoot>
      </div>
      <div class="mt-2 flex justify-end sm:col-span-2">
        <Btn type="submit" :loading="loading" icon="ph:check">{{
          props.lead ? text.save : text.add
        }}</Btn>
      </div>
    </form>
  </AdmModal>
</template>
