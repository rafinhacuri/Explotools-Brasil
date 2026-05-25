<script setup lang="ts">
definePageMeta({
  colorMode: 'dark',
})

useHead({ title: 'Empresa' })

const mutado = ref(true)

useSeoMeta({
  title: 'Explotools',
  description: 'Ferramentas de sondagem wireline de alta qualidade'
})

const principios = [
  {
    num: '01',
    title: 'Foco no',
    titleAccent: 'cliente',
    desc: 'Interesse genuíno na produtividade de quem opera. Acompanhamento próximo, **pós-venda ativo** e atendimento que não desaparece depois da venda.'
  },
  {
    num: '02',
    title: 'Excelência e',
    titleAccent: 'qualidade',
    titleSuffix: ' de ponta a ponta',
    desc: 'Nada "meia-boca": qualidade no produto, no processo e no atendimento. Cada peça que sai da fábrica **carrega a nossa reputação**.'
  },
  {
    num: '03',
    title: 'Inovação e',
    titleAccent: 'melhoria contínua',
    desc: 'Testamos rápido, paramos o que não funciona e escalamos o que funciona. **Ouvimos o campo** para evoluir o portfólio.'
  },
  {
    num: '04',
    title: 'Tecnologia como',
    titleAccent: 'ferramenta',
    titleSuffix: ', não como discurso',
    desc: 'Usamos IA, automação e dados para **atender mais rápido, prever demanda e entregar cotação no mesmo dia**. Somos uma empresa moderna que age como uma.'
  }
]

// Itens de qualidade
const qualidadeItens = [
  { icon: 'i-lucide-layers', title: 'Matéria-prima selecionada', desc: 'Insumos de origem rastreada para cada lote.' },
  { icon: 'i-lucide-clock', title: 'Usinagem de precisão', desc: 'Tolerâncias controladas em cada etapa.' },
  { icon: 'i-lucide-clipboard-check', title: 'Testes funcionais', desc: 'Validação antes da liberação de cada lote.' },
  { icon: 'i-lucide-package-check', title: 'Embalagem e expedição', desc: 'Padrão que protege o produto até o campo.' }
]

const produtos = [
  {
    icon: 'i-lucide-target',
    title: 'Overshots',
    desc: 'Para recuperação de testemunho com precisão e confiabilidade.'
  },
  {
    icon: 'i-lucide-gauge',
    title: 'Cabeçotes',
    desc: 'Projetados para alta durabilidade e vedação em operação contínua.'
  },
  {
    icon: 'i-lucide-rotate-3d',
    title: 'Molas e Caixas de Mola',
    desc: 'Componentes críticos para captura de testemunho, fabricados com controle rigoroso de tolerância.'
  },
  {
    icon: 'i-lucide-droplets',
    title: "Cabeças d'Água",
    desc: 'Vedação e desempenho para operação contínua em alta pressão.'
  },
  {
    icon: 'i-lucide-scissors',
    title: 'Cortadores de Hastes e Revestimentos',
    desc: 'Corte limpo, resistência ao desgaste e vida útil prolongada.'
  },
  {
    icon: 'i-lucide-wrench',
    title: "Peças para bombas d'água",
    desc: 'Kits e componentes para manutenção rápida em campo.'
  },
  {
    icon: 'i-lucide-settings',
    title: 'Acessórios de sondagem',
    desc: 'Manga trava, barriletes e demais itens consumíveis de operação.'
  }
]

