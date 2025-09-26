<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { vMaska } from 'maska/vue'

definePageMeta({
  layout: false,
  colorMode: 'dark',
})

const { clear } = useUserSession()

const toast = useToast()

const { start, finish, isLoading } = useLoadingIndicator()

interface LeadId{
  _id: string,
  nome: string,
  email: string,
  telefone: string,
  empresa: string,
  cargo: string,
}

const { data: response, refresh: refreshLead } = await useFetch('/api/fetch/lead', { method: 'post', default: () => [] as LeadId[] })

const isMobile = useMediaQuery('(max-width: 768px)')
const globalFilter = ref('')
const page = ref(1)
const itemsPerPage = ref(10)

watch(globalFilter, () => page.value = 1)

const paginated = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return response.value.slice(start, end)
})

const UButton = resolveComponent('UButton')
const UTooltip = resolveComponent('UTooltip')

const columns: TableColumn<LeadId>[] = [
  {
    accessorKey: 'nome',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, { color: 'neutral', variant: 'ghost', label: 'nome', icon: isSorted ? isSorted === 'asc' ? 'i-heroicons-bars-arrow-up' : 'i-heroicons-bars-arrow-down' : 'i-heroicons-arrows-up-down', class: '-mx-2.5', onClick: () => column.toggleSorting(column.getIsSorted() === 'asc') })
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, { color: 'neutral', variant: 'ghost', label: 'Email', icon: isSorted ? isSorted === 'asc' ? 'i-heroicons-bars-arrow-up' : 'i-heroicons-bars-arrow-down' : 'i-heroicons-arrows-up-down', class: '-mx-2.5', onClick: () => column.toggleSorting(column.getIsSorted() === 'asc') })
    },
  },
  {
    accessorKey: 'telefone',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, { color: 'neutral', variant: 'ghost', label: 'Telefone', icon: isSorted ? isSorted === 'asc' ? 'i-heroicons-bars-arrow-up' : 'i-heroicons-bars-arrow-down' : 'i-heroicons-arrows-up-down', class: '-mx-2.5', onClick: () => column.toggleSorting(column.getIsSorted() === 'asc') })
    },
  },
  {
    accessorKey: 'empresa',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, { color: 'neutral', variant: 'ghost', label: 'Empresa', icon: isSorted ? isSorted === 'asc' ? 'i-heroicons-bars-arrow-up' : 'i-heroicons-bars-arrow-down' : 'i-heroicons-arrows-up-down', class: '-mx-2.5', onClick: () => column.toggleSorting(column.getIsSorted() === 'asc') })
    },
  },
  {
    accessorKey: 'cargo',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, { color: 'neutral', variant: 'ghost', label: 'Telefone', icon: isSorted ? isSorted === 'asc' ? 'i-heroicons-bars-arrow-up' : 'i-heroicons-bars-arrow-down' : 'i-heroicons-arrows-up-down', class: '-mx-2.5', onClick: () => column.toggleSorting(column.getIsSorted() === 'asc') })
    },
  },
  {
    accessorKey: 'actions',
    header: 'Ações',
    cell: ({ row }) => h('div', { class: 'flex space-x-2' }, [
      h(UTooltip, { text: 'Deletar lead', delayDuration: 0 }, () => h(UButton, { color: 'error', variant: 'soft', class: 'rounded-full', icon: 'i-heroicons-trash', onClick: () => getIdLead(row.original._id, row.original.nome) })),

      h(UTooltip, { text: 'Editar lead', delayDuration: 0 }, () => h(UButton, { color: 'blue', variant: 'soft', class: 'rounded-full', icon: 'i-heroicons-pencil', onClick: () => getLead(row.original._id, row.original.nome, row.original.email, row.original.telefone, row.original.empresa, row.original.cargo) })),
    ]),
  },

]

async function sair(){
  await clear()
  await navigateTo('/login')
  toast.add({ title: 'Deslogado com sucesso', icon: 'i-heroicons-check-badge', color: 'success' })
}

