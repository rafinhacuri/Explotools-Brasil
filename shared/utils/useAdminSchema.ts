// oxlint-disable typescript/explicit-function-return-type typescript/explicit-module-boundary-types harlanzw/vue-no-faux-composables unicorn/max-nested-calls
import {
  check,
  email,
  forward,
  maxLength,
  minLength,
  nonEmpty,
  object,
  pipe,
  string,
  toLowerCase,
  trim,
} from 'valibot'
import type { InferInput } from 'valibot'

export function useAdminSchema() {
  const emailField = pipe(
    string('Informe o e-mail'),
    trim(),
    toLowerCase(),
    nonEmpty('Informe o e-mail'),
    email('Informe um e-mail válido'),
  )

  const loginSchema = object({
    email: emailField,
    senha: pipe(string('Informe a senha'), nonEmpty('Informe a senha')),
  })

  const adminSchema = pipe(
    object({
      email: emailField,
      senha: pipe(
        string('Informe a senha'),
        minLength(8, 'A senha precisa de pelo menos 8 caracteres'),
        maxLength(128, 'A senha pode ter no máximo 128 caracteres'),
      ),
      confirmacao: pipe(string('Confirme a senha'), nonEmpty('Confirme a senha')),
    }),
    forward(
      check((data) => data.senha === data.confirmacao, 'As senhas não conferem'),
      ['confirmacao'],
    ),
  )

  return { loginSchema, adminSchema }
}

export type LoginSchema = InferInput<ReturnType<typeof useAdminSchema>['loginSchema']>

export type AdminSchema = InferInput<ReturnType<typeof useAdminSchema>['adminSchema']>