// Países
const paises = ['México', 'Argentina', 'Peru', 'Bolívia', 'Chile', 'Colômbia', '+6 outros']
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-[#050505] text-white font-[Inter]">

    <!-- Halo vermelho global no topo -->
    <div class="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(253,1,22,0.12),transparent_60%)]" />

    <!-- ═══════════════ HERO ═══════════════ -->
    <section class="relative flex min-h-[calc(100vh-70px)] items-center overflow-hidden px-6 pt-35 pb-20 md:pt-35">
      <div class="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_30%,rgba(253,1,22,0.18),transparent_60%),radial-gradient(ellipse_50%_40%_at_10%_80%,rgba(253,1,22,0.08),transparent_60%)]" />

      <UContainer class="relative z-10 grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-18">

        <!-- Conteúdo do hero -->
        <div class="max-w-160">
          <div class="mb-8 inline-flex items-center gap-3 rounded-full border border-red-500/40 bg-red-500/10 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
            <span class="size-1.5 animate-pulse rounded-full bg-red-500 ring-4 ring-red-500/25" />
            FERRAMENTAS WIRELINE · BR / CL
          </div>

          <h1 class="mb-7 font-[Barlow_Condensed] text-[clamp(36px,4.5vw,64px)] font-extrabold leading-[1.02] tracking-tight">
            <span class="bg-linear-to-br from-white via-red-100 to-red-500 bg-clip-text text-transparent">Ferramentas de sondagem wireline</span>
            projetadas e fabricadas para o campo real.
          </h1>

          <p class="mb-9 max-w-145 text-[clamp(15px,1.2vw,17px)] leading-[1.65] text-white/70">
            A Explotools é <strong class="font-semibold text-white">fabricante de consumíveis e ferramentas para sondagem wireline</strong>, com <strong class="font-semibold text-white">qualidade de padrão internacional</strong> e <strong class="font-semibold text-white">atendimento ágil e diferenciado</strong>.
          </p>

          <p class="mb-4 max-w-145 text-[15px] leading-[1.65] text-white/60">
            Nascemos para entregar ao mercado de mineração e geotecnia produtos de <strong class="font-semibold text-white">alta performance que reduzem horas paradas por quebra de ferramental</strong>, a <strong class="font-semibold text-white">preço competitivo</strong>.
          </p>

          <p class="mb-9 max-w-145 text-[15px] leading-[1.65] text-white/60">
            Fornecemos para empresas de sondagem em <strong class="font-semibold text-white">todo o Brasil</strong> e exportamos para <strong class="font-semibold text-white">mais de 12 países</strong>.
          </p>

          <div class="flex flex-wrap gap-3">
            <UButton
              to="/produtos"
              size="lg"
              color="error"
              class="font-semibold tracking-wide shadow-[0_6px_24px_rgba(253,1,22,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(253,1,22,0.55)]"
              trailing-icon="i-lucide-arrow-right"
            >
              Ver Produtos
            </UButton>
            <UButton
              to="https://wa.link/c1di0k"
              external
              target="_blank"
              size="lg"
              variant="soft"
              color="neutral"
              class="font-semibold tracking-wide backdrop-blur-sm hover:bg-white/15"
            >
              Fale conosco
            </UButton>
          </div>

          <!-- Stats -->
          <div class="mt-14 flex flex-wrap gap-14">
            <div>
              <div class="font-[Barlow_Condensed] text-[44px] font-extrabold leading-none tracking-tight text-red-500">+12</div>
              <div class="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-white/50">Países</div>
            </div>
            <div>
              <div class="font-[Barlow_Condensed] text-[44px] font-extrabold leading-none tracking-tight text-red-500">7</div>
              <div class="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-white/50">Anos de operação</div>
            </div>
            <div>
              <div class="font-[Barlow_Condensed] text-[44px] font-extrabold leading-none tracking-tight text-red-500">100%</div>
              <div class="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-white/50">Satisfação</div>
            </div>
          </div>
        </div>

        <!-- Vídeo lateral -->
        <div class="relative aspect-4/5 overflow-hidden rounded-2xl border border-red-500/20 shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_60px_rgba(253,1,22,0.15)] lg:max-h-155">
          <!-- Cantos industriais vermelhos -->
          <div class="absolute left-4 top-4 z-30 size-8 border-l-2 border-t-2 border-red-500" />
          <div class="absolute bottom-4 right-4 z-30 size-8 border-b-2 border-r-2 border-red-500" />

          <!-- Vinheta -->
          <div class="absolute inset-0 z-20 bg-linear-to-t from-[#050505]/40 to-transparent pointer-events-none" />

          <!-- Vídeo -->
          <video
            class="size-full object-cover"
            autoplay
            loop
            playsinline
            :muted="mutado"
          >
            <source src="/video.mp4" type="video/mp4" />
          </video>

          <!-- Controle de som -->
          <div class="absolute bottom-4 left-4 z-30 flex items-center gap-2 rounded-full bg-black/60 px-3 py-2 backdrop-blur">
            <UIcon :name="mutado ? 'i-lucide-volume-2' : 'i-lucide-volume-x'" class="text-white" />
            <USwitch v-model="mutado" size="sm" />
          </div>
        </div>

      </UContainer>
    </section>

    <!-- ═══════════════ O QUE FABRICAMOS ═══════════════ -->
    <section class="relative py-30">
      <UContainer class="relative z-10">
        <div class="mb-14">
          <div class="mb-5 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-red-500 before:block before:h-px before:w-7 before:bg-red-500">
            O que fabricamos
          </div>
          <h2 class="mb-6 max-w-[20ch] font-[Barlow_Condensed] text-[clamp(36px,4.5vw,56px)] font-extrabold leading-[0.95] tracking-tight">
            Ferramentas e consumíveis para wireline.
          </h2>
          <p class="max-w-165 text-[17px] leading-[1.65] text-white/70">
            Nosso portfólio cobre as principais categorias de ferramentas e consumíveis para sondagem wireline nos diâmetros <strong class="font-semibold text-white">BQ, NQ, NQ2, HQ e PQ</strong>.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="produto in produtos"
            :key="produto.title"
            class="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/2 p-7 transition-all duration-400 hover:-translate-y-1 hover:border-red-500/30 hover:bg-white/4"
          >
            <div class="mb-6 flex size-12 items-center justify-center rounded-[10px] border border-red-500/25 bg-red-500/10 text-red-500 transition-all duration-300 group-hover:scale-105 group-hover:bg-red-500/20">
              <UIcon :name="produto.icon" class="size-5" />
            </div>
            <h3 class="mb-3 text-[20px] font-bold leading-tight text-white">{{ produto.title }}</h3>
            <p class="text-sm leading-relaxed text-white/65">{{ produto.desc }}</p>
          </div>
        </div>

        <div class="mt-10 rounded-2xl border border-red-500/20 bg-red-500/8 p-8">
          <p class="max-w-190 text-[17px] leading-[1.65] text-white/75">
            Cada peça é <strong class="font-semibold text-white">projetada internamente</strong>, fabricada com <strong class="font-semibold text-white">matéria-prima selecionada</strong> e <strong class="font-semibold text-white">testada antes de sair da fábrica</strong>. Não revendemos — <strong class="font-semibold text-white">nós fabricamos</strong>.
          </p>
        </div>
      </UContainer>
    </section>

    <!-- ═══════════════ QUEM ESTÁ POR TRÁS ═══════════════ -->
    <section class="relative py-30">
      <UContainer class="relative z-10">
        <div class="grid grid-cols-1 items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-18">
          <div>
            <div class="mb-5 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-red-500 before:block before:h-px before:w-7 before:bg-red-500">
              Quem está por trás
            </div>
            <h2 class="mb-6 font-[Barlow_Condensed] text-[clamp(36px,4.5vw,56px)] font-extrabold leading-[0.95] tracking-tight">
              Experiência de campo,<br>gestão e operação.
            </h2>
          </div>

          <div class="space-y-5 text-[17px] leading-[1.65] text-white/70">
            <p>
              A Explotools nasceu no Chile <strong class="font-semibold text-white">há 7 anos</strong>, fundada por um especialista com <strong class="font-semibold text-white">mais de 20 anos de vivência direta no setor de sondagem e mineração</strong> — no campo, no comercial e na gestão de operações.
            </p>
            <p>
              O que começou como uma operação focada no mercado chileno se expandiu rapidamente pela América Latina, e <strong class="font-semibold text-white">há 2 anos chegou ao Brasil</strong> com uma missão clara: entregar ao mercado brasileiro a mesma qualidade de ferramental que já abastecia grandes operações internacionais, com <strong class="font-semibold text-white">atendimento próximo, ágil e a preço competitivo</strong>.
            </p>
            <p>
              Hoje exportamos para <strong class="font-semibold text-white">mais de 12 países</strong> e fornecemos para as <strong class="font-semibold text-white">maiores operadoras de sondagem do Brasil</strong>. Nosso crescimento acelerado é resultado direto da <strong class="font-semibold text-white">confiança que nossos clientes depositam na qualidade do que entregamos</strong>.
            </p>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- ═══════════════ PRINCÍPIOS — Como trabalhamos ═══════════════ -->
    <section class="relative py-30">
      <UContainer class="relative z-10">
        <div class="mb-14">
          <div class="mb-5 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-red-500 before:block before:h-px before:w-7 before:bg-red-500">
            Como trabalhamos
          </div>
          <h2 class="mb-6 max-w-[22ch] font-[Barlow_Condensed] text-[clamp(36px,4.5vw,56px)] font-extrabold leading-[0.95] tracking-tight">
            Quatro princípios<br>que guiam tudo.
          </h2>
          <p class="max-w-155 text-[17px] leading-[1.65] text-white/70">
            Quatro princípios guiam todas as nossas decisões — do desenvolvimento de produto ao pós-venda.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div
            v-for="p in principios"
            :key="p.num"
            class="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/2 p-9 transition-all duration-400 hover:-translate-y-1 hover:border-red-500/30 hover:bg-white/4"
          >
            <span class="pointer-events-none absolute right-8 top-6 font-[Barlow_Condensed] text-[88px] font-black leading-none text-white/5 transition-colors duration-400 group-hover:text-red-500/15">
              {{ p.num }}
            </span>
            <h3 class="relative z-10 mb-3 text-[21px] font-bold leading-tight">
              {{ p.title }}
              <span class="text-red-500">{{ p.titleAccent }}</span>{{ p.titleSuffix }}
            </h3>
            <p class="relative z-10 text-sm leading-relaxed text-white/65" v-html="p.desc.replace(/\*\*(.+?)\*\*/g, '<strong class=&quot;text-white font-semibold&quot;>$1</strong>')" />
          </div>
        </div>
      </UContainer>
    </section>

    <!-- ═══════════════ QUALIDADE DE PONTA A PONTA ═══════════════ -->
    <section class="relative py-30">
      <UContainer class="relative z-10">
        <div class="mb-12">
          <div class="mb-5 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-red-500 before:block before:h-px before:w-7 before:bg-red-500">
            Qualidade de ponta a ponta
          </div>
          <h2 class="mb-6 font-[Barlow_Condensed] text-[clamp(36px,4.5vw,56px)] font-extrabold leading-[0.95] tracking-tight">
            Qualidade<br>não é um departamento.
          </h2>
          <p class="max-w-155 text-[17px] leading-[1.65] text-white/70">
            Na Explotools, <strong class="font-semibold text-white">qualidade não é um departamento</strong> — é como a empresa inteira funciona. Do desenho técnico à expedição, <strong class="font-semibold text-white">cada etapa passa por controle rigoroso</strong>.
          </p>
        </div>

        <div class="mb-12 grid grid-cols-1 md:grid-cols-2">
          <div
            v-for="item in qualidadeItens"
            :key="item.title"
            class="group flex items-start gap-5 border-b border-white/8 py-6 transition-all duration-300 hover:pl-3"
          >
            <div class="flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-red-500/25 bg-red-500/10 text-red-500 transition-all duration-300 group-hover:scale-105 group-hover:bg-red-500/20">
              <UIcon :name="item.icon" class="size-4" />
            </div>
            <div>
              <h4 class="mb-1 text-[17px] font-semibold">{{ item.title }}</h4>
              <p class="text-sm text-white/60">{{ item.desc }}</p>
            </div>
          </div>
        </div>

        <!-- Bloco 100% satisfação -->
        <div class="relative mt-8 flex flex-wrap items-center gap-6 overflow-hidden rounded-2xl bg-linear-to-br from-red-500 to-red-700 p-9">
          <div class="pointer-events-none absolute right-[-10%] -top-full size-75 bg-[radial-gradient(circle,rgba(255,255,255,0.15),transparent_60%)]" />
          <div class="relative font-[Barlow_Condensed] text-[88px] font-black leading-none text-white">100%</div>
          <div class="relative min-w-70 flex-1 text-base leading-snug text-white/95">
            Na nossa última pesquisa de satisfação, <strong class="font-semibold text-white">100% dos clientes avaliaram a qualidade dos nossos produtos com nota 4 ou 5</strong> em uma escala de 1 a 5 — e não tivemos nenhum detrator.
            <span class="mt-3 block font-[Barlow_Condensed] text-[22px] font-bold tracking-tight text-white">
              Esse resultado não veio de marketing. Veio do campo.
            </span>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- ═══════════════ PRESENÇA INTERNACIONAL ═══════════════ -->
    <section class="relative py-30">
      <UContainer class="relative z-10">
        <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">

          <div>
            <div class="mb-5 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-red-500 before:block before:h-px before:w-7 before:bg-red-500">
              Presença internacional
            </div>
            <h2 class="mb-6 font-[Barlow_Condensed] text-[clamp(36px,4.5vw,56px)] font-extrabold leading-[0.95] tracking-tight">
              A reputação cruza<br>fronteiras.
            </h2>
            <p class="mb-4 text-[17px] leading-[1.65] text-white/70">
              A Explotools exporta para <strong class="font-semibold text-white">mais de 12 países</strong>, incluindo <strong class="font-semibold text-white">México, Argentina, Peru, Bolívia, Chile, Colômbia</strong> e outros mercados da América Latina.
            </p>
            <p class="text-[17px] leading-[1.65] text-white/70">
              Esse alcance internacional é o reflexo direto da <strong class="font-semibold text-white">qualidade dos nossos produtos</strong>: quando a performance em campo é comprovada, <strong class="font-semibold text-white">a reputação cruza fronteiras</strong> sem precisar de propaganda.
            </p>

            <div class="mt-8 flex flex-wrap gap-2.5">
              <div
                v-for="pais in paises"
                :key="pais"
                class="flex items-center gap-2 rounded-full border border-white/12 px-4.5 py-2.5 text-sm font-medium text-white/85 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-500/50 hover:bg-red-500/10"
              >
                <span class="size-1.5 rounded-full bg-red-500" />
                {{ pais }}
              </div>
            </div>
          </div>

          <div class="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-white/8 bg-[radial-gradient(circle_at_center,rgba(253,1,22,0.1),transparent_70%),#080808]">
            <div class="pointer-events-none absolute size-[80%] animate-[spin_40s_linear_infinite] rounded-full border border-dashed border-red-500/20" />
            <div class="relative font-[Barlow_Condensed] text-[clamp(160px,18vw,240px)] font-black leading-[0.85] tracking-tight bg-linear-to-b from-white to-red-500 bg-clip-text text-transparent">
              +12
              <span class="absolute -bottom-3 left-1/2 -translate-x-1/2 text-sm font-medium tracking-[0.3em] text-white/40 [-webkit-text-fill-color:rgba(255,255,255,0.4)]">PAÍSES</span>
            </div>
          </div>

        </div>
      </UContainer>
    </section>

    <!-- ═══════════════ CTA FINAL ═══════════════ -->
    <section class="relative px-6 py-30">
      <UContainer class="relative z-10">
        <div class="relative overflow-hidden rounded-2xl border border-red-500/25 bg-linear-to-br from-red-500/18 via-white/4 to-black p-8 md:p-12">
          <div class="pointer-events-none absolute right-[-15%] top-[-70%] size-95 rounded-full bg-red-500/18 blur-3xl" />
          <div class="relative max-w-205">
            <div class="mb-5 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-red-400 before:block before:h-px before:w-7 before:bg-red-500">
              Vamos conversar?
            </div>
            <h2 class="mb-6 font-[Barlow_Condensed] text-[clamp(36px,4.5vw,58px)] font-extrabold leading-[0.95] tracking-tight">
              Teste um fabricante que entrega qualidade real.
            </h2>
            <p class="mb-5 max-w-170 text-[17px] leading-[1.65] text-white/75">
              Se você opera sondas wireline e quer testar um fabricante que entrega <strong class="font-semibold text-white">qualidade real</strong>, com <strong class="font-semibold text-white">atendimento rápido</strong> e <strong class="font-semibold text-white">preço justo</strong> — fala com a gente.
            </p>
            <p class="mb-8 max-w-170 text-[17px] leading-[1.65] text-white/75">
              Mande sua lista de necessidades pelo WhatsApp e <strong class="font-semibold text-white">te respondemos hoje mesmo</strong>, com todas as informações que precisa.
            </p>
            <div class="flex flex-wrap items-center gap-4">
              <UButton
                to="https://wa.link/c1di0k"
                external
                target="_blank"
                size="lg"
                color="error"
                class="font-semibold tracking-wide shadow-[0_6px_24px_rgba(253,1,22,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(253,1,22,0.55)]"
                trailing-icon="i-lucide-arrow-right"
              >
                Chamar no WhatsApp
              </UButton>
              <p class="font-[Barlow_Condensed] text-[22px] font-bold tracking-tight text-white">
                Junte-se a nós nessa jornada de desenvolvimento e inovação.
              </p>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

  </div>
</template>
