<script setup lang="ts">
  const props = defineProps({
    title: { type: String, default: 'Ferramentas de sondagem wireline.' },
    description: { type: String, default: 'Qualidade de importado a preço nacional.' },
  })

  const facts = ['Fabricante', 'BQ · NQ · NQ2 · HQ · PQ', '+12 países']

  function svg(viewBox: string, path: string, color: string): string {
    const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><path fill="${color}" d="${path}"/></svg>`
    return `data:image/svg+xml;base64,${btoa(markup)}`
  }

  const mark = svg(MARK_VIEWBOX, MARK_PATH, '#fe0018')
  const word = svg(WORD_VIEWBOX, WORD_PATH, '#fe0018')
  const ghost = svg(MARK_VIEWBOX, MARK_PATH, '#2a0306')
</script>

<template>
  <div
    class="relative flex h-full w-full overflow-hidden text-[#f2f0ec]"
    style="
      font-family: 'Archivo';
      background-image:
        radial-gradient(circle at 82% 42%, rgba(254, 0, 24, 0.35) 0%, rgba(254, 0, 24, 0) 46%),
        linear-gradient(160deg, #141415 0%, #0a0a0b 70%);
    ">
    <img
      :src="ghost"
      class="absolute"
      style="right: -60px; top: -40px; width: 600px; height: 700px" />
    <div
      class="absolute flex"
      style="
        left: -40px;
        bottom: 22px;
        width: 1300px;
        height: 14px;
        background: #fe0018;
        transform: rotate(-1.5deg);
      " />

    <div class="relative flex h-full w-full flex-col justify-between px-16 py-14">
      <div class="flex items-center">
        <img :src="mark" style="width: 52px; height: 61px" />
        <img :src="word" class="ml-5" style="width: 300px; height: 25px" />
      </div>

      <div class="flex flex-col" style="margin-bottom: 30px">
        <div
          class="flex w-220 text-[84px] leading-[0.92] font-extrabold uppercase"
          style="font-family: 'Saira'; letter-spacing: -0.02em">
          {{ props.title }}
        </div>
        <div class="mt-6 flex w-180 text-[30px] leading-snug text-[#c9c7c3]">
          {{ props.description }}
        </div>
      </div>

      <div class="flex">
        <div
          v-for="fact in facts"
          :key="fact"
          class="mr-3 flex rounded-full px-5 py-2 text-[20px] whitespace-nowrap"
          style="border: 1px solid rgba(242, 240, 236, 0.3); font-family: 'JetBrains Mono'">
          {{ fact }}
        </div>
      </div>
    </div>
  </div>
</template>
