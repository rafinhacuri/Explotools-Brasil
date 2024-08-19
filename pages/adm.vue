<script setup lang="ts">
import type { EditLead, Lead } from '~/schemas/lead'
import type { User } from '~/schemas/user'
import { type Id, IdSchema } from '~/schemas/id'
import { EditLeadSchema, LeadSchema } from '~/schemas/lead'
import { UserSchema } from '~/schemas/user'

definePageMeta({
  layout: false,
})

const { clear } = useUserSession()

const toast = useToast()

const { start, finish } = useLoadingIndicator()

const { data: response, refresh: refreshLead } = await useFetch('/api/fetch/lead', { method: 'post' })

const { data: adms, refresh: refreshAdm } = await useFetch('/api/fetch/adm', { method: 'post' })

const filtros = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  nome: { value: null, matchMode: FilterMatchMode.CONTAINS },
  email: { value: null, matchMode: FilterMatchMode.CONTAINS },
  telefone: { value: null, matchMode: FilterMatchMode.CONTAINS },
  empresa: { value: null, matchMode: FilterMatchMode.CONTAINS },
  cargo: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

async function sair(){
  await clear()
  navigateTo('/login')
  toast.add({ severity: 'success', summary: `Deslogado`, detail: 'Você foi deslogado com sucesso!', life: 10000 })
}

const modalInsertUser = ref(false)
const novoAdm = ref<User>({ user: '', senha: '' })

async function insertAdm(){
  start()

  const body = UserSchema.safeParse(novoAdm.value)
  if(!body.success){
    toast.add({ severity: 'error', detail: body.error.errors[0].message, summary: 'Erro', life: 10000 })
    return finish()
  }

  const res = await $fetch('/api/insert/user', { method: 'post', body: body.data })
    .catch(error => { toast.add({ severity: 'error', detail: error.data.message, summary: 'Erro', life: 10000 }) })

  finish({ error: true })

  if(!res) return finish({ error: true })

  await refreshAdm()
  modalInsertUser.value = false
  toast.add({ severity: 'success', detail: res, summary: 'Sucesso', life: 10000 })
}

watch(modalInsertUser, nv => {
  if(!nv) novoAdm.value = { user: '', senha: '' }
})

const modalDelet = ref(false)
const deletAdm = ref<Id>({ _id: '' })

function getId(id: string){
  modalDelet.value = true
  deletAdm.value._id = id
}

async function confirmDelete(){
  start()

  const body = IdSchema.safeParse(deletAdm.value)

  if(!body.success){
    finish({ error: true })
    return toast.add({ severity: 'error', detail: body.error.errors[0].message, summary: 'Erro', life: 10000 })
  }

  const res = await $fetch(`/api/delete/user`, { method: 'post', body: body.data })
    .catch(error => { toast.add({ severity: 'error', summary: 'Erro genérico', detail: error.data.message, life: 10000 }) })

  if(!res) return finish({ error: true })

  await refreshAdm()
  modalDelet.value = false
  finish()
  return toast.add({ severity: 'success', detail: res, summary: 'Sucesso', life: 10000 })
}

watch(modalDelet, nv => {
  if(!nv) deletAdm.value = { _id: '' }
})

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
    finish({ error: true })
    return toast.add({ severity: 'error', detail: body.error.errors[0].message, summary: 'Erro', life: 10000 })
  }

  const res = await $fetch(`/api/delete/lead`, { method: 'post', body: body.data })
    .catch(error => { toast.add({ severity: 'error', summary: 'Erro genérico', detail: error.data.message, life: 10000 }) })

  if(!res) return finish({ error: true })

  await refreshLead()
  modalDeletLead.value = false
  finish()
  return toast.add({ severity: 'success', detail: res, summary: 'Sucesso', life: 10000 })
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
    finish({ error: true })
    return toast.add({ severity: 'error', detail: body.error.errors[0].message, summary: 'Erro', life: 10000 })
  }

  const res = await $fetch(`/api/update/lead`, { method: 'post', body: body.data })
    .catch(error => { toast.add({ severity: 'error', summary: 'Erro genérico', detail: error.data.message, life: 10000 }) })

  if(!res) return finish({ error: true })

  await refreshLead()
  modalEditLead.value = false
  finish()
  return toast.add({ severity: 'success', detail: res, summary: 'Sucesso', life: 10000 })
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
    toast.add({ severity: 'error', detail: body.error.errors[0].message, summary: 'Erro', life: 10000 })
    return finish({ error: true })
  }

  const res = await $fetch('/api/insert/lead', { method: 'POST', body: body.data })
    .catch(error => { toast.add({ severity: 'error', detail: error.data.message, summary: 'Erro', life: 10000 }) })

  if(!res) return finish({ error: true })

  finish()
  refreshLead()
  modalInsertLead.value = false
  return toast.add({ severity: 'success', detail: res, summary: 'Sucesso', life: 10000 })
}
</script>

