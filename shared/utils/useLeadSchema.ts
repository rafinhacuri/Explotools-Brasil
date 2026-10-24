// oxlint-disable typescript/explicit-function-return-type typescript/explicit-module-boundary-types harlanzw/vue-no-faux-composables unicorn/max-nested-calls
import {
  boolean,
  check,
  email,
  maxLength,
  minLength,
  nonEmpty,
  object,
  optional,
  partial,
  pipe,
  string,
  toLowerCase,
  trim,
} from 'valibot'
import type { InferInput, InferOutput } from 'valibot'

export function useLeadSchema() {
  const emailField = pipe(
    string('Informe seu e-mail'),
    trim(),
    toLowerCase(),
    nonEmpty('Informe seu e-mail'),
    email('Informe um e-mail válido'),
  )

  const leadSchema = object({
    nome: pipe(
      string('Informe seu nome'),
      trim(),
      minLength(2, 'Informe seu nome'),
      maxLength(120),
    ),
    email: emailField,
    telefone: pipe(
      string('Informe seu telefone'),
      trim(),
      check((value) => value.replaceAll(/\D/gu, '').length >= 10, 'Informe um telefone com DDD'),
    ),
    empresa: pipe(
      string('Informe a empresa'),
      trim(),
      nonEmpty('Informe a empresa'),
      maxLength(120),
    ),
    cargo: pipe(string('Informe o cargo'), trim(), nonEmpty('Informe o cargo'), maxLength(120)),
    wireline: optional(boolean()),
  })

  const leadUpdateSchema = partial(leadSchema)

  const leadAccessSchema = object({ email: emailField })

  return { leadSchema, leadUpdateSchema, leadAccessSchema }
}

export type LeadSchema = InferInput<ReturnType<typeof useLeadSchema>['leadSchema']>

export type LeadOutput = InferOutput<ReturnType<typeof useLeadSchema>['leadSchema']>

export type LeadUpdateSchema = InferInput<ReturnType<typeof useLeadSchema>['leadUpdateSchema']>

export type LeadAccessSchema = InferInput<ReturnType<typeof useLeadSchema>['leadAccessSchema']>
