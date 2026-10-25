# Explotools Brasil

Site institucional e ferramentas da Explotools Brasil, fabricante de ferramentas e consumíveis para sondagem diamantada wireline. Inclui o site público (home, produtos, contatos), a página de captura de leads, a ferramenta de seleção de matriz e o painel administrativo.

Quem pede mudanças aqui nem sempre é programador. Explique o que vai fazer em linguagem simples, mostre o resultado rodando antes de commitar e siga os padrões abaixo à risca: o objetivo é que toda mudança pareça feita pela mesma pessoa que construiu o site.

## Comandos

```bash
bun install          # instala dependências (nunca use npm, pnpm ou yarn)
bun run dev          # site em http://localhost:3000
bun run fmt:fix      # formata (oxfmt)
bun run lint         # lint (oxlint --type-aware)
bun run typecheck    # tipos (golar)
bun run build        # build de produção
```

Antes de qualquer commit, `fmt:fix`, `lint` e `typecheck` precisam passar sem erro. Não desligue regras de lint para passar; corrija o código. Comentários `oxlint-disable` só no mesmo formato dos que já existem no projeto.

## Stack

- **Nuxt 4** (Vue 3, TypeScript), backend nativo do Nuxt em `server/` (sem backend separado).
- **Tailwind CSS 4** com tokens em `app/assets/main.css`.
- **Reka UI** para componentes acessíveis (Dialog, AlertDialog, Tabs, RadioGroup, Combobox, Slider, Popover, Tooltip, Accordion, Toast).
- **motion-v** para animações (`<Motion>`, `useScroll`, `useTransform`, `useSpring`) e **Lenis** para rolagem suave (`app/plugins/scroll.client.ts`).
- **three.js** para as cenas 3D em `app/lib/three/`.
- **valibot** para validação. Esquemas em `shared/utils/use*Schema.ts`, usados no site e no servidor.
- **MongoDB** via Mongoose (`server/utils/db.ts`); sessões com `nuxt-auth-utils`.
- `@nuxt/icon` (coleções `ph` e `simple-icons`), `@nuxt/image`, `@nuxt/fonts`, `@nuxtjs/seo` (OG image com Takumi), `@nuxt/scripts` (Meta Pixel), `nuxt-security`.

Não adicione dependências sem o pedido explícito do mantenedor (Rafael).

## Estrutura

```
app/
  assets/main.css        tokens de cor, tipografia, utilitários e keyframes
  data/content.ts        conteúdo central: brand, channels, categories, photos,
                         principles, quality, countries, catalogs, leadPhotos
  pages/                 index, produtos, contatos, lead, obrigado, login, adm,
                         selecao-matriz/index, selecao-matriz/[uid]
  layouts/               default (header, medidor de profundidade, footer) e bare
  components/            base: Btn, Eyebrow, Reveal, Magnet, Tilt, Strata, Counter,
                         Field, LeadForm, Logo, Toaster, Header, Footer...
    home/                seções da home na ordem da página
    produtos/ matriz/ adm/
    OgImage/             imagem de compartilhamento (Takumi)
  lib/three/             cenas 3D (bit, hero, assembly, globe, helix, land)
  utils/                 math (clamp, band), brand (vetores da logo), date, pick
  composables/           useToast, useFormErrors
server/
  api/                   rotas REST (setup, auth, leads, admins, recomendacoes)
  utils/                 db (modelos e conexão), guard (sessão e validação)
shared/
  utils/                 esquemas valibot, motor da seleção de matriz, rochas, phone
  types/                 tipos compartilhados e tipagem da sessão
public/                  imagens .webp, vídeo, PDFs dos catálogos, ícones
```

## Padrões de código

- Escreva como os arquivos vizinhos: mesmos nomes, mesmo estilo, mesma densidade de comentários (poucos, só quando o porquê não é óbvio).
- Componentes com `<script setup lang="ts">`. Textos visíveis ficam num objeto `text` no topo do script. Conteúdo compartilhado entre páginas fica em `app/data/content.ts`.
- Nada de blocos `<style>`: estilos com classes Tailwind; keyframes e utilitários globais em `main.css`.
- Formulários: `safeParse` com o esquema de `shared/utils/`, erros com `useFormErrors` e o componente `<Field>`, feedback com `useToast()` (`success`, `error`, `fail(error)`).
- APIs: valide com `validBody(event, esquema)`; proteja com `requireAdmin` ou `requireLead` (`server/utils/guard.ts`); mensagens de erro em português, dizendo o que fazer.
- Imagens: `.webp`, até ~1600px no lado maior, em `public/`; exiba com `<NuxtImg>` e `width` (para o otimizador gerar o tamanho certo). Sem cópias de miniaturas.
- Cenas 3D seguem o padrão de `app/lib/three/` (classe com `resize`, `frame`, `dispose`) e são montadas por um componente `*.client.vue` que pausa quando sai da tela e respeita `prefers-reduced-motion`.
- Datas com `formatDate` (`app/utils/date.ts`); telefone com `formatPhone` (`shared/utils/phone.ts`).
- Nunca commite `.env`, senhas, URLs de banco ou dados de clientes.

## Padrões de visual