<template>
  <section class=" h-full min-h-[calc(100vh-0px)] bg-slate-900">
    <div class="p-5">
      <div class="flex items-center justify-end px-7 py-5">
        <div class="rounded-md transition-all duration-500 ease-in-out hover:bg-slate-500">
          <Button v-tooltip.bottom="'Deslogar'" class="p-1" @click="sair">
            <template #icon>
              <Icon name="i-heroicons-arrow-left-on-rectangle" color="white" size="30" />
            </template>
          </Button>
        </div>
      </div>

      <Panel header="Leads" toggleable>
        <div class="flex items-end justify-end px-7">
          <Button v-tooltip.top="'Adicionar Lead'" class="rounded-full bg-blue-500 p-1" @click="modalInsertLead = true">
            <template #icon>
              <Icon name="pepicons-pop:plus" color="white" size="30" />
            </template>
          </Button>
        </div>
        <DataTable v-model:filters="filtros" :value="response" paginator :rows="10" :rows-per-page-options="[5, 10, 20, 50]" removable-sort :table-style="{ 'min-width': '50rem' }" filter-display="menu">
          <Column field="nome" header="Nome" sortable>
            <template #body="{ data }">
              <span class="text-sm">{{ data.nome }}</span>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" placeholder="Nome" @input="filterCallback()" />
            </template>
          </Column>
          <Column field="email" header="Email" sortable>
            <template #body="{ data }">
              <span class="text-sm">{{ data.email }}</span>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" placeholder="Email" @input="filterCallback()" />
            </template>
          </Column>
          <Column field="telefone" header="Telefone" sortable>
            <template #body="{ data }">
              <span class="text-sm">{{ data.telefone }}</span>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" placeholder="Telefone" @input="filterCallback()" />
            </template>
          </Column>
          <Column field="empresa" header="Empresa" sortable>
            <template #body="{ data }">
              <span class="text-sm">{{ data.empresa }}</span>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" placeholder="Empresa" @input="filterCallback()" />
            </template>
          </Column>
          <Column field="cargo" header="cargo" sortable>
            <template #body="{ data }">
              <span class="text-sm">{{ data.cargo }}</span>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" placeholder="cargo" @input="filterCallback()" />
            </template>
          </Column>

          <Column header="Ações">
            <template #body="{ data }">
              <div class="space-x-2 ">
                <Button v-tooltip.top="'Deletar lead'" class="rounded-full bg-red-500 p-1 tracking-wider text-white" @click="getIdLead(data._id, data.nome)">
                  <template #icon>
                    <Icon name="pepicons-pop:trash" color="white" size="30" />
                  </template>
                </Button>
                <Button v-tooltip.top="'Editar Lead'" class="rounded-full bg-blue-500 p-1" @click="getLead(data._id, data.nome, data.email, data.telefone, data.empresa, data.cargo)">
                  <template #icon>
                    <Icon name="pepicons-pop:pen" color="white" size="30" />
                  </template>
                </Button>
              </div>
            </template>
          </Column>
        </DataTable>
        <Button v-if="response && response.length >= 1" label="Baixar planilha" class="rounded-lg bg-blue-500 p-3 tracking-wider text-white" @click="navigateTo(`/lead.xlsx`, { open: { target: '_blank' } })">
          <template #icon>
            <Icon name="pepicons-pop:cloud-down" color="white" size="30" />
          </template>
        </Button>
      </Panel>
      <Panel class="mt-8" header="administradores" toggleable>
        <div class="flex items-end justify-end px-7">
          <Button v-tooltip.top="'Adicionar Adm'" class="rounded-full bg-blue-500 p-1" @click="modalInsertUser = true">
            <template #icon>
              <Icon name="pepicons-pop:plus" color="white" size="30" />
            </template>
          </Button>
        </div>
        <DataTable v-model:filters="filtros" :value="adms" paginator :rows="10" :rows-per-page-options="[5, 10, 20, 50]" removable-sort :table-style="{ 'min-width': '50rem' }" filter-display="menu">
          <Column field="user" header="Adiministradores" sortable>
            <template #body="{ data }">
              <span class="text-sm">{{ data.user }}</span>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" placeholder="Adiministradores" @input="filterCallback()" />
            </template>
          </Column>
          <Column header="Ações">
            <template #body="{ data }">
              <div class="space-x-2 ">
                <Button v-tooltip.top="'Deletar Adm'" class="rounded-full bg-red-500 p-1 tracking-wider text-white" @click="getId(data._id)">
                  <template #icon>
                    <Icon name="pepicons-pop:trash" color="white" size="30" />
                  </template>
                </Button>
              </div>
            </template>
          </Column>
        </DataTable>
      </Panel>
    </div>

    <Dialog v-model:visible="modalInsertUser" modal class="w-[50rem]" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <template #container>
        <div class="flex flex-col items-center rounded-md bg-white p-5">
          <div class="-mt-16 inline-flex size-24 items-center justify-center rounded-full bg-blue-500">
            <Icon name="pepicons-pop:plus" color="white" size="3rem" />
          </div>
          <span class="mb-2 mt-4 block text-center text-2xl font-bold">Inserir novo administrador</span>
          <div class="space-y-6">
            <div>
              <label for="idcbpf" class="block text-sm font-medium text-gray-700">Email</label>
              <InputText id="email" v-model="novoAdm.user" type="text" class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label for="senha" class="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <InputText id="senha" v-model="novoAdm.senha" type="password" class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div class="flex items-center justify-center space-x-5">
            <Button label="Confirmar" class="m-6 bg-blue-100 p-3 tracking-wider " severity="info" raised @click="insertAdm()" />
            <Button label="Cancelar" class="m-6 bg-blue-100 p-3 tracking-wider " severity="info" raised outlined @click="modalInsertUser = false" />
          </div>
        </div>
      </template>
    </Dialog>
    <Dialog v-model:visible="modalDelet" modal class="w-[50rem]" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <template #container>
        <div class="flex flex-col items-center rounded-md bg-white p-5">
          <div class="-mt-16 inline-flex size-24 items-center justify-center rounded-full bg-red-500">
            <Icon name="pepicons-pop:trash-circle" color="white" size="3rem" />
          </div>
          <span class="mb-2 mt-4 block text-center text-2xl font-bold">Deletar a página</span>
          <span class="mb-2 mt-4 block text-center text-2xl font-bold">Tem certeza que deseja deletar o administrador ? </span>

          <div class="flex items-center justify-center space-x-5">
            <Button label="Confirmar" class="m-6 bg-blue-100 p-3 tracking-wider " severity="info" raised @click="confirmDelete" />
            <Button label="Cancelar" class="m-6 bg-blue-100 p-3 tracking-wider " severity="info" raised outlined @click="modalDelet = false" />
          </div>
        </div>
      </template>
    </Dialog>
    <Dialog v-model:visible="modalDeletLead" modal class="w-[50rem]" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <template #container>
        <div class="flex flex-col items-center rounded-md bg-white p-5">
          <div class="-mt-16 inline-flex size-24 items-center justify-center rounded-full bg-red-500">
            <Icon name="pepicons-pop:trash-circle" color="white" size="3rem" />
          </div>
          <span class="mb-2 mt-4 block text-center text-2xl font-bold">Deletar a página</span>
          <span class="mb-2 mt-4 block text-center text-2xl font-bold">Tem certeza que deseja deletar o {{ nomeLead }} ? </span>

          <div class="flex items-center justify-center space-x-5">
            <Button label="Confirmar" class="m-6 bg-blue-100 p-3 tracking-wider " severity="info" raised @click="confirmDeleteLead" />
            <Button label="Cancelar" class="m-6 bg-blue-100 p-3 tracking-wider " severity="info" raised outlined @click="modalDeletLead = false" />
          </div>
        </div>
      </template>
    </Dialog>
    <Dialog v-model:visible="modalEditLead" modal class="w-[50rem]" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <template #container>
        <div class="flex flex-col items-center rounded-md bg-white p-5">
          <div class="-mt-16 inline-flex size-24 items-center justify-center rounded-full bg-blue-500">
            <Icon name="pepicons-pop:pen" color="white" size="3rem" />
          </div>
          <span class="mb-2 mt-4 block text-center text-2xl font-bold">Editar Lead</span>
          <div class="grid grid-cols-1 gap-6 pt-5 sm:grid-cols-2 sm:grid-rows-3">
            <FloatLabel>
              <InputText id="nome" v-model="editLead.nome" class=" border-2 border-blue-500 p-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <label for="nome">Nome</label>
            </FloatLabel>
            <FloatLabel>
              <InputText id="email" v-model="editLead.email" class=" border-2 border-blue-500 p-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <label for="email">Email</label>
            </FloatLabel>
            <FloatLabel>
              <InputMask id="telefone" v-model="editLead.telefone" mask="(99) 99999-9999" class=" border-2 border-blue-500 p-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <label for="telefone">Telefone</label>
            </FloatLabel>
            <FloatLabel>
              <InputText id="empresa" v-model="editLead.empresa" class=" border-2 border-blue-500 p-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <label for="empresa">Empresa</label>
            </FloatLabel>
            <FloatLabel>
              <InputText id="Cargo" v-model="editLead.cargo" class=" border-2 border-blue-500 p-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <label for="Cargo">Cargo</label>
            </FloatLabel>
          </div>

          <div class="flex items-center justify-center space-x-5">
            <Button label="Confirmar" class="m-6 bg-blue-100 p-3 tracking-wider " severity="info" raised @click="confirmEdit" />
            <Button label="Cancelar" class="m-6 bg-blue-100 p-3 tracking-wider " severity="info" raised outlined @click="modalEditLead = false" />
          </div>
        </div>
      </template>
    </Dialog>

    <Dialog v-model:visible="modalInsertLead" modal class="w-[50rem]" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <template #container>
        <div class="flex flex-col items-center rounded-md bg-white p-5">
          <div class="-mt-16 inline-flex size-24 items-center justify-center rounded-full bg-blue-500">
            <Icon name="pepicons-pop:pen" color="white" size="3rem" />
          </div>
          <span class="mb-2 mt-4 block text-center text-2xl font-bold">Adicionar Lead</span>
          <div class="grid grid-cols-1 gap-6 pt-5 sm:grid-cols-2 sm:grid-rows-3">
            <FloatLabel>
              <InputText id="nome" v-model="newLead.nome" class=" border-2 border-blue-500 p-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <label for="nome">Nome</label>
            </FloatLabel>
            <FloatLabel>
              <InputText id="email" v-model="newLead.email" class=" border-2 border-blue-500 p-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <label for="email">Email</label>
            </FloatLabel>
            <FloatLabel>
              <InputMask id="telefone" v-model="newLead.telefone" mask="(99) 99999-9999" class=" border-2 border-blue-500 p-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <label for="telefone">Telefone</label>
            </FloatLabel>
            <FloatLabel>
              <InputText id="empresa" v-model="newLead.empresa" class=" border-2 border-blue-500 p-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <label for="empresa">Empresa</label>
            </FloatLabel>
            <FloatLabel>
              <InputText id="Cargo" v-model="newLead.cargo" class=" border-2 border-blue-500 p-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <label for="Cargo">Cargo</label>
            </FloatLabel>
          </div>

          <div class="flex items-center justify-center space-x-5">
            <Button label="Confirmar" class="m-6 bg-blue-100 p-3 tracking-wider " severity="info" raised @click="salvarLead" />
            <Button label="Cancelar" class="m-6 bg-blue-100 p-3 tracking-wider " severity="info" raised outlined @click="modalInsertLead = false" />
          </div>
        </div>
      </template>
    </Dialog>
  </section>
</template>
