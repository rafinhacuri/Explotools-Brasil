<script setup lang="ts">
import { LeadSchema } from '~/schemas/lead'
import type { Lead } from '~/schemas/lead'

useHead({ title: `Cadastrese` })

defineOgImageComponent('NuxtSeo', { theme: '#3FA1B0', colorMode: 'dark' })

const { start, finish } = useLoadingIndicator()

const newLead = ref<Lead>({ nome: '', email: '', telefone: '', empresa: '', cargo: '' })

async function salvarLead(){
  start()

  const body = LeadSchema.safeParse(newLead.value)

  if(!body.success){
    useToast().add({ detail: body.error.errors[0].message, severity: 'error', life: 10000 })
    return finish({ error: true })
  }

  const res = await $fetch('/api/insert/lead', { method: 'POST', body: body.data })
    .catch(error => { useToast().add({ detail: error.data.message, severity: 'error', life: 10000 }) })

  if(!res) return finish({ error: true })

  finish()
  useToast().add({ detail: res, severity: 'success', life: 10000 })
  return navigateTo('/obrigado')
}

const items = computed(() => {
  const fotos: string[] = [`/fundo.jpeg`, `/fundo.jpeg`, `/fundo.jpeg`, `/fundo.jpeg`, `/fundo.jpeg`]

  return fotos
})

const carouselRef = ref()
onMounted(() => {
  setInterval(() => {
    if(!carouselRef.value) return

    if(carouselRef.value.page === carouselRef.value.pages) return carouselRef.value.select(0)

    carouselRef.value.next()
  }, 3000)
})

function ScrollToDiv(targetId: string){
  const targetDiv = document.querySelector(`#${targetId}`) as HTMLElement
  if(targetDiv) window.scrollTo({ top: targetDiv.offsetTop - 65, behavior: 'smooth' })
}
</script>