const modalDeletLead = ref(false)
const nomeLead = ref('')
const deletLead = ref<Id>({ _id: '' })

function getIdLead(id: string, nome: string){
  modalDeletLead.value = true
  deletLead.value = { _id: id }
  nomeLead.value = nome
}

async function confirmDeleteLead(){
  start()

  const body = IdSchema.safeParse(deletLead.value)

  if(!body.success){
    toast.add({ title: body.error.issues[0]?.message || '', icon: 'i-heroicons-exclamation-triangle', color: 'error' })
    return finish({ error: true })
  }

  const res = await $fetch(`/api/delete/lead`, { method: 'post', body: body.data })
    .catch(error => { toast.add({ title: error.data.message, icon: 'i-heroicons-exclamation-triangle', color: 'error' }) })

  if(!res) return finish({ error: true })

  await refreshLead()
  modalDeletLead.value = false
  finish()
  return toast.add({ title: res, icon: 'i-heroicons-check-badge', color: 'success' })
}

watch(modalDeletLead, nv => {
  if(!nv){
    nomeLead.value = ''
    deletLead.value = { _id: '' }
  }
})

const modalEditLead = ref(false)
const editLead = ref<EditLead>({ _id: '', nome: '', email: '', telefone: '', empresa: '', cargo: '' })

function getLead(_id: string, nome: string, email: string, telefone: string, empresa: string, cargo: string){
  modalEditLead.value = true
  editLead.value = { _id, nome, email, telefone, empresa, cargo }
}

async function confirmEdit(){
  start()

  const body = EditLeadSchema.safeParse(editLead.value)

  if(!body.success){
    toast.add({ title: body.error.issues[0]?.message || '', icon: 'i-heroicons-exclamation-triangle', color: 'error' })
    return finish({ error: true })
  }

  const res = await $fetch(`/api/update/lead`, { method: 'post', body: body.data })
    .catch(error => { toast.add({ title: error.data.message, icon: 'i-heroicons-exclamation-triangle', color: 'error' }) })

  if(!res) return finish({ error: true })

  await refreshLead()
  modalEditLead.value = false
  finish()
  return toast.add({ title: res, icon: 'i-heroicons-check-badge', color: 'success' })
}

watch(modalEditLead, nv => {
  if(!nv){
    editLead.value = { _id: '', nome: '', email: '', telefone: '', empresa: '', cargo: '' }
  }
})

const modalInsertLead = ref(false)
const newLead = ref<Lead>({ nome: '', email: '', telefone: '', empresa: '', cargo: '' })

async function salvarLead(){
  start()

  const body = LeadSchema.safeParse(newLead.value)

  if(!body.success){
    toast.add({ title: body.error.issues[0]?.message || '', icon: 'i-heroicons-exclamation-triangle', color: 'error' })
    return finish({ error: true })
  }

  const res = await $fetch('/api/insert/lead', { method: 'POST', body: body.data })
    .catch(error => { toast.add({ title: error.data.message, icon: 'i-heroicons-exclamation-triangle', color: 'error' }) })

  if(!res) return finish({ error: true })

  finish()
  refreshLead()
  modalInsertLead.value = false
  return toast.add({ title: res, icon: 'i-heroicons-check-badge', color: 'success' })
}
</script>

