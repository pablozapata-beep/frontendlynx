import type { InjectionKey, Ref } from 'vue'

export interface RadioGroupContext {
  name: Ref<string>
  modelValue: Ref<unknown>
  disabled: Ref<boolean>
  select: (value: unknown) => void
}

export const radioGroupKey: InjectionKey<RadioGroupContext> = Symbol('ui-radio-group')
