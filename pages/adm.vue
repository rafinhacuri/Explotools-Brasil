<script setup lang="ts">
const { data: response } = await useFetch('/api/fetch/leads', { method: 'post'})

const filtros = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  nome: { value: null, matchMode: FilterMatchMode.CONTAINS },
  email: { value: null, matchMode: FilterMatchMode.CONTAINS },
  telefone: { value: null, matchMode: FilterMatchMode.CONTAINS },
  empresa: { value: null, matchMode: FilterMatchMode.CONTAINS },
  cargo: { value: null, matchMode: FilterMatchMode.CONTAINS },
})
</script>

<template>
  <section>
    <div class="p-5">
      <DataTable v-model:filters="filtros" :value="response.inscritos" paginator :rows="10" :rows-per-page-options="[5, 10, 20, 50]" size="small" removable-sort :table-style="{ 'min-width': '50rem' }" filter-display="menu">
        <Column field="name" header="Nome" sortable>
          <template #body="{ data }">
            <span class="text-sm">{{ data.name }}</span>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" placeholder="Nome" @input="filterCallback()" />
          </template>
        </Column>
        <Column field="cpfOrPassport" header="cpfOrPassport" sortable>
          <template #body="{ data }">
            <span class="text-sm">{{ data.cpfOrPassport }}</span>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" placeholder="cpfOrPassport" @input="filterCallback()" />
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
        <Column field="instituicao" header="Instituição" sortable>
          <template #body="{ data }">
            <span class="text-sm">{{ data.instituicao }}</span>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" placeholder="Instituição" @input="filterCallback()" />
          </template>
        </Column>
        <Column field="state" header="State" sortable>
          <template #body="{ data }">
            <span class="text-sm">{{ data.state }}</span>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" placeholder="State" @input="filterCallback()" />
          </template>
        </Column>
        <Column field="zip" header="Zip" sortable>
          <template #body="{ data }">
            <span class="text-sm">{{ data.zip }}</span>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" placeholder="Zip" @input="filterCallback()" />
          </template>
        </Column>
      </DataTable>
    </div>
  </section>
</template>