<template>
  <section class=" h-full min-h-[calc(100vh-0px)] bg-slate-900">
    <div class="p-5">
      <div class="flex items-center justify-end px-7 py-5">
        <div class="rounded-md transition-all duration-500 ease-in-out hover:bg-slate-500">
          <UButton icon="i-heroicons-arrow-left-on-rectangle" variant="ghost" class="p-1 text-white" @click="sair" />
        </div>
      </div>

      <div class="flex items-center justify-between">
        <UInput v-model="globalFilter" placeholder="Pesquisar usuários..." />
        <div class="flex items-center space-x-2">
          <UButton label="Adicionar Lead" variant="soft" icon="i-heroicons-user-plus" class="rounded-full" @click="modalInsertLead = true" />
          <UButton label="Baixar planilha" variant="soft" color="info" icon="i-heroicons-cloud" class="rounded-full" @click="navigateTo(`/lead.xlsx`, { open: { target: '_blank' } })" />
        </div>
      </div>
      <UTable v-model:global-filter="globalFilter" empty="Lead não encontrado" :data="paginated" :columns="columns" />
      <UPagination v-if="response.length > itemsPerPage" v-model:page="page" class="mt-6" active-color="primary" active-variant="subtle" :total="response.length" :items-per-page="itemsPerPage" :show-edges="!isMobile" />
    </div>

    <UModal v-model:open="modalDeletLead" title="Deletar o Usuario" description="Ao confirmar não tem como desfazer ação" :ui="{ footer: 'justify-end' }">
      <template #body>
        <span class="mt-4 mb-2 block text-center text-2xl font-bold">Tem certeza que deseja deletar o {{ nomeLead }} ? </span>
      </template>

      <template #footer>
        <UButton label="Cancelar" :loading="isLoading" variant="outline" @click="modalDeletLead = false" />
        <UButton label="Confirmar" :loading="isLoading" @click="confirmDeleteLead" />
      </template>
    </UModal>

    <UModal v-model:open="modalEditLead" title="Editar o Usuario" description="Ao confirmar não tem como desfazer ação" :ui="{ footer: 'justify-end' }">
      <template #body>
        <div class="grid grid-cols-1 gap-6 pt-5 sm:grid-cols-2 sm:grid-rows-3">
          <div class="flex flex-col">
            <label for="nome">Nome</label>
            <UInput id="nome" v-model="editLead.nome" />
          </div>
          <div class="flex flex-col">
            <label for="email">Email</label>
            <UInput id="email" v-model="editLead.email" />
          </div>
          <div class="flex flex-col">
            <label for="telefone">Telefone</label>
            <UInput id="telefone" v-model="editLead.telefone" v-maska="'(##) #####-####'" placeholder="(99) 99999-9999" mask="(99) 99999-9999" />
          </div>
          <div class="flex flex-col">
            <label for="empresa">Empresa</label>
            <UInput id="empresa" v-model="editLead.empresa" />
          </div>
          <div class="flex flex-col">
            <label for="Cargo">Cargo</label>
            <UInput id="Cargo" v-model="editLead.cargo" />
          </div>
        </div>
      </template>

      <template #footer>
        <UButton label="Cancelar" :loading="isLoading" variant="outline" @click="modalEditLead = false" />
        <UButton label="Confirmar" :loading="isLoading" @click="confirmEdit" />
      </template>
    </UModal>

    <UModal v-model:open="modalInsertLead" title="Inserir o Usuario" :ui="{ footer: 'justify-end' }">
      <template #body>
        <div class="grid grid-cols-1 gap-6 pt-5 sm:grid-cols-2 sm:grid-rows-3">
          <div class="flex flex-col">
            <label for="nome">Nome</label>
            <UInput id="nome" v-model="newLead.nome" />
          </div>
          <div class="flex flex-col">
            <label for="email">Email</label>
            <UInput id="email" v-model="newLead.email" />
          </div>
          <div class="flex flex-col">
            <label for="telefone">Telefone</label>
            <UInput id="telefone" v-model="newLead.telefone" v-maska="'(##) #####-####'" placeholder="(99) 99999-9999" mask="(99) 99999-9999" />
          </div>
          <div class="flex flex-col">
            <label for="empresa">Empresa</label>
            <UInput id="empresa" v-model="newLead.empresa" />
          </div>
          <div class="flex flex-col">
            <label for="Cargo">Cargo</label>
            <UInput id="Cargo" v-model="newLead.cargo" />
          </div>
        </div>
      </template>

      <template #footer>
        <UButton label="Cancelar" :loading="isLoading" variant="outline" @click="modalInsertLead = false" />
        <UButton label="Confirmar" :loading="isLoading" @click="salvarLead" />
      </template>
    </UModal>
  </section>
</template>
