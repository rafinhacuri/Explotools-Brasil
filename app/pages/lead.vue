<script setup lang="ts">
import { vMaska } from 'maska/vue'

definePageMeta({
  layout: false,
  colorMode: 'dark',
})

useHead({ title: 'Cadastre-se' })

const toast = useToast()

const { start, finish } = useLoadingIndicator()

const images = ref(['/foto1.jpeg', '/foto2.jpeg', '/foto3.jpeg', '/foto4.jpeg', '/foto5.jpeg', '/foto6.jpeg', '/foto7.jpeg', '/foto8.jpeg'])

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
  toast.add({ title: res, icon: 'i-heroicons-check-circle', color: 'success' })
  return navigateTo('/obrigado')
}

const destiny = useTemplateRef<HTMLElement>('destiny')

const { y } = useWindowScroll({ behavior: 'smooth' })

function scrollToDestiny(){
  if(destiny.value){
    y.value = destiny.value.scrollHeight
  }
}
</script>

<template>
  <section class="relative min-h-[calc(100vh-131px)] bg-[url('/fundo.jpeg')]">
    <div class="absolute inset-0 z-0 min-h-[calc(100vh-131px)] bg-[url('/fundo.jpeg')] bg-cover bg-fixed bg-center bg-no-repeat" />
    <div class="relative z-10">
      <div class="flex flex-col items-center justify-center">
        <div class="flex items-center justify-center">
          <NuxtImg src="/explotools.png" alt="logo Explotools brasil" class="mt-7 h-35 w-75 md:h-50 md:w-175" />
        </div>
        <p class=" text-center text-base font-black tracking-wide text-white italic md:text-3xl">
          Qualidade Internacional, Preços Nacionais:<br>
          Revolucione Sua Sondagem
        </p>
        <div class="flex flex-col items-center justify-center p-4">
          <p class="mt-10 max-w-250 text-center text-sm font-semibold text-white md:text-lg">
            Um dos maiores desafios enfrentados pelas <span class="text-[#FD0116]">empresas de sondagem rotativa diamantada</span> no Brasil é o difícil acesso a <span class="text-[#FD0116]">materiais de qualidade com preços justos</span>. Muitas vezes, encontram-se produtos importados de alta qualidade, porém com valores elevados, ou materiais nacionais mais acessíveis, porém de qualidade inferior.
          </p>
          <p class="mt-10 max-w-250 text-center text-sm font-semibold text-white md:text-lg">
            <span class="text-[#FD0116]">Nossa proposta é oferecer produtos de qualidade importada para sondagem a preços acessíveis</span>, permitindo uma redução de custos significativa sem comprometer a qualidade e a produtividade.
          </p>
          <p class="mt-10 max-w-250 text-center text-sm font-semibold text-white md:text-lg">
            Como <span class="text-[#FD0116]">fabricantes</span>, temos controle total sobre o processo, <span class="text-[#FD0116]">garantindo eficiência e competitividade</span>. Proporcionamos a solução ideal para empresas que buscam aumentar a produtividade e economizar em suas operações de sondagem, com resultados visíveis em apenas 30 dias de uso.
          </p>
        </div>

        <div class="grid gap-5 p-12 md:grid-cols-2">
          <div ref="destiny" class="order-2 flex max-w-125 flex-col items-center justify-center space-y-6 rounded-xl bg-zinc-950 p-4 transition-all duration-1000 ease-in-out md:order-1 md:space-y-14">
            <p class="p-3 text-lg font-semibold text-white">
              Inscreva-se aqui para mais informações:
            </p>
            <UForm :schema="LeadSchema" :state="newLead" class="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:grid-rows-3">
              <UFormField label="Nome" name="nome">
                <UInput v-model="newLead.nome" color="error" @keydown.enter="salvarLead" />
              </UFormField>
              <UFormField label="Email" name="email">
                <UInput v-model="newLead.email" color="error" @keydown.enter="salvarLead" />
              </UFormField>
              <UFormField label="Telefone" name="telefone">
                <UInput v-model="newLead.telefone" v-maska="'(##) #####-####'" placeholder="(99) 99999-9999" color="error" @keydown.enter="salvarLead" />
              </UFormField>
              <UFormField label="Empresa" name="empresa">
                <UInput v-model="newLead.empresa" color="error" @keydown.enter="salvarLead" />
              </UFormField>
              <UFormField label="Cargo" name="cargo">
                <UInput v-model="newLead.cargo" color="error" @keydown.enter="salvarLead" />
              </UFormField>
            </UForm>
            <button class=" mb-5 w-72.5 rounded-xl border-2 border-black bg-red-600 px-6 py-2 text-base font-bold tracking-wide text-white transition-all duration-200 ease-in-out hover:bg-red-500" @click="salvarLead()">
              Quero ter acesso a esses produtos em primeira mão!
            </button>
          </div>
          <div data-aos="zoom-in" class="order-1 max-w-125 pb-3 transition-all duration-200 ease-in-out md:order-2">
            <UCarousel v-slot="{ item }" :items="images" loop auto-scroll :ui="{ item: 'basis-2/3' } ">
              <NuxtImg :src="item" width="320" height="320" class="m-auto rounded-lg" alt="Imagem do Produto" />
            </UCarousel>
          </div>
        </div>
      </div>
      <div class="flex flex-col items-center justify-center">
        <div class="max-w-250 rounded-lg pb-10">
          <h2 data-aos="zoom-in" class="pb-5 text-center text-3xl font-bold tracking-wide text-white transition-all duration-1000 ease-in-out">
            Por que se cadastrar?
          </h2>

          <p data-aos="zoom-in" class="py-5 text-center text-base font-semibold text-white transition-all duration-1000 ease-in-out md:text-xl">
            📬 Benefícios Exclusivos ao se Cadastrar:
          </p>
          <ul class="m-3 space-y-5 transition-all duration-1000 ease-in-out md:m-0">
            <li data-aos="zoom-in" class=" text-center text-sm text-white transition-all duration-1000 ease-in-out md:text-base">
              <span class="font-semibold text-[#FD0116]">Ofertas exclusivas: </span>Desfrute de promoções especiais que só encontrará conosco, ajudando a maximizar sua produtividade com economia.
            </li>
            <li data-aos="zoom-in" class=" text-center text-sm text-white transition-all duration-1000 ease-in-out md:text-base">
              <span class="font-semibold text-[#FD0116]">Acesso antecipado aos catálogos: </span>Seja o primeiro a explorar nossos produtos de qualidade, planejando suas operações de sondagem de forma mais eficiente.
            </li>
            <li data-aos="zoom-in" class=" text-center text-sm text-white transition-all duration-1000 ease-in-out md:text-base">
              <span class="font-semibold text-[#FD0116]">Participação em pré-vendas: </span>Garanta prioridade e preços especiais em nossos lançamentos, impulsionando sua produtividade com acesso privilegiado.
            </li>
          </ul>
        </div>

        <div class="max-w-250 rounded-lg pb-10">
          <div>
            <p data-aos="zoom-in" class="py-5 text-center text-base font-semibold text-white transition-all duration-1000 ease-in-out md:text-xl">
              🌟 Vantagens únicas:
            </p>
          </div>

          <ul class="m-3 space-y-5 md:m-0">
            <li data-aos="zoom-in" class="text-center text-sm text-white transition-all duration-1000 ease-in-out md:text-base">
              <span class="font-semibold text-[#FD0116]">Acesso antecipado aos melhores produtos: </span>Seja o primeiro a ter acesso aos produtos de última geração, aumentando sua produtividade antes de todos.
            </li>
            <li data-aos="zoom-in" class="text-center text-sm text-white transition-all duration-1000 ease-in-out md:text-base">
              <span class="font-semibold text-[#FD0116]">Preços exclusivos e condições especiais: </span>Garanta tarifas exclusivas e condições especiais que otimizam seus custos de sondagem, maximizando sua produtividade com economia.
            </li>
            <li data-aos="zoom-in" class="text-center text-sm text-white transition-all duration-1000 ease-in-out md:text-base">
              <span class="font-semibold text-[#FD0116]">Inovações em primeira mão:</span>Seja pioneiro ao aproveitar nossas inovações mais recentes, impulsionando sua produtividade com tecnologias de ponta.
            </li>
          </ul>
          <div class="flex items-center justify-center text-white">
            <button class="my-10 w-95 rounded-full border-2 border-black bg-[#FD0116] px-6 py-2 text-lg font-bold tracking-wide md:transition-all md:duration-200 md:ease-in-out md:hover:w-117.5 md:hover:text-xl" @click="scrollToDestiny">
              Não perca essa chance! <br>
              Cadastre-se agora e saia na frente
            </button>
          </div>
        </div>

        <div class="max-w-250 rounded-lg pb-10">
          <h2 data-aos="zoom-in" class="pb-5 text-center text-2xl font-bold tracking-wide text-white transition-all duration-1000 ease-in-out">
            🔧 Explotools: A escolha certa para empresas que valorizam qualidade, inovação e resultados excepcionais em suas operações de sondagem.
          </h2>

          <ul class="m-3 space-y-5 md:m-0">
            <li data-aos="zoom-in" class="text-center text-sm text-white transition-all duration-1000 ease-in-out md:text-base">
              Como fabricantes, <span class="font-semibold text-[#FD0116]">investimos em alta tecnologia e maquinário computadorizado</span> para assegurar que nossos produtos atendam aos mais <span class="font-semibold text-[#FD0116]">altos padrões de qualidade</span>, impulsionando assim a sua produtividade.
            </li>
            <li data-aos="zoom-in" class="text-center text-sm text-white transition-all duration-1000 ease-in-out md:text-base">
              <span class="font-semibold text-[#FD0116]">Presença global em mais de 13 países</span>, atendendo com excelência às necessidades de clientes em todo o mundo.
            </li>
            <li data-aos="zoom-in" class="text-center text-sm text-white transition-all duration-1000 ease-in-out md:text-base">
              Fundada por um especialista com <span class="font-semibold text-[#FD0116]">mais de 20 anos de experiência</span> no mercado de sondagem, nossa empresa possui um histórico comprovado de sucesso e excelência.
            </li>
            <li data-aos="zoom-in" class="text-center text-sm text-white transition-all duration-1000 ease-in-out md:text-base">
              Todos os nossos <span class="font-semibold text-[#FD0116]">produtos são importados e submetidos a rigorosos padrões de qualidade</span>, garantindo desempenho superior e durabilidade, permitindo que você atinja metas de produtividade de forma consistente e confiável.
            </li>
            <li data-aos="zoom-in" class="text-center text-sm text-white transition-all duration-1000 ease-in-out md:text-base">
              Contamos com uma equipe dedicada de <span class="font-semibold text-[#FD0116]">pesquisa e desenvolvimento</span>, que nos permite permanecer na <span class="font-semibold text-[#FD0116]">vanguarda da inovação</span>, oferecendo sempre as soluções mais avançadas aos nossos clientes, impulsionando assim a sua produtividade com tecnologias de ponta.
            </li>
          </ul>
          <div class="flex items-center justify-center text-white">
            <button class="m-10 mb-32 w-75 rounded-full border-2 border-black bg-[#FD0116] px-6 py-2 text-lg font-bold tracking-wide transition-all duration-200 ease-in-out hover:w-85 hover:text-xl md:my-10" @click="scrollToDestiny">
              Quero aumentar minha produtividade!
            </button>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="flex items-center justify-center">
        <button id="scrollTopButton" class=" fixed bottom-0 z-50 block w-95 rounded-lg border-2 border-black bg-[#FD0116] py-6 text-lg font-bold tracking-wide text-white opacity-0 transition-opacity ease-in-out md:hidden" @click="scrollToDestiny">
          Quero aumentar minha produtividade!
        </button>
      </div>
    </div>
  </section>
</template>
