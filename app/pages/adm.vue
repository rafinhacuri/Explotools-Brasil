<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { getPaginationRowModel } from '@tanstack/vue-table'
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
  recomendacoes: { date: string, link: string }[],
}

const { data: response, refresh: refreshLead } = await useFetch('/api/fetch/lead', { method: 'post', default: () => [] as LeadId[] })

const globalFilter = ref('')

const table = useTemplateRef('table')

const pagination = ref({ pageIndex: 0, pageSize: 10 })

watch(globalFilter, () => {
  pagination.value.pageIndex = 0
})

const UButton = resolveComponent('UButton')
const UTooltip = resolveComponent('UTooltip')
const UBadge = resolveComponent('UBadge')

const columns: TableColumn<LeadId>[] = [
  {
    id: 'expand',
    cell: ({ row }) => h(UButton, { 'color': 'neutral', 'variant': 'ghost', 'icon': 'i-lucide-chevron-down', 'square': true, 'aria-label': 'Expand', 'ui': { leadingIcon: ['transition-transform', row.getIsExpanded() ? 'duration-200 rotate-180' : ''] }, 'onClick': () => row.toggleExpanded() }),
  },
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
    id: 'numeroRecomendacoes',
    accessorFn: (row: LeadId) => row.recomendacoes?.length ?? 0,
    sortDescFirst: true,
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, { color: 'neutral', variant: 'ghost', label: 'Recomendações', icon: isSorted ? (isSorted === 'asc' ? 'i-heroicons-bars-arrow-up' : 'i-heroicons-bars-arrow-down') : 'i-heroicons-arrows-up-down', class: '-mx-2.5', onClick: () => column.toggleSorting(column.getIsSorted() === 'asc') })
    },
    cell: ({ getValue }) => h(UBadge, { color: 'info', variant: 'soft', class: 'rounded-full px-3 py-1 text-sm font-medium' }, { default: () => String(getValue() as number) }),
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

const expanded = ref({})

async function sair(){
  await clear()
  toast.add({ title: 'Deslogado com sucesso', icon: 'i-heroicons-check-badge', color: 'success' })
  return navigateTo('/login')
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
      <UTable ref="table" v-model:expanded="expanded" v-model:global-filter="globalFilter" v-model:pagination="pagination" empty="Lead não encontrado" :pagination-options="{ getPaginationRowModel: getPaginationRowModel()}" :data="response" :columns="columns">
        <template #expanded="{ row }">
          <div class="relative my-4 pl-7">
            <div class="absolute top-0 bottom-0 left-3 w-px bg-gradient-to-b from-sky-400/60 via-purple-400/60 to-pink-400/60" />

            <div v-if="!row.original.recomendacoes?.length" class="rounded-xl border border-white/10 bg-slate-800/60 p-4 text-sm text-slate-300 backdrop-blur">
              <span class="i-heroicons-information-circle-20-solid mr-2" />
              Sem recomendações para este lead.
            </div>

            <div v-for="(rec, index) in row.original.recomendacoes" :key="index" class="group relative mb-4 rounded-xl border border-white/10 bg-gradient-to-br from-slate-800/70 to-slate-900/70 p-4 shadow-lg ring-1 ring-white/5 backdrop-blur transition hover:shadow-xl">
              <span aria-hidden="true" class="absolute top-5 -left-[22px] inline-block h-3 w-3 rounded-full bg-gradient-to-r from-sky-400 to-fuchsia-500 ring-4 ring-slate-900" />
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div class="flex items-center gap-2 text-white">
                  <span class="i-heroicons-calendar-days-20-solid opacity-70" />
                  <NuxtTime :datetime="rec.date" month="2-digit" year="2-digit" day="2-digit" minute="2-digit" hour="2-digit" />
                </div>
                <div class="flex items-center gap-2">
                  <UBadge size="sm" color="primary" variant="soft" class="uppercase">
                    Recomendação #{{ index + 1 }}
                  </UBadge>
                  <UButton size="xs" color="info" variant="soft" icon="i-heroicons-link-20-solid" :to="rec.link" target="_blank" label="Acessar" />
                </div>
              </div>
              <div class="mt-3 flex items-center gap-2 text-sm text-white/80">
                <UIcon name="i-heroicons-globe-alt-20-solid" />
                <NuxtLink :to="rec.link" target="_blank" class="max-w-full truncate text-blue-300 underline decoration-dotted hover:text-blue-200 md:max-w-[60ch]">
                  Acessar recomendação
                </NuxtLink>
              </div>
            </div>
          </div>
        </template>
      </UTable>
      <div class="border-default flex justify-center border-t pt-4">
        <UPagination :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1" :items-per-page="table?.tableApi?.getState().pagination.pageSize" :total="table?.tableApi?.getFilteredRowModel().rows.length" @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)" />
      </div>
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
