<script setup lang="ts">
const nome = ref('')
const email = ref('')
const telefone = ref('')
const empresa = ref('')
const cargo = ref('')
</script>

<template>
  <section class="relative min-h-screen">
    <div class="absolute inset-0 z-0 bg-[url('/fundo.jpg')] bg-cover bg-fixed bg-center bg-no-repeat blur-sm" />
    <div class="relative z-10">
      <div class="flex items-center justify-center">
        <img src="/explotools.png" alt="logo Explotools brasil" class=" h-[500px] w-[700px] ">
      </div>
      <p class=" text-center text-2xl font-extrabold italic tracking-wide text-white">
        Qualidade Internacional, Preços Nacionais: Revolucione Sua Sondagem
      </p>
      <div class=" flex flex-col items-center justify-center">
        <p class="mt-10 max-w-[900px] text-xl font-semibold text-white">
          Um dos <span class="text-red-500">maiores</span> desafios enfrentados pelas empresas de sondagem rotativa diamantada no Brasil é o <span class=" text-red-500">difícil</span> acesso a materiais de qualidade com preços justos. Muitas vezes, encontram-se produtos importados de alta qualidade, porém com <span class="text-red-500">valores elevados</span>, ou materiais nacionais mais acessíveis, porém de qualidade inferior.
        </p>
        <p class="mt-10 max-w-[900px] text-xl font-semibold text-white">
          Nossa proposta é oferecer <span class="text-green-500">produtos de qualidade</span> importada para sondagem a <span class="text-green-500">preços acessíveis</span>, permitindo uma redução de custos significativa sem comprometer a qualidade e a produtividade
        </p>
        <p class="mt-10 max-w-[900px] text-xl font-semibold text-white">
          Como fabricantes, temos controle total sobre o processo, garantindo eficiência e competitividade. Proporcionamos a solução ideal para empresas que buscam <span class="text-green-500">aumentar a produtividade</span> e economizar em suas operações de sondagem, com resultados visíveis em apenas 30 dias de uso
        </p>
      </div>
      <div class="p-12">
        <UCard class="max-w-[500px]">
          <template #header>
            inscreva-se aqui para mais informações
          </template>
          <div class="space-y-4">
            <UInput v-model="nome" color="primary" variant="outline" placeholder="Nome" />
            <UInput v-model="email" color="primary" variant="outline" placeholder="Email" />
            <UInput v-model="telefone" color="primary" variant="outline" placeholder="telefone" />
            <UInput v-model="empresa" color="primary" variant="outline" placeholder="Empresa" />
            <UInput v-model="cargo" color="primary" variant="outline" placeholder="Cargo" />
          </div>
          <template #footer>
            <Placeholder class="h-8" />
          </template>
        </UCard>
      </div>
    </div>
  </section>
</template>
