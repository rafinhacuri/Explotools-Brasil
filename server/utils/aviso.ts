import handlebars from 'handlebars'
import type { TemplateDelegate } from 'handlebars'
import { createTransport } from 'nodemailer'
import type { Transporter } from 'nodemailer'

type Campo = [rotulo: string, valor: string | null | undefined]

interface Aviso {
  evento: string
  assunto: string
  titulo: string
  resumo: string
  campos: Campo[]
  botao: string
  caminho: string
  whatsapp?: string | null
  responderPara?: string
}

interface Cliente {
  nome: string
  empresa: string | undefined
  cargo: string | undefined
  telefone: string | undefined
  email: string
}

let modelos: { html: TemplateDelegate; texto: TemplateDelegate } | null = null
let transporter: Transporter | null = null

async function ler(nome: string): Promise<string> {
  const conteudo = await useStorage('assets:server').getItem<string>(`email/${nome}`)
  if (!conteudo) throw new Error(`Modelo de e-mail não encontrado: ${nome}`)
  return conteudo
}

// Um modelo para todos os avisos (server/assets/email): HTML e a versão em texto.
async function compilar(): Promise<{ html: TemplateDelegate; texto: TemplateDelegate }> {
  if (modelos) return modelos
  const [html, texto] = await Promise.all([ler('aviso.hbs'), ler('aviso.txt.hbs')])
  modelos = {
    html: handlebars.compile(html),
    texto: handlebars.compile(texto, { noEscape: true }),
  }
  return modelos
}

function linha(value: string): string {
  return value.replaceAll(/\s+/gu, ' ').trim()
}

function maiuscula(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

// Avisa a equipe por e-mail, depois de salvar no banco. Nunca derruba a ação do cliente:
// fora de produção, sem chave ou com falha no envio, só registra no log.
export async function avisar(aviso: Aviso): Promise<void> {
  const { mail, public: pub } = useRuntimeConfig()
  if (import.meta.dev || !mail.pass || !mail.from || !mail.to) return

  transporter ??= createTransport({
    host: mail.host,
    port: mail.port,
    secure: mail.port === 465,
    requireTLS: mail.port !== 465,
    auth: { user: mail.user, pass: mail.pass },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 10_000,
  })

  try {
    const { html, texto } = await compilar()
    const dados = {
      ...aviso,
      campos: aviso.campos.flatMap(([rotulo, valor]) => (valor ? [{ rotulo, valor }] : [])),
      link: new URL(aviso.caminho, pub.siteUrl).href,
      data: new Date().toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        dateStyle: 'short',
        timeStyle: 'short',
      }),
    }
    await transporter.sendMail({
      from: mail.from,
      to: mail.to,
      replyTo: aviso.responderPara,
      subject: linha(aviso.assunto),
      html: html(dados),
      text: texto(dados),
    })
  } catch (error) {
    console.error('Falha ao enviar aviso por e-mail', error)
  }
}

// Só celular (11 dígitos, 9 depois do DDD): é o que abre conversa no WhatsApp.
export function whatsapp(telefone: string | undefined): string | null {
  const numero = digits(telefone ?? '')
  return numero.length === 11 && numero[2] === '9' ? `https://wa.me/55${numero}` : null
}

export async function cliente(email: string): Promise<Cliente> {
  const lead = await Leads.findOne({ email })
    .select('nome empresa cargo telefone')
    .lean()
    .catch(() => null)
  return {
    nome: lead?.nome ?? email,
    empresa: lead?.empresa,
    cargo: lead?.cargo,
    telefone: lead?.telefone,
    email,
  }
}

export function matrizTexto(rec: RecomendacaoCoroa): string {
  return rec.resultado.abrasiva ? `${rec.matriz} (versão abrasiva)` : rec.matriz
}

export function rochaTexto(rec: RecomendacaoCoroa): string {
  return rec.rocha || 'Rocha não listada'
}

// Dados da coroa com os rótulos em português, como aparecem na seleção.
export function dadosCoroa(rec: RecomendacaoCoroa): Record<string, string | null> {
  const { entrada, resultado, local } = rec
  return {
    rocha: rochaTexto(rec),
    diametro: rec.diametro,
    testemunho: maiuscula(PT.cond[entrada.testemunho]),
    abrasividade: maiuscula(PT.abra[resultado.abrasividade]),
    granulometria: maiuscula(PT.grain[resultado.granulometria]),
    matriz: matrizTexto(rec),
    canal: resultado.canal,
    cidade: local ? `${local.cidade}/${local.uf}` : null,
  }
}

export function simNao(value: boolean | undefined): string | null {
  if (value === undefined) return null
  return value ? 'Sim' : 'Não'
}