<template>
  <section class="relative min-h-screen">
    <div class="absolute inset-0 z-0 bg-[url('/fundo.jpeg')] bg-cover bg-fixed bg-center bg-no-repeat" />
    <div class="relative z-10">
      <div class="flex flex-col items-center justify-center">
        <div class="flex items-center justify-center">
          <img src="/explotools.png" alt="logo Explotools brasil" class="mt-7 h-[140px] w-[300px] md:h-[200px] md:w-[700px]">
        </div>
        <p class=" text-center text-2xl font-black italic tracking-wide text-white md:text-3xl">
          Qualidade Internacional, Preços Nacionais:<br>
          Revolucione Sua Sondagem
        </p>
        <div class="flex flex-col items-center justify-center p-4">
          <p class="mt-10 max-w-[1000px] text-center text-sm font-semibold text-white md:text-lg">
            Um dos <span class="text-[#FD0116]">maiores</span> desafios enfrentados pelas empresas de sondagem rotativa diamantada no Brasil é o <span class=" text-[#FD0116]">difícil</span> acesso a materiais de qualidade com preços justos. Muitas vezes, encontram-se produtos importados de alta qualidade, porém com <span class="text-[#FD0116]">valores elevados</span>, ou materiais nacionais mais acessíveis, porém de qualidade inferior.
          </p>
          <p class="mt-10 max-w-[1000px] text-center text-sm font-semibold text-white md:text-lg">
            Nossa proposta é oferecer <span class="text-[#FD0116]">produtos de qualidade</span> importada para sondagem a <span class="text-[#FD0116]">preços acessíveis</span>, permitindo uma redução de custos significativa sem comprometer a qualidade e a produtividade.
          </p>
          <p class="mt-10 max-w-[1000px] text-center text-sm font-semibold text-white md:text-lg">
            Como fabricantes, temos controle total sobre o processo, garantindo eficiência e competitividade. Proporcionamos a solução ideal para empresas que buscam <span class="text-[#FD0116]">aumentar a produtividade</span> e economizar em suas operações de sondagem, com resultados visíveis em apenas 30 dias de uso.
          </p>
        </div>

        <div id="card" data-aos="fade-up" class="grid gap-10 p-12 md:grid-cols-2">
          <div class="order-2 flex max-w-[500px] flex-col items-center justify-center space-y-6 rounded-xl bg-slate-950 md:order-1">
            <p class="p-3 text-lg font-semibold text-white">
              Inscreva-se aqui para mais informações:
            </p>
            <div class="space-y-6">
              <FloatLabel>
                <InputText id="nome" v-model="newLead.nome" class="border-2 border-red-500 bg-slate-950 p-1 text-white focus:border-red-500 focus:bg-slate-950" />
                <label for="nome">Nome</label>
              </FloatLabel>
              <FloatLabel>
                <InputText id="email" v-model="newLead.email" class="border-2 border-red-500 bg-slate-950 p-1 text-white focus:border-red-500 focus:bg-slate-950" />
                <label for="email">Email</label>
              </FloatLabel>
              <FloatLabel>
                <InputText id="telefone" v-model="newLead.telefone" class="border-2 border-red-500 bg-slate-950 p-1 text-white focus:border-red-500 focus:bg-slate-950" />
                <label for="telefone">Telefone</label>
              </FloatLabel>
              <FloatLabel>
                <InputText id="empresa" v-model="newLead.empresa" class="border-2 border-red-500 bg-slate-950 p-1 text-white focus:border-red-500 focus:bg-slate-950" />
                <label for="empresa">Empresa</label>
              </FloatLabel>
              <FloatLabel>
                <InputText id="Cargo" v-model="newLead.cargo" class="border-2 border-red-500 bg-slate-950 p-1 text-white focus:border-red-500 focus:bg-slate-950" />
                <label for="Cargo">Cargo</label>
              </FloatLabel>
            </div>
            <div class="order-1 pb-3 md:order-2">
              <button class=" w-[290px] rounded-xl border-2 border-black bg-red-600 px-6 py-2 text-base font-bold tracking-wide text-white transition-all duration-200 ease-in-out hover:bg-red-500" @click="salvarLead()">
                Quero ter acesso a esses produtos em primeira mão!
              </button>
            </div>
          </div>
          <Carousel :value="items" :num-visible="1" :num-scroll="1" orientation="vertical" vertical-view-port-height="330px" container-class="flex items-center">
            <template #item="slotProps">
              <div class="m-2 rounded border p-4">
                <div class="mb-4">
                  <div class="relative mx-auto">
                    <img :src="slotProps.data" :alt="slotProps.data" class="w-full rounded">
                  </div>
                </div>
              </div>
            </template>
          </Carousel>
        </div>
      </div>
      <div class="flex flex-col items-center justify-center">
        <div class="max-w-[1000px] rounded-lg pb-10">
          <h2 class="pb-5 text-center text-2xl font-bold tracking-wide text-white">
            Por que se cadastrar?
          </h2>

          <p class="py-5 text-center text-base font-semibold text-white md:text-lg">
            📬 Benefícios Exclusivos ao se Cadastrar:
          </p>
          <ul class="m-3 space-y-5 md:m-0">
            <li class=" text-center text-sm text-white md:text-base">
              <span class="font-semibold text-[#FD0116]">Ofertas exclusivas: </span>Desfrute de promoções especiais que só encontrará conosco, ajudando a maximizar sua produtividade com economia.
            </li>
            <li class=" text-center text-sm text-white md:text-base">
              <span class="font-semibold text-[#FD0116]">Acesso antecipado aos catálogos: </span>Seja o primeiro a explorar nossos produtos de qualidade, planejando suas operações de sondagem de forma mais eficiente.
            </li>
            <li class=" text-center text-sm text-white md:text-base">
              <span class="font-semibold text-[#FD0116]">Participação em pré-vendas: </span>Garanta prioridade e preços especiais em nossos lançamentos, impulsionando sua produtividade com acesso privilegiado.
            </li>
          </ul>
        </div>

        <div class="max-w-[1000px] rounded-lg pb-10">
          <div>
            <p class="py-5 text-center text-base font-semibold text-white md:text-lg">
              🌟 Vantagens únicas:
            </p>
          </div>

          <ul class="m-3 space-y-5 md:m-0">
            <li class="text-center text-sm text-white md:text-base">
              <span class="font-semibold text-[#FD0116]">Acesso antecipado aos melhores produtos: </span>Seja o primeiro a ter acesso aos produtos de última geração, aumentando sua produtividade antes de todos.
            </li>
            <li class="text-center text-sm text-white md:text-base">
              <span class="font-semibold text-[#FD0116]">Preços exclusivos e condições especiais: </span>Garanta tarifas exclusivas e condições especiais que otimizam seus custos de sondagem, maximizando sua produtividade com economia.
            </li>
            <li class="text-center text-sm text-white md:text-base">
              <span class="font-semibold text-[#FD0116]">Inovações em primeira mão:</span>Seja pioneiro ao aproveitar nossas inovações mais recentes, impulsionando sua produtividade com tecnologias de ponta.
            </li>
          </ul>
          <div class="flex items-center justify-center text-white">
            <button class="my-10 w-[430px] rounded-full border-2 border-black bg-[#FD0116] px-6 py-2 text-lg font-bold tracking-wide transition-all duration-200 ease-in-out hover:w-[470px] hover:text-xl" @click="ScrollToDiv('card')">
              Não perca essa chance! <br>
              Cadastre-se agora e saia na frente
            </button>
          </div>
        </div>

        <div class="max-w-[1000px] rounded-lg pb-10">
          <h2 class="pb-5 text-center text-2xl font-bold tracking-wide text-white">
            🔧 Explotools: A escolha certa para empresas que valorizam qualidade, inovação e resultados excepcionais em suas operações de sondagem.
          </h2>

          <ul class="m-3 space-y-5 md:m-0">
            <li class="text-center text-sm text-white md:text-base">
              Como fabricantes, investimos em alta tecnologia e maquinário computadorizado para assegurar que nossos produtos atendam aos mais altos padrões de qualidade, impulsionando assim a sua produtividade.
            </li>
            <li class="text-center text-sm text-white md:text-base">
              Presença global em mais de 13 países, atendendo com excelência às necessidades de clientes em todo o mundo.
            </li>
            <li class="text-center text-sm text-white md:text-base">
              Fundada por um especialista com mais de 20 anos de experiência no mercado de sondagem, nossa empresa possui um histórico comprovado de sucesso e excelência.
            </li>
            <li class="text-center text-sm text-white md:text-base">
              Todos os nossos produtos são importados e submetidos a rigorosos padrões de qualidade, garantindo desempenho superior e durabilidade, permitindo que você atinja metas de produtividade de forma consistente e confiável.
            </li>
            <li class="text-center text-sm text-white md:text-base">
              Contamos com uma equipe dedicada de pesquisa e desenvolvimento, que nos permite permanecer na vanguarda da inovação, oferecendo sempre as soluções mais avançadas aos nossos clientes, impulsionando assim a sua produtividade com tecnologias de ponta.
            </li>
          </ul>
          <div class="flex items-center justify-center text-white">
            <button class="my-10 w-[300px] rounded-full border-2 border-black bg-[#FD0116] px-6 py-2 text-lg font-bold tracking-wide transition-all duration-200 ease-in-out hover:w-[340px] hover:text-xl" @click="ScrollToDiv('card')">
              Quero aumentar minha produtividade!
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
