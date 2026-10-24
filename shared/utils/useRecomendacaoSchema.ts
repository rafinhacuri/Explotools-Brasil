// oxlint-disable typescript/explicit-function-return-type typescript/explicit-module-boundary-types harlanzw/vue-no-faux-composables unicorn/max-nested-calls
import {
  maxLength,
  maxValue,
  minValue,
  number,
  object,
  optional,
  picklist,
  pipe,
  string,
  trim,
} from 'valibot'
import type { InferInput } from 'valibot'

export const ABRASIVIDADES = ['Baixa', 'Média', 'Alta'] as const
export const GRANULOMETRIAS = ['Fino', 'Médio', 'Grosso'] as const
export const DIAMETROS = ['BQ', 'NQ', 'NQ2', 'HQ', 'PQ'] as const
export const FORMACOES = ['Friável / Fraturada', 'Moderada', 'Compacta'] as const
export const OBJETIVOS = ['Penetração', 'Equilíbrio', 'Vida útil'] as const

export function useRecomendacaoSchema() {
  const recomendacaoSchema = object({
    rocha: optional(pipe(string(), trim(), maxLength(120))),
    mohs: pipe(
      number('Selecione a dureza Mohs'),
      minValue(1, 'Selecione a dureza Mohs'),
      maxValue(10),
    ),
    abrasividade: picklist(ABRASIVIDADES, 'Selecione a abrasividade'),
    granulometria: picklist(GRANULOMETRIAS, 'Selecione a granulometria'),
    diametro: picklist(DIAMETROS, 'Selecione o diâmetro'),
    formacao: picklist(FORMACOES, 'Selecione a formação'),
    objetivo: picklist(OBJETIVOS, 'Selecione o objetivo'),
  })

  return { recomendacaoSchema }
}

export type RecomendacaoSchema = InferInput<
  ReturnType<typeof useRecomendacaoSchema>['recomendacaoSchema']
>
