<script setup lang="ts">
const mutado = ref(false)
</script>

<template>
  <section>
    <div class="m-8 flex items-center justify-center">
      <video class="h-auto w-full max-w-[900px]" autoplay loop :muted="!mutado">
        <source src="/video.mp4" type="video/mp4">
        Seu navegador não suporta o elemento de vídeo.
      </video>
    </div>
    <div class="flex items-center justify-center text-white">
      <Icon v-if="mutado" name="heroicons:speaker-wave" size="30" class="m-1 text-black" />
      <Icon v-else name="heroicons:speaker-x-mark" size="30" class="m-1 text-black" />
      <InputSwitch v-model="mutado" />
    </div>

    <p class="px-20 py-6 text-justify">
      Bem-vindo à Explotools Brasil, uma referência de excelência em soluções para mineração e sondagem na América Latina. Nossa empresa se dedica a fornecer produtos de alta qualidade, que garantem produtividade e segurança em projetos de mineração. Com uma sólida base de conhecimento e uma equipe altamente qualificada, estamos comprometidos em atender e superar as expectativas dos nossos clientes, oferecendo soluções inovadoras e acessíveis.
    </p>

    <h2 class="pb-6 text-center text-lg font-bold">
      História e Missão
    </h2>

    <p class="px-20 pb-6 text-justify">
      A Explotools Brasil foi fundada por um especialista com mais de 20 anos atuando no setor de mineração, com a visão de se tornar líder no mercado de mineração e sondagem, oferecendo produtos que atendem às mais rigorosas normas de qualidade. Com mais de uma década de experiência no setor, a empresa conquistou reconhecimento pela sua excelência técnica e capacidade de inovação. Desde o início, nossa missão tem sido clara: proporcionar aos nossos clientes ferramentas e equipamentos que aumentem a produtividade e segurança de suas operações. Nossos produtos são projetados para atender às necessidades mais exigentes, sendo testados e aprovados por especialistas do setor, o que reforça nossa posição como uma marca de confiança e qualidade.
    </p>

    <h2 class="pb-6 text-center text-lg font-bold">
      Compromisso com a Qualidade
    </h2>

    <p class="px-20 pb-6 text-justify">
      Nosso compromisso com a qualidade é inabalável. Cada produto que fabricamos passa por rigorosos testes de qualidade para assegurar durabilidade e desempenho superior. Esse foco nos detalhes nos permite oferecer produtos que não apenas atendem, mas superam os padrões da indústria. Na Explotools Brasil, a qualidade não é apenas um requisito, mas uma filosofia que permeia todos os aspectos do nosso negócio. Desde a seleção de matérias-primas até o processo de fabricação, garantimos que cada etapa seja conduzida com o mais alto padrão de excelência.
    </p>

    <h2 class="pb-6 text-center text-lg font-bold">
      Presença Internacional e Inovação
    </h2>

    <p class="px-20 pb-6 text-justify">
      Com uma forte presença internacional, a Explotools exporta seus produtos para mais de 12 países, incluindo México, Argentina, Peru, Bolívia e muitos outros. Esse alcance global é um testemunho do reconhecimento pela qualidade de nossos produtos e da confiança que nossos clientes depositam em nós. A inovação está no centro do que fazemos, com investimentos contínuos em pesquisa e desenvolvimento para proporcionar as tecnologias mais avançadas no setor de mineração e sondagem. Trabalhamos constantemente para desenvolver soluções que otimizem a produtividade dos nossos clientes, mantendo os custos sob controle.<br><br>
      A Explotools Brasil é guiada por valores de integridade, compromisso com a qualidade e respeito ao cliente. Acreditamos em construir relações duradouras, baseadas na confiança e na transparência. Adotamos práticas sustentáveis, comprometidos com a preservação do meio ambiente e com o bem-estar das comunidades onde atuamos.<br><br>
      Na Explotools Brasil, acreditamos que o futuro da mineração e sondagem é construído com inovação, qualidade e parceria. Convidamos você a explorar nosso site e descobrir como podemos ajudar sua empresa a alcançar novos patamares de sucesso e produtividade. Junte-se a nós nessa jornada de desenvolvimento e inovação!
    </p>
  </section>
</template>