- **Paleta:** preto e vermelho da marca, com branco-osso de contraste. Use sempre os tokens, nunca hex solto:
  `furo` (fundo), `rocha` e `rocha-2` (superfícies), `osso` e `osso-2` (claros), `red` (`#FE0018`), `red-deep`, `red-ink`, `fg`, `muted`, `faint`, `line`, `line-strong`, `glass`.
- **Tipografia:** `display` (Saira condensada, caixa alta) para títulos; `wide` (Saira expandida, ecoa a logo) e `label` (mono) para rótulos; Archivo no corpo. Escala: `text-giant`, `text-display`, `text-headline`, `text-title`, `text-lede`, `text-micro`.
- **Conceito "furo de sondagem":** o medidor lateral mostra a profundidade da rolagem. Toda seção da home abre com `<Eyebrow :depth="N">` (metros crescentes ao descer a página). Seções novas seguem esse padrão e o fundo em camadas usa `<Strata>`.
- **Componentes base:** botões com `<Btn>` (`red`, `ghost`, `light`, `dark`), entradas com `<Reveal>`, ímã em CTAs com `<Magnet>`, inclinação 3D em cartões com `<Tilt>`, números com `<Counter>`.
- **Animações de rolagem:** use `useTransform` com **função** e `band()` (`app/utils/math.ts`). Nunca intervalos parciais como `useTransform(p, [0.4, 0.8], ...)`: o motion-v acelera com ScrollTimeline nativa e o elemento reaparece no fim.
- Fotos que precisam se fundir com o fundo usam `mask-image`, não degradê sobreposto (evita linha na borda).
- Responsivo obrigatório: confira em largura de celular (390px) sem rolagem horizontal. Foco visível e `prefers-reduced-motion` respeitados.
- Antes de criar ou mudar algo visual, se as skills de design estiverem instaladas em `.claude/skills/`, carregue `frontend-design`.

## Receitas

| Pedido                                    | Onde                                                                                              |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------- |
| WhatsApp, e-mail, redes sociais           | `app/data/content.ts` → `brand`, `channels`                                                       |
| Foto de produto nova                      | `.webp` em `public/produtos/` + id em `categories[].photos` (e `titles` se tiver nome confirmado) |
| Linha de produto (nome, descrição, fotos) | `app/data/content.ts` → `categories`                                                              |
| Catálogo em PDF                           | PDF em `public/catalogos/`, capa em `public/catalogos/capas/`, item em `catalogs`                 |
| País atendido no globo                    | `app/data/content.ts` → `countries` (lat/lon)                                                     |
| Textos de uma seção                       | objeto `text` do componente em `app/components/home/` ou da página                                |
| Página de captura de leads                | `app/pages/lead.vue`                                                                              |
| Regras da seleção de matriz               | `shared/utils/matriz.engine.ts` e `rochas.ts` (mudanças técnicas: confirmar com o Rafael)         |

Ao mexer em banco, autenticação, painel administrativo, segurança (`nuxt.config.ts` → `security`, `routeRules`) ou no motor da seleção de matriz, explique o impacto e peça confirmação antes.

## Commits (Gitmoji)

Formato: `<emoji> <frase em português, minúscula, no presente, dizendo o que o commit faz>`. Corpo opcional, depois de uma linha em branco, explicando o porquê.

```
✨ redesenha a seleção de matriz
🐛 corrige elementos que reapareciam no fim das animações de rolagem
💄 mostra todos os contatos numa única tela
🍱 adiciona fotos novas da linha de molas
```

| Emoji | Uso                                          |
| ----- | -------------------------------------------- |
| ✨    | nova funcionalidade ou seção                 |
| 🐛    | correção de bug                              |
| 💄    | visual: cores, espaçamento, layout, animação |
| ✏️    | texto ou erro de digitação                   |
| 🍱    | imagens, vídeos, PDFs e outros arquivos      |
| ♻️    | refatoração sem mudar comportamento          |
| 🔥    | remover código ou arquivos                   |
| 🚚    | mover ou renomear                            |
| ⚡️    | desempenho                                   |
| 🔍    | SEO e imagem de compartilhamento             |
| ♿️    | acessibilidade                               |
| 🔧    | configuração                                 |
| ⬆️    | dependências (só com pedido do mantenedor)   |
| 📝    | documentação                                 |

Regras:

- Um commit por assunto; `git add` só dos arquivos daquele assunto (nunca `git add -A` às cegas, nunca `.env`).
- Sem `Co-Authored-By` nem assinatura do Claude.
- Não use 🔖 nem rode `bumpp`/`bun run release`: versão e publicação são do mantenedor.
- Trabalhe numa branch com nome curto em português (`novas-fotos-molas`), nunca direto na `main`.

## Pull requests

- Abra contra `rafinhacuri/Explotools-Brasil`, base `main`.
- Título no mesmo formato de commit (emoji + frase).
- Descrição em português simples:

```markdown
## O que mudou

- ...

## Por quê

- ...

## Como conferir

- Página(s): ...
- O que olhar ou clicar: ...

## Checklist

- [ ] `bun run fmt:fix`, `bun run lint` e `bun run typecheck` sem erros
- [ ] Conferido no computador e no celular
- [ ] Nenhuma senha, `.env` ou dado de cliente no commit
```

- Comentários e respostas em PR: em português, curtos e objetivos, dizendo o que foi feito ou o que falta. Ajustes pedidos na revisão vão em novos commits na mesma branch (sem reescrever o histórico já enviado).
