<script setup lang="ts">
import { LeadSchema } from '~/schemas/lead'
import type { Lead } from '~/schemas/lead'

definePageMeta({
  layout: false,
})

useHead({ title: `Cadastre-se` })

defineOgImageComponent('NuxtSeo', { theme: '#3FA1B0', colorMode: 'dark' })

const toast = useToast()

const { start, finish } = useLoadingIndicator()

const images = ref([{ nome: `/foto1.jpeg` }, { nome: `/foto2.jpeg` }, { nome: `/foto3.jpeg` }, { nome: `/foto4.jpeg` }, { nome: `/foto5.jpeg` }, { nome: `/foto6.jpeg` }, { nome: `/foto7.jpeg` }, { nome: `/foto8.jpeg` }])
const verdade = true

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
  toast.add({ severity: 'success', detail: res, summary: 'Sucesso', life: 10000 })
  return navigateTo('/obrigado')
}

const carouselRef = ref()
onMounted(() => {
  setInterval(() => {
    if(!carouselRef.value) return

    if(carouselRef.value.page === carouselRef.value.pages) return carouselRef.value.select(0)

    carouselRef.value.next()
  }, 3000)
})

if(import.meta.client){
  window.addEventListener('scroll', () => {
    const btnScrollTop = document.querySelector('#scrollTopButton') as HTMLElement
    if(window.innerWidth < 768){
      const maxScrollPosition = document.body.offsetHeight - window.innerHeight
      if(btnScrollTop){
        if(window.pageYOffset > 0 && window.pageYOffset < maxScrollPosition - 100){
          btnScrollTop.style.opacity = '1'
        }
        else {
          btnScrollTop.style.opacity = '0'
        }
      }
    }
  })
}
function ScrollToDiv(targetId: string){
  const targetDiv = document.querySelector(`#${targetId}`) as HTMLElement
  if(targetDiv) window.scrollTo({ top: targetDiv.offsetTop - 65, behavior: 'smooth' })
}
</script>

