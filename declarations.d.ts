// ! Código temporário para corrigir erro de tipagem do Vue 3
/* eslint-disable typescript/no-empty-object-type */
import type {
  ComponentCustomOptions as _ComponentCustomOptions,
  ComponentCustomProperties as _ComponentCustomProperties,
} from 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties extends _ComponentCustomProperties{}
  interface ComponentCustomOptions extends _ComponentCustomOptions{}
}