<template>
  <section class="relative min-h-[calc(100vh-131px)] bg-[url('/fundo.jpeg')]">
    <div class="absolute inset-0 z-0 min-h-[calc(100vh-131px)] bg-[url('/fundo.jpeg')] bg-cover bg-fixed bg-center bg-no-repeat" />
    <div class="relative z-10">
      <div class="flex flex-col items-center justify-center">
        <div class="flex items-center justify-center">
          <img src="/explotools.png" alt="logo Explotools brasil" class="mt-7 h-[140px] w-[300px] md:h-[200px] md:w-[700px]">
        </div>
        <p class=" text-center text-base font-black italic tracking-wide text-white md:text-3xl">
          Qualidade Internacional, Preços Nacionais:<br>
          Revolucione Sua Sondagem
        </p>
        <div class="flex flex-col items-center justify-center p-4">
          <p class="mt-10 max-w-[1000px] text-center text-sm font-semibold text-white md:text-lg">
            Um dos maiores desafios enfrentados pelas <span class="text-[#FD0116]">empresas de sondagem rotativa diamantada</span> no Brasil é o difícil acesso a <span class="text-[#FD0116]">materiais de qualidade com preços justos</span>. Muitas vezes, encontram-se produtos importados de alta qualidade, porém com valores elevados, ou materiais nacionais mais acessíveis, porém de qualidade inferior.
          </p>
          <p class="mt-10 max-w-[1000px] text-center text-sm font-semibold text-white md:text-lg">
            <span class="text-[#FD0116]">Nossa proposta é oferecer produtos de qualidade importada para sondagem a preços acessíveis</span>, permitindo uma redução de custos significativa sem comprometer a qualidade e a produtividade.
          </p>
          <p class="mt-10 max-w-[1000px] text-center text-sm font-semibold text-white md:text-lg">
            Como <span class="text-[#FD0116]">fabricantes</span>, temos controle total sobre o processo, <span class="text-[#FD0116]">garantindo eficiência e competitividade</span>. Proporcionamos a solução ideal para empresas que buscam aumentar a produtividade e economizar em suas operações de sondagem, com resultados visíveis em apenas 30 dias de uso.
          </p>
        </div>

        <div class="grid gap-5 p-12 md:grid-cols-2">
          <div id="card" class="order-2 flex max-w-[500px] flex-col items-center justify-center space-y-6 rounded-xl bg-zinc-950 transition-all duration-1000 ease-in-out md:order-1 md:space-y-14">
            <p class="p-3 text-lg font-semibold text-white">
              Inscreva-se aqui para mais informações:
            </p>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:grid-rows-3">
              <FloatLabel>
                <InputText id="nome" v-model="newLead.nome" class="max-w-[260px] border-2 border-red-500 bg-zinc-950 p-1 text-white focus:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-red-500 md:max-w-[200px]" />
                <label for="nome">Nome</label>
              </FloatLabel>
              <FloatLabel>
                <InputText id="email" v-model="newLead.email" class="max-w-[260px] border-2 border-red-500 bg-zinc-950 p-1 text-white focus:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-red-500 md:max-w-[200px]" />
                <label for="email">Email</label>
              </FloatLabel>
              <FloatLabel>
                <InputMask id="telefone" v-model="newLead.telefone" mask="(99) 99999-9999" class="max-w-[260px] border-2 border-red-500 bg-zinc-950 p-1 text-white focus:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-red-500 md:max-w-[200px]" />
                <label for="telefone">Telefone</label>
              </FloatLabel>
              <FloatLabel>
                <InputText id="empresa" v-model="newLead.empresa" class="max-w-[260px] border-2 border-red-500 bg-zinc-950 p-1 text-white focus:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-red-500 md:max-w-[200px]" />
                <label for="empresa">Empresa</label>
              </FloatLabel>
              <FloatLabel>
                <InputText id="Cargo" v-model="newLead.cargo" class="max-w-[260px] border-2 border-red-500 bg-zinc-950 p-1 text-white focus:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-red-500 md:max-w-[200px]" />
                <label for="Cargo">Cargo</label>
              </FloatLabel>
            </div>
            <button class=" w-[290px] rounded-xl border-2 border-black bg-red-600 px-6 py-2 text-base font-bold tracking-wide text-white transition-all duration-200 ease-in-out hover:bg-red-500" @click="salvarLead()">
              Quero ter acesso a esses produtos em primeira mão!
            </button>
          </div>
          <div v-animateonscroll="{ enterClass: 'animate-zoomin', leaveClass: 'animate-fadeout' }" class="order-1 max-w-[500px] pb-3 transition-all duration-200 ease-in-out md:order-2">
            <Galleria :value="images" :circular="verdade" :show-item-navigators="verdade" :show-thumbnails="false" :auto-play="verdade" :transition-interval="4000">
              <template #item="slotProps">
                <img :src="slotProps.item.nome" :alt="slotProps.item.nome" class="size-[300px] rounded-lg object-cover md:size-[500px]">
              </template>
            </Galleria>
          </div>
        </div>
      </div>
      <div class="flex flex-col items-center justify-center">
        <div class="max-w-[1000px] rounded-lg pb-10">
          <h2 v-animateonscroll="{ enterClass: 'animate-zoomin', leaveClass: 'animate-fadeout' }" class="pb-5 text-center text-3xl font-bold tracking-wide text-white transition-all duration-1000 ease-in-out">
            Por que se cadastrar?
          </h2>

          <p v-animateonscroll="{ enterClass: 'animate-zoomin', leaveClass: 'animate-fadeout' }" class="py-5 text-center text-base font-semibold text-white transition-all duration-1000 ease-in-out md:text-xl">
            📬 Benefícios Exclusivos ao se Cadastrar:
          </p>
          <ul class="m-3 space-y-5 transition-all duration-1000 ease-in-out md:m-0">
            <li v-animateonscroll="{ enterClass: 'animate-zoomin', leaveClass: 'animate-fadeout' }" class=" text-center text-sm text-white transition-all duration-1000 ease-in-out md:text-base">
              <span class="font-semibold text-[#FD0116]">Ofertas exclusivas: </span>Desfrute de promoções especiais que só encontrará conosco, ajudando a maximizar sua produtividade com economia.
            </li>
            <li v-animateonscroll="{ enterClass: 'animate-zoomin', leaveClass: 'animate-fadeout' }" class=" text-center text-sm text-white transition-all duration-1000 ease-in-out md:text-base">
              <span class="font-semibold text-[#FD0116]">Acesso antecipado aos catálogos: </span>Seja o primeiro a explorar nossos produtos de qualidade, planejando suas operações de sondagem de forma mais eficiente.
            </li>
            <li v-animateonscroll="{ enterClass: 'animate-zoomin', leaveClass: 'animate-fadeout' }" class=" text-center text-sm text-white transition-all duration-1000 ease-in-out md:text-base">
              <span class="font-semibold text-[#FD0116]">Participação em pré-vendas: </span>Garanta prioridade e preços especiais em nossos lançamentos, impulsionando sua produtividade com acesso privilegiado.
            </li>
          </ul>
        </div>

        <div class="max-w-[1000px] rounded-lg pb-10">
          <div>
            <p v-animateonscroll="{ enterClass: 'animate-zoomin', leaveClass: 'animate-fadeout' }" class="py-5 text-center text-base font-semibold text-white transition-all duration-1000 ease-in-out md:text-xl">
              🌟 Vantagens únicas:
            </p>
          </div>

          <ul class="m-3 space-y-5 md:m-0">
            <li v-animateonscroll="{ enterClass: 'animate-zoomin', leaveClass: 'animate-fadeout' }" class="text-center text-sm text-white transition-all duration-1000 ease-in-out md:text-base">
              <span class="font-semibold text-[#FD0116]">Acesso antecipado aos melhores produtos: </span>Seja o primeiro a ter acesso aos produtos de última geração, aumentando sua produtividade antes de todos.
            </li>
            <li v-animateonscroll="{ enterClass: 'animate-zoomin', leaveClass: 'animate-fadeout' }" class="text-center text-sm text-white transition-all duration-1000 ease-in-out md:text-base">
              <span class="font-semibold text-[#FD0116]">Preços exclusivos e condições especiais: </span>Garanta tarifas exclusivas e condições especiais que otimizam seus custos de sondagem, maximizando sua produtividade com economia.
            </li>
            <li v-animateonscroll="{ enterClass: 'animate-zoomin', leaveClass: 'animate-fadeout' }" class="text-center text-sm text-white transition-all duration-1000 ease-in-out md:text-base">
              <span class="font-semibold text-[#FD0116]">Inovações em primeira mão:</span>Seja pioneiro ao aproveitar nossas inovações mais recentes, impulsionando sua produtividade com tecnologias de ponta.
            </li>
          </ul>
          <div class="flex items-center justify-center text-white">
            <button class="my-10 w-[380px] rounded-full border-2 border-black bg-[#FD0116] px-6 py-2 text-lg font-bold tracking-wide md:transition-all md:duration-200 md:ease-in-out md:hover:w-[470px] md:hover:text-xl" @click="ScrollToDiv('card')">
              Não perca essa chance! <br>
              Cadastre-se agora e saia na frente
            </button>
          </div>
        </div>

        <div class="max-w-[1000px] rounded-lg pb-10">
          <h2 v-animateonscroll="{ enterClass: 'animate-zoomin', leaveClass: 'animate-fadeout' }" class="pb-5 text-center text-2xl font-bold tracking-wide text-white transition-all duration-1000 ease-in-out">
            🔧 Explotools: A escolha certa para empresas que valorizam qualidade, inovação e resultados excepcionais em suas operações de sondagem.
          </h2>

          <ul class="m-3 space-y-5 md:m-0">
            <li v-animateonscroll="{ enterClass: 'animate-zoomin', leaveClass: 'animate-fadeout' }" class="text-center text-sm text-white transition-all duration-1000 ease-in-out md:text-base">
              Como fabricantes, <span class="font-semibold text-[#FD0116]">investimos em alta tecnologia e maquinário computadorizado</span> para assegurar que nossos produtos atendam aos mais <span class="font-semibold text-[#FD0116]">altos padrões de qualidade</span>, impulsionando assim a sua produtividade.
            </li>
            <li v-animateonscroll="{ enterClass: 'animate-zoomin', leaveClass: 'animate-fadeout' }" class="text-center text-sm text-white transition-all duration-1000 ease-in-out md:text-base">
              <span class="font-semibold text-[#FD0116]">Presença global em mais de 13 países</span>, atendendo com excelência às necessidades de clientes em todo o mundo.
            </li>
            <li v-animateonscroll="{ enterClass: 'animate-zoomin', leaveClass: 'animate-fadeout' }" class="text-center text-sm text-white transition-all duration-1000 ease-in-out md:text-base">
              Fundada por um especialista com <span class="font-semibold text-[#FD0116]">mais de 20 anos de experiência</span> no mercado de sondagem, nossa empresa possui um histórico comprovado de sucesso e excelência.
            </li>
            <li v-animateonscroll="{ enterClass: 'animate-zoomin', leaveClass: 'animate-fadeout' }" class="text-center text-sm text-white transition-all duration-1000 ease-in-out md:text-base">
              Todos os nossos <span class="font-semibold text-[#FD0116]">produtos são importados e submetidos a rigorosos padrões de qualidade</span>, garantindo desempenho superior e durabilidade, permitindo que você atinja metas de produtividade de forma consistente e confiável.
            </li>
            <li v-animateonscroll="{ enterClass: 'animate-zoomin', leaveClass: 'animate-fadeout' }" class="text-center text-sm text-white transition-all duration-1000 ease-in-out md:text-base">
              Contamos com uma equipe dedicada de <span class="font-semibold text-[#FD0116]">pesquisa e desenvolvimento</span>, que nos permite permanecer na <span class="font-semibold text-[#FD0116]">vanguarda da inovação</span>, oferecendo sempre as soluções mais avançadas aos nossos clientes, impulsionando assim a sua produtividade com tecnologias de ponta.
            </li>
          </ul>
          <div class="flex items-center justify-center text-white">
            <button class="m-10 mb-32 w-[300px] rounded-full border-2 border-black bg-[#FD0116] px-6 py-2 text-lg font-bold tracking-wide transition-all duration-200 ease-in-out hover:w-[340px] hover:text-xl md:my-10" @click="ScrollToDiv('card')">
              Quero aumentar minha produtividade!
            </button>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="flex items-center justify-center">
        <button id="scrollTopButton" class=" fixed bottom-0 z-50 block w-[380px] rounded-lg border-2 border-black bg-[#FD0116] py-6 text-lg font-bold tracking-wide text-white opacity-0 transition-opacity ease-in-out md:hidden" @click="ScrollToDiv('card')">
          Quero aumentar minha produtividade!
        </button>
      </div>
    </div>
    <CookieConsent />
  </section>
</template>
